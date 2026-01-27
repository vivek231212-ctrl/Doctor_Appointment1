
import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-10 h-[64px]">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
};

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex flex-col flex-1 p-6 overflow-y-auto ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = "", disabled }) => {
  const variants = {
    primary: "bg-[#1A73E8] text-white hover:bg-[#1557B0] shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-4 px-6 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
