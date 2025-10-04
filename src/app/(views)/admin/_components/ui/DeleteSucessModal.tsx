import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const DeleteSuccessModal = ({
  showDeleteSuccessModal,
  closeDeleteSuccessModal,
  entityType,
}: {
  showDeleteSuccessModal: boolean;
  closeDeleteSuccessModal: any;
  openDeleteSuccessModal: any;
  entityType: string;
}) => {
  if (!showDeleteSuccessModal) {
    return null;
  }

  return (
    showDeleteSuccessModal && (
      <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-black/50 z-50 ">
        <div className="relative flex flex-col items-center justify-center w-1/2 bg-base-100 rounded-md lg:w-1/6 ">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="absolute !size-20 text-primary -top-6 "
          />
          <div>
            <h1 className="mt-20 text-[28px] font-bold text-center">Success</h1>
            <p className="font-semibold text-center text-gray-400 my-7">
              {entityType} Deleted!
            </p>
          </div>
          <div className="flex items-center justify-center w-full p-4 rounded-b-lg bg-graybg">
            <button
              className=" bg-primary p-2 w-1/2 rounded-[12px] text-white font-extrabold"
              onClick={closeDeleteSuccessModal}
            >
              OKAY
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default DeleteSuccessModal;
