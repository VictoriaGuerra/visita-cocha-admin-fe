import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ value = [], onChange, multiple = false }) => {
  const fileInputRef = useRef();
  const [previewUrls, setPreviewUrls] = useState(
    Array.isArray(value) ? value : value ? [value] : []
  );

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    
    if (multiple) {
      setPreviewUrls(prev => [...prev, ...urls]);
      onChange([...value, ...files]);
    } else {
      setPreviewUrls([urls[0]]);
      onChange(files[0]);
    }
  };

  const handleRemoveImage = (index) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    
    if (multiple) {
      const newValue = Array.isArray(value) 
        ? value.filter((_, i) => i !== index) 
        : [];
      onChange(newValue);
    } else {
      onChange(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragging');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragging');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragging');
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileChange(event);
    }
  };

  return (
    <div className="image-upload">
      <div
        className="upload-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple={multiple}
          style={{ display: 'none' }}
        />
        <div className="upload-message">
          <i className="fas fa-cloud-upload-alt"></i>
          <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
        </div>
      </div>
      
      {previewUrls.length > 0 && (
        <div className="preview-container">
          {previewUrls.map((url, index) => (
            <div key={url} className="preview-item">
              <img src={url} alt={`Preview ${index + 1}`} />
              <button
                type="button"
                className="remove-image"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;