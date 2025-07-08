import { ReactNode, useEffect } from "react";
import { BiLoader } from "react-icons/bi";

const Modal = ({
  isOpen,
  children,
  title,
  handleSubmit,
  isLoading,
}: {
  isOpen: boolean;
  children: ReactNode;
  title: string;
  handleSubmit: (data: any) => void;
  isLoading: boolean;
}) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="p-4">{children}</div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 flex gap-1 items-center text-sm font-medium text-white rounded-md hover:bg-blue-700 ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 "
            }`}
          >
            {isLoading ? (
              <>
                <span>
                  <BiLoader className="animate-spin" />
                </span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
