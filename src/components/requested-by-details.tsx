import Storage from "@/utils/storage";
import Image from "next/image";

export default function RequestedByDetail({ record }: any) {
  return (
    <div className="mb-4 ml-5">
      <h3 className="mb-3 font-bold">Requested By:</h3>
      <ul className="flex flex-wrap gap-6">
        <li className="relative flex flex-col items-center justify-center w-auto text-center">
          <div className="relative flex flex-col items-center justify-center">
            {/* Signature */}
            {record?.user?.signature && (
              <div className="absolute -top-4">
                <Image
                  src={Storage(record?.user?.signature || "")}
                  alt="avatar"
                  width={120}
                  height={120}
                  className="relative z-20 pointer-events-none"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ filter: "blur(1px)" }} // Optional: Apply a blur
                />
              </div>
            )}
            {/* Name */}
            <p className="relative z-10 inline-block mt-4 font-medium text-center uppercase">
              <span className="relative z-10">
                {record?.user?.firstName} {record?.user?.lastName}
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-black"></span>
            </p>
            {/* Position */}
            <p className="font-bold text-[12px] text-center mt-1">
              {record?.user?.position}
            </p>
            {/* Status, if needed */}
            {record?.user?.status && (
              <p
                className={`font-bold text-[12px] text-center mt-1 ${
                  record?.user?.status === "Approved"
                    ? "text-green-400"
                    : record?.user?.status === "Pending"
                    ? "text-yellow-400"
                    : record?.user?.status === "Rejected"
                    ? "text-red"
                    : ""
                }`}
              >
                {record?.user?.status}
              </p>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}
