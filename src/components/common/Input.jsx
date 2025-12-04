import React from 'react';

export const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    className = '',
    error,
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 transition
                    ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'}
                `}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
