import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { Cropper, CropperRef, CropperPreview, CropperPreviewRef } from 'react-advanced-cropper';
import { AdjustablePreviewBackground } from './components/AdjustablePreviewBackground';
import { Navigation } from './components/Navigation';
import { Slider } from './components/Slider';
import { AdjustableCropperBackground }  from './components/AdjustableCropperBackground';
import { Button } from './components/Button';
import { ResetIcon } from './icons/ResetIcon';
import './ImageEditor.css';


// // Load the polyfill for Safari browser
// if (typeof window !== 'undefined') {
//   require('context-filter-polyfill');
// }

export const ImageEditor = () => {
  // Define the Cropper and CropperPreview references
  const cropperRef = useRef(null);
  const previewRef = useRef(null);

  // Set the initial image source
  const [src, setSrc] = useState('/react-advanced-cropper/img/images/pexels-photo-4383577.jpeg');

  // Set the initial mode
  const [mode, setMode] = useState('crop');

  // Define the initial adjustments
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
  });

  // Update the adjustments
  const onChangeValue = (value) => {
    if (mode in adjustments) {
      setAdjustments((previousValue) => ({
        ...previousValue,
        [mode]: value,
      }));
    }
  };

  // Reset adjustments and mode
  const onReset = () => {
    setMode('crop');
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
    });
  };

  // Upload a new image
  const onUpload = (blob) => {
    onReset();
    setMode('crop');
    setSrc(blob);
  };

  // Download the edited image
  const onDownload = () => {
    if (cropperRef.current) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `<img src="${cropperRef.current.getCanvas()?.toDataURL()}"/>`;
      }
    }
  };

  // Update the preview when the Cropper updates
  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  // Check if any adjustments have been made
  const changed = Object.values(adjustments).some((el) => Math.floor(el * 100));

  // Check if the current mode is 'crop'
  const cropperEnabled = mode === 'crop';

  return (
    <div className={'image-editor'}>
        <div className="image-editor__cropper">
            <Cropper
                src={src}
                ref={cropperRef}
                stencilProps={{
                    movable: cropperEnabled,
                    resizable: cropperEnabled,
                    lines: cropperEnabled,
                    handlers: cropperEnabled,
                    overlayClassName: cn(
                        'image-editor__cropper-overlay',
                        !cropperEnabled && 'image-editor__cropper-overlay--faded',
                    ),
                }}
                backgroundWrapperProps={{
                    scaleImage: cropperEnabled,
                    moveImage: cropperEnabled,
                }}
                backgroundComponent={AdjustableCropperBackground}
                backgroundProps={adjustments}
                onUpdate={onUpdate}
            />
            {mode !== 'crop' && (
                <Slider className="image-editor__slider" value={adjustments[mode]} onChange={onChangeValue} />
            )}
            <CropperPreview
                className={'image-editor__preview'}
                ref={previewRef}
                cropper={cropperRef}
                backgroundComponent={AdjustablePreviewBackground}
                backgroundProps={adjustments}
            />
            <Button
                className={cn('image-editor__reset-button', !changed && 'image-editor__reset-button--hidden')}
                onClick={onReset}
            >
                <ResetIcon />
            </Button>
        </div>
        <Navigation mode={mode} onChange={setMode} onUpload={onUpload} onDownload={onDownload} />
    </div>
);
};