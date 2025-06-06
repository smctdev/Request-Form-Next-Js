import { FullnameAcronymType } from "@/types/fullnameAcronym,";

export default function fullnameAcronym({
  fullName,
  width,
  height,
  textSize,
}: FullnameAcronymType) {
  return (
    <div className="rounded-full cursor-pointer sm:block hidden bg-gray-200">
      <div
        className={`flex items-center justify-center font-bold ${textSize} text-gray-600 ${height} ${width}`}
      >
        {fullName.charAt(0).toUpperCase() +
          fullName
            .split(" ")
            [fullName.split(" ").length - 1].charAt(0)
            .toUpperCase()}
      </div>
    </div>
  );
}
