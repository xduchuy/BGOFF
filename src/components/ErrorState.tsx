import React from 'react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry }) => {
  // Map errors into user-friendly Vietnamese notifications matching template styles
  const getFriendlyMessage = (msg: string) => {
    const lowercaseMsg = msg.toLowerCase();
    
    if (lowercaseMsg.includes('invalid file') || lowercaseMsg.includes('không hợp lệ')) {
      return 'Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh có định dạng JPG, PNG hoặc WebP.';
    }
    if (lowercaseMsg.includes('large') || lowercaseMsg.includes('quá lớn')) {
      return 'Kích thước ảnh quá lớn. Hãy chọn ảnh nhỏ hơn 25MB để đảm bảo hiệu năng thiết bị.';
    }
    if (lowercaseMsg.includes('webgl') || lowercaseMsg.includes('not supported') || lowercaseMsg.includes('hỗ trợ')) {
      return 'Trình duyệt của bạn hiện không hỗ trợ tính năng xử lý AI trực tiếp trên thiết bị.';
    }
    if (lowercaseMsg.includes('model') || lowercaseMsg.includes('fetch') || lowercaseMsg.includes('network')) {
      return 'Không thể tải xuống dữ liệu AI model. Hãy kiểm tra kết nối Internet của bạn và thử lại.';
    }
    
    return errorMessage || 'Đã xảy ra sự cố trong quá trình tách nền. Vui lòng thử lại.';
  };

  return (
    <div className="w-full">
      <div className="glass-card w-full rounded-[24px] p-8 flex flex-col items-center text-center">
        {/* Dynamic Info/Warning Icon */}
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <span
            className="material-symbols-outlined text-[48px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
        </div>
        
        {/* Error Content */}
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-8 px-2">
          {getFriendlyMessage(errorMessage)}
        </p>
        
        {/* Primary Action */}
        <button
          onClick={onRetry}
          className="w-full h-[52px] bg-primary text-on-primary rounded-full font-button text-button shadow-lg active-scale transition-all duration-200"
        >
          Try Again
        </button>

        {/* Secondary Support Action */}
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 text-on-surface-variant font-label-md text-label-md uppercase tracking-widest hover:text-primary transition-colors focus:outline-none"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};
