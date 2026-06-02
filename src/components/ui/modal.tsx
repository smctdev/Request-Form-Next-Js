import { ReactNode, useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Modal = ({
  isOpen,
  children,
  title,
  handleSubmit,
  handleClose,
  isLoading,
}: {
  isOpen: boolean;
  children: ReactNode;
  title: string;
  handleSubmit: (data: any) => void;
  isLoading: boolean;
  handleClose?: () => void;
}) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <h3 className="!text-lg font-bold text-base-content">{title}</h3>
          {handleClose && (
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-base-content/40 hover:text-base-content hover:bg-base-200 transition-colors disabled:opacity-40"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-base-300">
          {handleClose && (
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-base-200 hover:bg-base-300 text-base-content transition-colors disabled:opacity-50"
            >
              Close
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-semibold text-primary-content bg-primary hover:opacity-90 active:scale-[0.98] rounded-xl transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <BiLoader className="animate-spin w-4 h-4" />
                <span>Submitting...</span>
              </>
            ) : (
              "Save Signature"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
