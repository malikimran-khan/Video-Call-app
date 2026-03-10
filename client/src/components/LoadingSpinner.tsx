import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  label,
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: { spinner: "w-6 h-6", border: "border-2", text: "text-xs" },
    md: { spinner: "w-10 h-10", border: "border-[3px]", text: "text-sm" },
    lg: { spinner: "w-14 h-14", border: "border-4", text: "text-base" },
  };

  const s = sizeMap[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Outer ring */}
      <div className="relative">
        <div
          className={`${s.spinner} rounded-full ${s.border} border-gray-200`}
        />
        <div
          className={`${s.spinner} rounded-full ${s.border} border-transparent border-t-black animate-spin absolute inset-0`}
        />
      </div>
      {label && (
        <span className={`${s.text} text-gray-500 font-medium animate-pulse`}>
          {label}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[120px]">
      {content}
    </div>
  );
};

export default LoadingSpinner;
