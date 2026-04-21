import React from "react";

const SubmitBtn = ({ title, onClick, disabled, type = "button", className = "", icon = null }) => {
  // کلاس‌های پایه دکمه
  const baseClasses = `
    relative px-6 py-3 rounded-md isolation-auto z-10 border-2 border-slate-900 
    text-slate-900  font-semibold shadow-sm overflow-hidden 
    inline-flex items-center justify-center text-base gap-x-2 
    transition-all duration-300
  `;

  // کلاس‌های مربوط به افکت hover
  const hoverEffectClasses = `
    before:absolute before:w-0 before:transition-all before:duration-500 before:hover:w-full 
    hover:text-white before:-right-full before:hover:right-0 before:rounded-full before:bg-slate-900 
    before:-z-10 before:aspect-square before:hover:scale-150
  `;
  
  // کلاس‌های حالت غیرفعال
  const disabledClasses = `
    disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
    disabled:before:hidden
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${hoverEffectClasses} ${disabledClasses} ${className}`}
    >
      {icon && <span className="ml-2">{icon}</span>}
      {title}
    </button>
  );
};

export default SubmitBtn;