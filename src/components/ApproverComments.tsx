import Storage from "@/utils/storage";
import Image from "next/image";

export default function ApproverComments({ record }: any) {
  return (
    <div className="w-full">
      <h2 className="mb-2 text-lg font-bold">Comments:</h2>

      {/* Check if there are no comments in both notedBy and approvedBy */}
      {record?.approval_process?.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <>
          {/* Render Approved By comments */}
          <ul className="flex flex-col w-full mb-4 space-y-4">
            {record?.approval_process.map((user: any, index: any) => (
              <div className="flex" key={index}>
                <div>
                  <Image
                    alt="avatar"
                    className="hidden cursor-pointer sm:block"
                    src={Storage(user?.user?.profile_picture)}
                    height={35}
                    width={45}
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ filter: "blur(1px)" }} // Optional: Apply a blur
                  />
                </div>
                <div className="flex flex-row w-full">
                  <li className="flex flex-col justify-between pl-2">
                    <h3 className="text-lg font-bold">
                      {user?.user?.fullName}
                    </h3>
                    <p>{user.comment}</p>
                  </li>
                </div>
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
