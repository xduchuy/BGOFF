import React, { useState, useRef } from 'react';

interface EmptyStateProps {
  onFileSelect: (file: File) => void;
  onError: (errMessage: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onFileSelect, onError }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      onError('File không hợp lệ. Vui lòng chọn ảnh JPG, PNG hoặc WebP.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      onError('Ảnh quá lớn. Kích thước ảnh tối đa được phép là 25MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleChange}
      />

      {/* Hero/Upload Section */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full glass-card rounded-[32px] p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-primary/50 bg-primary/5 scale-[1.01]' : 'hover:border-primary/20'
        }`}
      >
        {/* Icon Area */}
        <div className="w-24 h-24 rounded-3xl transparency-grid border border-outline-variant/30 flex items-center justify-center mb-6 relative overflow-hidden group">
          <span className="material-symbols-outlined text-4xl text-primary/40 group-hover:scale-110 transition-transform duration-300">
            ink_eraser
          </span>
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Text Content */}
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2">
          Drop photo here or select
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-8">
          Supports JPG, PNG, WebP
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick();
          }}
          className="w-full h-[52px] bg-primary text-on-primary font-button text-button rounded-[24px] flex items-center justify-center gap-2 shadow-lg active-scale transition-all hover:bg-primary-container"
        >
          <span className="material-symbols-outlined">add_photo_alternate</span>
          Select Photo
        </button>
      </div>

      {/* Quick Tips Bento Snippet */}
      <div className="w-full mt-4 grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-[24px] flex flex-col gap-2">
          <span className="material-symbols-outlined text-primary/60 text-lg">bolt</span>
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest">
            Instant
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Remove backgrounds in 3 seconds.
          </p>
        </div>
        <div className="glass-card p-4 rounded-[24px] flex flex-col gap-2">
          <span className="material-symbols-outlined text-primary/60 text-lg">hd</span>
          <p className="font-label-md text-label-md text-primary uppercase tracking-widest">
            HQ Output
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Full resolution export included.
          </p>
        </div>
      </div>
    </div>
  );
};
