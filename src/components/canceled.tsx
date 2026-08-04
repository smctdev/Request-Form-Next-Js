import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Canceled() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-2 items-center">
        <XMarkIcon className="w-50 h-50" />
        <div className="text-[28px]! font-bold">
          Request form is not printable because it has been canceled.
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.close()}
        >
          Close
        </button>
      </div>
    </div>
  );
}
