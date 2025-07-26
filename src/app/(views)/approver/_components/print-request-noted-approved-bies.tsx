import Storage from "@/utils/storage";
import Image from "next/image";

export default function PrintRequestNotedApprovedBies({ printData }: any) {
  return (
    <>
      <div className="mt-4 ml-8">
        <div className="flex flex-wrap justify-start ">
          {/* Requested By Section */}
          <div className="flex-grow mb-4">
            <h3 className="mb-2 text-sm font-normal">Requested By:</h3>
            <div className="flex flex-wrap justify-start">
              <div className="relative flex flex-col items-center justify-center pt-3 mr-10">
                <Image
                  className="absolute transform -translate-x-1/2 -translate-y-6 pointer-events-none left-1/2"
                  src={Storage(printData?.id?.requested_signature) || ""}
                  alt="avatar"
                  width={120}
                  height={120}
                />
                <p className="relative z-10 text-xs font-medium text-center underline">
                  {printData?.id?.requested_by}
                </p>
                <p className="text-xs font-light text-center">
                  {printData?.id?.requested_position}
                </p>
              </div>
            </div>
          </div>

          {/* Noted By Section */}
          {printData?.notedBy?.length > 0 && (
            <div className="flex-grow mb-4">
              <h3 className="mb-2 text-sm font-normal">Noted By:</h3>
              <div className="flex flex-wrap justify-start">
                {printData?.notedBy.map((approver: any, index: number) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center justify-center pt-3 mr-10"
                  >
                    {approver.status === "Approved" && (
                      <Image
                        className="absolute transform -translate-x-1/2 -translate-y-6 pointer-events-none left-1/2"
                        src={Storage(approver.signature) || ""}
                        alt=""
                        width={120}
                        height={120}
                      />
                    )}
                    <p className="relative z-10 text-xs font-medium text-center underline">
                      {approver.firstName} {approver.lastName}
                    </p>
                    <p className="text-xs font-light text-center">
                      {approver.position}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved By Section */}
          <div className="flex-grow mb-4">
            <h3 className="mb-2 text-sm font-normal">Approved By:</h3>
            <div className="flex flex-wrap justify-start">
              {printData?.approvedBy.map((approver: any, index: number) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center pt-3 mr-10"
                >
                  {approver.status === "Approved" && (
                    <Image
                      className="absolute transform -translate-x-1/2 -translate-y-6 pointer-events-none left-1/2"
                      src={Storage(approver.signature) || ""}
                      alt=""
                      width={120}
                      height={120}
                    />
                  )}
                  <p className="relative z-10 text-xs font-medium text-center underline">
                    {approver.firstName} {approver.lastName}
                  </p>
                  <p className="text-xs font-light text-center">
                    {approver.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
