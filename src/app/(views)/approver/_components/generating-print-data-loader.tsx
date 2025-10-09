import { RiLoader4Line } from "react-icons/ri";

export default function GeneratingPrintDataLoader() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex gap-2 items-center text-blue-500">
        <RiLoader4Line className="animate-spin !text-2xl " />
        <span className="!text-2xl ">Generating Print Data...</span>
      </div>
    </div>
  );
}
