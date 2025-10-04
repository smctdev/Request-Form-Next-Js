import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface ApproveSuccessModalProps {
  closeModal: () => void;
  closeParentModal: () => void;
  status: "approved" | "disapproved";
}

const ApproveSuccessModal: React.FC<ApproveSuccessModalProps> = ({
  closeModal,
  closeParentModal,
  status,
}) => {
  const handleOkayClick = () => {
    closeModal();
    closeParentModal(); // Close both modals
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative flex flex-col items-center justify-center w-10/12 bg-base-100 rounded-md sm:w-1/3">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="absolute !size-20 text-primary -top-6"
        />
        <div>
          <h1 className="mt-20 text-[28px] font-bold text-center">
            {" "}
            {status === "approved" ? "Approved!" : "Disapproved!"}
          </h1>
          <p className="font-semibold text-center text-gray-400 my-7"></p>
        </div>
        <div className="flex items-center justify-center w-full p-4 rounded-b-lg bg-graybg">
          <button
            className="bg-primary p-2 w-1/2 rounded-[12px] text-white font-extrabold"
            onClick={handleOkayClick}
          >
            OKAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveSuccessModal;
