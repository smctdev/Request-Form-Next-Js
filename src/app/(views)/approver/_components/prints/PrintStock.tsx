import React, { useEffect, useState } from "react";
import SMCTLogo from "@/assets/SMCT.png";
import DSMLogo from "@/assets/DSM.jpg";
import DAPLogo from "@/assets/DAP.jpg";
import HDILogo from "@/assets/HDI.jpg";
import HOLogo from "@/assets/logo.png";
import Image from "next/image";
import formattedAmount from "@/utils/formattedAmount";
import Storage from "@/utils/storage";
type PrintRefundProps = {
  data?: any;
};

const PrintStock: React.FC<PrintRefundProps> = ({ data }) => {
  const [printData, setPrintData] = useState<any>(null); // State to hold print data
  let logo;
  if (printData?.user?.branch.branch === "Strong Moto Centrum, Inc.") {
    logo = <Image width={100} height={100} src={SMCTLogo} alt="SMCT Logo" />;
  } else if (printData?.user?.branch.branch === "Des Strong Motors, Inc.") {
    logo = <Image width={100} height={100} src={DSMLogo} alt="DSM Logo" />;
  } else if (printData?.user?.branch.branch === "Des Appliance Plaza, Inc.") {
    logo = <Image width={100} height={100} src={DAPLogo} alt="DAP Logo" />;
  } else if (printData?.user?.branch.branch === "Honda Des, Inc.") {
    logo = <Image width={100} height={100} src={HDILogo} alt="HDI Logo" />;
  } else if (printData?.user?.branch.branch === "Head Office") {
    logo = (
      <div className="flex items-center justify-center">
        <Image
          width={100}
          height={100}
          src={HOLogo}
          alt="HO Logo"
          className="w-44"
        />
      </div>
    );
  } else {
    logo = null; // Handle the case where branch does not match any of the above
  }
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ""; // Return empty string if dateString is undefined or null

    // Convert dateString to Date object
    const date = new Date(dateString);

    // Check if date is a valid Date object
    if (!(date instanceof Date && !isNaN(date.getTime()))) {
      return ""; // Return empty string if date is not a valid Date object
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("printData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setPrintData(parsedData);
    }

    localStorage.removeItem("printData");
  }, []);

  useEffect(() => {
    if (printData !== null) {
      let isPrinting = false;

      window.onbeforeprint = () => {
        isPrinting = true;
      };

      window.onafterprint = () => {
        localStorage.removeItem("printData");
        window.close();
      };

      window.print();

      setTimeout(() => {
        if (!isPrinting) {
          window.close();
        }
      }, 500);
    }
  }, [printData]);
  const tableStyle = "border-b border-black text-sm font-normal";

  return (
    <div className="text-black bg-white h-lvh ">
      <style>
        {`
        @media print
        {
          @page{
          size: letter;
          margin:20px; 
          }
        }
        `}
      </style>
      <div className="px-4 pt-2 border-2 border-black">
        <div className="flex justify-end pr-3">
          <p className="flex text-sm font-medium">
            Date:{" "}
            <span className="ml-2 text-sm font-normal underline">
              {formatDate(printData?.id.created_at)}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center w-1/2 ">{logo}</div>

          <h1 className="mt-2 text-sm font-semibold uppercase">
            Stock Requisition Slip
          </h1>
          <div className="flex flex-col items-center mt-2 font-bold">
            <h1 className="text-sm font-medium underline uppercase">
              {printData?.user?.data?.branch?.branch}
            </h1>
            <h1 className="text-sm font-semibold">BRANCH</h1>
          </div>
        </div>
        <div className="flex justify-start pr-6">
          <p className="flex mb-1 text-sm font-medium ">
            Purpose: {printData?.purpose}
          </p>
        </div>
        <div className="flex justify-center w-full">
          <table className="w-full border-separate border-spacing-x-4">
            <thead>
              <tr>
                <th className="text-sm font-medium">QUANTITY</th>
                <th className="text-sm font-medium">DESCRIPTION</th>
                <th className="text-sm font-medium whitespace-nowrap">
                  UNIT COST
                </th>
                <th className="text-sm font-medium whitespace-nowrap">
                  TOTAL AMOUNT
                </th>
                <th className="text-sm font-medium">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {printData?.id.form_data.map((formData: any, index: number) => (
                <React.Fragment key={index}>
                  {formData.items.map((item: any, itemIndex: number) => (
                    <tr key={itemIndex} className="text-center">
                      <td className={`${tableStyle}`}>{item.quantity}</td>
                      <td className={`${tableStyle}`}>{item.description}</td>
                      <td className={`${tableStyle}`}>{formattedAmount(item.unitCost)}</td>
                      <td className={`${tableStyle}`}>{formattedAmount(item.totalAmount)}</td>
                      <td className={`${tableStyle}`}>{item.remarks}</td>
                    </tr>
                  ))}
                  <tr key="empty-0-0">
                    <td className={`${tableStyle} py-2`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                    <td className={`${tableStyle}`}></td>
                  </tr>
                </React.Fragment>
              ))}
              <tr>
                <td></td>
                <td className="pt-2 text-sm font-medium text-right uppercase whitespace-nowrap">
                  Grand Total:
                </td>
                <td></td>
                <td className="pt-2 text-sm font-medium text-center">
                  ₱ {printData?.id.form_data[0].grand_total}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 ml-8">
          <div className="flex flex-wrap justify-start ">
            {/* Requested By Section */}
            <div className="flex-grow mb-4">
              <h3 className="mb-2 text-sm font-normal">Requested By:</h3>
              <div className="flex flex-wrap justify-start">
                <div className="relative flex flex-col items-center justify-center pt-3 mr-10">
                  <Image
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2"
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
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none left-1/2"
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
                        className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none left-1/2"
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
      </div>
    </div>
  );
};

export default PrintStock;
