import React from 'react';

// Generic modal component to show filters or any content
const FilterModal = ({ isOpen, title = 'Filters', onClose, onApply, onReset, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with subtle gradient + blur */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/40 to-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:max-w-2xl">
        <div className="relative rounded-t-2xl md:rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_40px_rgba(31,38,135,0.3)] ring-1 ring-white/20 md:mx-auto md:w-full md:max-w-2xl">
          {/* top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-white/10">
            <h3 className="text-lg font-semibold text-slate-900/90">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/30 transition"
              aria-label="Close filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 max-h-[70vh] md:max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-white/20 bg-white/10">
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-md text-slate-800 bg-white/40 border border-white/50 hover:bg-white/60 backdrop-blur"
            >
              Reset
            </button>
            <div className="ml-auto" />
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-slate-800 bg-white/40 border border-white/50 hover:bg-white/60 backdrop-blur"
            >
              Cancel
            </button>
            <button
              onClick={onApply}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;