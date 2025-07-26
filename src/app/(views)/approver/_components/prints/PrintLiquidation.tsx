import React, { useEffect, useState } from "react";
import SMCTLogo from "@/assets/SMCT.png";
import DSMLogo from "@/assets/DSM.jpg";
import DAPLogo from "@/assets/DAP.jpg";
import HDILogo from "@/assets/HDI.jpg";
import HOLogo from "@/assets/logo.png";
import Image from "next/image";
import Storage from "@/utils/storage";
import PrintRequestNotedApprovedBies from "../print-request-noted-approved-bies";

type PrintRefundProps = {
  data?: any;
};

const PrintLiquidation: React.FC<PrintRefundProps> = ({ data }) => {
  const [printData, setPrintData] = useState<any>(null);

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

  return (
    <div className="print-container">
      <style>
        {`
    @media print {
      @page{
          size: letter;
          margin:0;
          }

          body {
            padding:0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: 100vh;
          }

          .content {
              transform: scale(0.7);
              transform-origin: center;
          }

          .summary-table {
            width: 100%;
          }

          .underline {
            text-decoration: underline;
          }

          .uppercase {
            text-transform: uppercase;
          }

          .two-column {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
    }
  `}
      </style>
      <div className="-m-16 text-black bg-white content">
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center w-1/2">{logo}</div>
          <h1 className="mt-1 text-sm font-semibold uppercase">
            liquidation of actual expense
          </h1>
          <div className="flex flex-col items-center mt-2 font-bold">
            <h1 className="text-sm font-medium underline uppercase">
              {printData?.requested_branch}
            </h1>
            <h1 className="text-sm font-semibold">BRANCH</h1>
          </div>
        </div>
        <div className="mt-3">
          <p className="flex text-sm font-medium">
            Activity:{" "}
            <span className="ml-2 font-normal underline">
              {printData?.id.form_data[0].purpose}
            </span>{" "}
          </p>
          <p className="flex text-sm font-medium">
            Date:{" "}
            <span className="ml-2 font-normal underline">
              {formatDate(printData?.id.created_at)}
            </span>
          </p>
        </div>
        <div className="mt-2 mr-1">
          <table className="w-full text-xs border border-black">
            <thead className="border border-black">
              <tr className="border border-black">
                <th className="font-medium border border-black"></th>
                <th
                  colSpan={4}
                  className="px-2 py-1 font-bold border border-black"
                >
                  TRANSPORTATION
                </th>
                <th
                  colSpan={3}
                  className="px-2 py-1 font-bold border border-black"
                >
                  HOTEL
                </th>
                <th
                  colSpan={3}
                  className="px-2 py-1 font-bold border border-black whitespace-nowrap"
                >
                  PER DIEM OTHER RELATED EXPENSES
                </th>
                <th className="font-medium border border-black"></th>
              </tr>
              <tr className="border border-black">
                <th className="px-2 py-1 font-semibold border border-black">
                  Date
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  From
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  To
                </th>
                <th className="px-2 py-1 font-semibold border border-black whitespace-nowrap">
                  Type of Transportation
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  Amount
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  Name
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  Place
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  Amount
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  Per Diem
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  Particulars
                </th>
                <th className="px-2 py-1 font-semibold border border-black">
                  Amount
                </th>
                <th className="px-2 py-1 font-semibold border border-black whitespace-nowrap">
                  Grand Total
                </th>
              </tr>
            </thead>
            <tbody>
              {printData?.id.form_data.map((formData: any, index: number) => (
                <React.Fragment key={index}>
                  {formData.items.map((item: any, itemIndex: number) => (
                    <tr key={itemIndex} className="border border-black">
                      <td className="px-2 border border-black  whitespace-nowrap">
                        {formatDate(item.liquidationDate)}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {item.from}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {item.to}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {item.transportation}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {Number(item.transportationAmount).toFixed(2)}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {item.hotel}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {item.hotelAddress}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {Number(item.hotelAmount).toFixed(2)}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {Number(item.perDiem).toFixed(2)}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {item.particulars}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {Number(item.particularsAmount).toFixed(2)}
                      </td>
                      <td className="px-2 text-center border border-black">
                        {item.grandTotal}
                      </td>
                    </tr>
                  ))}
                  {[...Array(Math.max(2 - formData.items.length, 0))].map(
                    (_, emptyIndex) => (
                      <tr key={`empty-${index}-${emptyIndex}`}>
                        <td className="py-3 border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                        <td className="border border-black"></td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-6 px-5 pt-3 two-column">
          <div>
            <table className="w-full border border-black">
              <tbody className="w-full">
                <tr>
                  <td className="px-2 py-1 text-xs font-semibold border border-black">
                    TOTAL EXPENSE
                  </td>
                  <td className="px-2 py-1 text-xs font-normal border border-black">
                    {printData?.id.form_data[0].totalExpense}
                  </td>
                </tr>

                <tr>
                  <td className="px-2 py-1 text-xs font-semibold border border-black">
                    CASH ADVANCE
                  </td>
                  <td className="px-2 py-1 text-xs font-normal border border-black">
                    {printData?.id.form_data[0].cashAdvance}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 text-xs font-semibold border border-black">
                    SHORT
                  </td>
                  <td className="px-2 py-1 text-xs font-normal border border-black">
                    {printData?.id.form_data[0].short}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <table className="w-full border border-black">
              <tbody>
                <tr>
                  <td className="px-2 py-1 text-xs font-medium border border-black">
                    NAME OF EMPLOYEE
                  </td>
                  <td className="px-2 py-1 text-xs font-normal border border-black">
                    {printData?.user.lastName}, {printData?.user.firstName}
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 text-xs font-medium border border-black">
                    SIGNATURE
                  </td>
                  <td className="h-20 px-2 py-1 text-xs font-medium border border-black">
                    <Image
                      width={100}
                      height={100}
                      src={Storage(printData?.user.signature) || ""}
                      className="h-16"
                      alt="Signature"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-1 text-xs font-medium border border-black">
                    EMPLOYEE NO.
                  </td>
                  <td className="px-2 py-1 text-xs font-normal border border-black">
                    {printData?.user.employee_id}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <PrintRequestNotedApprovedBies printData={printData} />
      </div>
    </div>
  );
};

export default PrintLiquidation;
