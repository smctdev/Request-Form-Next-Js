import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Record {
  id: number;
  branch: string;
  branch_code: string;
}

interface ViewBranchModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
  user: Record | null;
}

const ViewBranchModal: React.FC<ViewBranchModalProps> = ({
  modalIsOpen,
  closeModal,
  user,
}) => {
  if (!modalIsOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black/50 z-50 ">
      <div className=" p-4  w-1/2  relative bg-primary flex justify-center mx-20  border-b rounded-t-[12px]">
        <h2 className="text-center  text-xl md:text-[32px] font-bold text-white">
          Branch
        </h2>
        <XMarkIcon
          className="absolute   cursor-pointer size-6 right-3"
          onClick={closeModal}
        />
      </div>
      <div className="bg-base-100 w-1/2 rounded-b-[12px] shadow-lg   lg:overflow h-auto px-14">
        {user && (
          <div className="grid gap-4 mt-5 mb-10 lg:grid-cols-2 justify-items-center place-content-center">
            {Object.entries(user).map(([key, value]) => (
              <div key={key} className="w-2/3 sm:w-full ">
                <p className="font-bold">{`${
                  key.replace(/_/g, " ").charAt(0).toUpperCase() +
                  key.replace(/_/g, " ").slice(1)
                }`}</p>
                <div className="border p-2 border-black rounded-[12px] overflow-auto">
                  <p className="break-words">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBranchModal;
