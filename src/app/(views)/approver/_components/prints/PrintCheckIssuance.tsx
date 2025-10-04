import React, { useEffect, useState } from "react";
import SMCTLogo from "@/assets/SMCT.png";
import DSMLogo from "@/assets/DSM.jpg";
import DAPLogo from "@/assets/DAP.jpg";
import HDILogo from "@/assets/HDI.jpg";
import HOLogo from "@/assets/logo.png";
import Image from "next/image";
import formattedAmount from "@/utils/formattedAmount";
import PrintRequestNotedApprovedBies from "../print-request-noted-approved-bies";

type PrintRefundProps = {
  data?: any;
};

const PrintCheckIssuace: React.FC<PrintRefundProps> = ({ data }) => {
  const [printData, setPrintData] = useState<any>(null); // State to hold print data
  let logo;
  if (printData?.user?.branch.branch === "Strong Moto Centrum, Inc.") {
    logo = <Image width={100} height={100} src={SMCTLogo} alt="SMCT Logo" />;
  } else if (printData?.user?.branch.branch === "DES Strong Motors Inc.") {
    logo = <Image width={100} height={100} src={DSMLogo} alt="DSM Logo" />;
  } else if (printData?.user?.branch.branch === "DES Appliance Plaza Inc.") {
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
    <div className="  bg-base-100 h-lvh ">
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
        <div className="flex justify-between pr-3">
          <p className="flex text-sm font-medium">
            <span className="ml-2 text-sm font-normal underline">
              {printData?.id?.request_code}
            </span>
          </p>
          <p className="flex text-sm font-medium">
            Date:{" "}
            <span className="ml-2 text-sm font-normal underline">
              {formatDate(printData?.id.created_at)}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center w-1/2">{logo}</div>
          <h1 className="mt-2 text-sm font-semibold uppercase">
            Check Issuance Requisition Slip
          </h1>
          <div className="flex flex-col items-center mt-2 font-bold">
            <h1 className="text-sm font-medium underline uppercase">
              {printData?.user?.branch?.branch}
            </h1>
            <h1 className="text-sm font-semibold">BRANCH</h1>
          </div>
        </div>
        <div className="py-5 space-y-2">
          <div className="flex gap-3 items-center">
            <p className="font-semibold text-lg w-1/6">Payee:</p>
            <p className="border-b-1 w-1/2">{printData?.newPayee}</p>
          </div>
          <div className="flex gap-3 items-center">
            <p className="font-semibold text-lg w-1/6">Bank:</p>
            <p className="border-b-1 w-1/2">{printData?.newBank}</p>
          </div>
          <div className="flex gap-3 items-center">
            <p className="font-semibold text-lg w-1/6">Account No:</p>
            <p className="border-b-1 w-1/2">{printData?.newAccountNo}</p>
          </div>
          <div className="flex gap-3 items-center">
            <p className="font-semibold text-lg w-1/6">Swift Code:</p>
            <p className="border-b-1 w-1/2">{printData?.newSwiftCode}</p>
          </div>
        </div>
        <div className="flex justify-center w-full mt-2">
          <table className="w-full border-separate border-spacing-x-4">
            <thead className="">
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
                      <td className={`${tableStyle}`}>
                        {formattedAmount(item.unitCost)}
                      </td>
                      <td className={`${tableStyle}`}>
                        {formattedAmount(item.totalAmount)}
                      </td>
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
                <td className="pt-2 text-sm font-medium text-right uppercase">
                  Grand Total:
                </td>
                <td></td>
                <td className="pt-2 text-sm font-medium text-center">
                  {formattedAmount(printData?.id.form_data[0].grand_total)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <PrintRequestNotedApprovedBies printData={printData} />
      </div>
    </div>
  );
};

export default PrintCheckIssuace;
