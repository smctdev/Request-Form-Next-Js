import { faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function ApprovedAttachments({ record, handleViewImage }: any) {
  let parsedAttachment = [];
  parsedAttachment =
    record?.approved_attachments?.length > 0
      ? JSON.parse(record?.approved_attachments)
      : [];
  // Handle the parsed attachment
  const fileUrls = parsedAttachment.map(
    (filePath: string) =>
      `${process.env.NEXT_PUBLIC_API_STORAGE_URL}/${filePath?.replace(
        /\\/g,
        "/"
      )}`
  );
  return (
    <div className="w-full max-w-full ">
      <p className="font-semibold">Approved Attachment:</p>

      {record?.approved_attachments?.length > 0 ? (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {fileUrls.map((attachmentItem: any, index: any) => (
            <div className="relative group" key={index}>
              <Image
                width={100}
                height={100}
                src={attachmentItem}
                alt="Approved Attachment"
                className="w-56 h-auto max-w-full rounded"
              />
              <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black/70 opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-center gap-10">
                  <a
                    className="tooltip tooltip-info tooltip-top"
                    data-tip="Download"
                    href={attachmentItem}
                    download
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="text-white w-7 h-7"
                    />
                  </a>

                  <button
                    onClick={() => handleViewImage(attachmentItem)}
                    className="focus:outline-none tooltip tooltip-info tooltip-top"
                    data-tip="View"
                  >
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-white w-7 h-7"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No approved attachment available.</p>
      )}
    </div>
  );
}
