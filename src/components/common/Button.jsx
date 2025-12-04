import React from 'react';

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button',
    disabled = false,
    fullWidth = false
}) => {
    const baseStyles = "px-4 py-2 rounded-md font-semibold transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-slate-800 text-white hover:bg-slate-900",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
        ghost: "text-slate-600 hover:text-slate-800 hover:bg-slate-50 shadow-none"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            {children}
        </button>
    );
};
