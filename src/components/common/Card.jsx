import React from 'react';

export const Card = ({ children, className = '', title, action }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className}`}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    {title && <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h2>}
                    {action}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
