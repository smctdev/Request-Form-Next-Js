import React, { useEffect, useState } from "react";
import { toWords } from "number-to-words";
import Image from "next/image";
import { format } from "date-fns";
import formattedDate from "@/utils/formattedDate";
import formattedAmount from "@/utils/formattedAmount";
import Storage from "@/utils/storage";
import PrintRequestNotedApprovedBies from "../print-request-noted-approved-bies";
import BrandName from "@/utils/brand-name";

type PrintRefundProps = {
  data?: any;
};

const PrintCash: React.FC<PrintRefundProps> = ({ data }) => {
  const [printData, setPrintData] = useState<any>(null);
  const logo = BrandName(printData?.user?.branch.branch);
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

  const tableStyle = " border-black border text-xs py-1 font-normal";
  return (
    <div>
      <style>
        {`
          @media print {
              @page{
              size: letter;
              margin:20px; 
              }

            table {
              width: 100%;
            }

            th, td {
              padding: 2px;
              border: 1px solid black;
              vertical-align: top;
              font-size: 9px;
            }

            .summary-table {
              width: 20%;
            }

            .underline {
              text-decoration: underline;
            }

            .uppercase {
              text-transform: uppercase;
            }
          }
        `}
      </style>
      <div className="flex flex-col h-auto mb-2 border-2 border-black">
        <h1 className="mt-2 text-base font-bold text-center uppercase">
          Application for Cash Advance
        </h1>
        <div className="mx-10 mt-2 ">
          <div className="mb-5 indent-8 space-y-2">
            <p>
              TO: <span className="border-b-2">{printData?.department}</span>
            </p>
            <p>
              FROM: <span className="border-b-2">{printData?.position}</span>
            </p>
            <p>
              DATE:{" "}
              <span className="border-b-2">
                {format(new Date(), "MMMM dd, yyyy")}
              </span>
            </p>
          </div>
          <p className="text-sm font-normal indent-8">
            I hereby apply for cash advance in the amount of
            <span className="px-6 ml-2 border-b border-black">
              {printData?.id?.form_data?.[0]?.grand_total
                ? toWords(printData?.id?.form_data?.[0]?.grand_total)
                : "N/A"}
            </span>
            (₱ {printData?.id?.form_data?.[0]?.grand_total}) for the following
            reasons:
            <span className="px-6 border-b border-black">
              {printData?.reason}
            </span>
            I promise to liquidate the said amount on or before{" "}
            <span className="px-6 border-b border-black">
              {formatDate(printData?.id.form_data[0].liquidationDate)}
            </span>{" "}
            it is understood that my failure to do so shall mean the imposition
            of appropriate disciplinary action upon me by the company.
          </p>
        </div>
        {/* container signature */}
        <div className="flex justify-between mx-20 mt-3">
          <div className="relative flex flex-grow mb-4">
            <h3 className="mb-3 text-sm font-normal indent-10">Payee:</h3>
            <div className="ml-6 text-center">
              <span className=" inline-block border-b border-black w-[200px] text-sm font-medium text-center">
                {printData?.user?.firstName} {printData?.user?.lastName}
              </span>
            </div>
          </div>
          <div className="relative flex flex-grow mb-1 ">
            <div className="relative ml-6 ">
              <Image
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none -top-1 left-1/2"
                src={Storage(printData?.user?.signature) || ""}
                alt=""
                width={100}
                height={100}
              />
              <div className="border-b w-[200px] border-black text-center">
                <span className="text-sm font-medium text-center ">
                  {printData?.user?.firstName} {printData?.user?.lastName}
                </span>
              </div>

              <p className="text-xs font-light text-center ">
                Print Name & Sign
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full pb-4 border-b-2 border-black border-dashed">
          <div className="ml-20">
            <p className="text-sm font-normal">Noted By:</p>
            <div className="text-center border-black ">
              {printData?.notedBy.map((approver: any, index: number) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center pt-3 mr-10"
                >
                  {approver.status === "Approved" && (
                    <Image
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none -top-0.5 left-1/2"
                      src={Storage(approver.signature) || ""}
                      alt=""
                      width={120}
                      height={120}
                    />
                  )}
                  <div className=" border-b w-[200px] border-black">
                    <p className=" text-[8px] relative z-10 text-sm text-center font-medium ">
                      {approver.firstName} {approver.lastName}
                    </p>
                  </div>
                  <p className="text-xs font-light text-center">
                    {approver.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mr-20">
            <p className="text-sm font-normal">Approved By:</p>
            <div className="text-center border-black ">
              {printData?.approvedBy.map((approver: any, index: number) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center pt-3 mr-10"
                >
                  {approver.status === "Approved" && (
                    <Image
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none -top-1 left-1/2"
                      src={Storage(approver.signature) || ""}
                      alt=""
                      width={120}
                      height={120}
                    />
                  )}
                  <div className="border-b w-[200px] border-black">
                    <p className="relative z-10 text-sm font-medium text-center">
                      {approver.firstName} {approver.lastName}
                    </p>
                  </div>
                  <p className="text-xs font-light text-center">
                    {approver.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-20 mt-2 ">
          <h1 className="mb-2 text-base font-bold text-center">
            LIQUIDATION STATEMENT
          </h1>

          <div className="w-2/5">
            <p className="flex justify-between text-xs">
              <span className="w-full">TOTAL CASH ADVANCE</span>
              <span className="ml-4">P</span>
              <span className="text-center border-b border-black w-36">
                {printData?.id.form_data[0].grand_total}
              </span>
            </p>
            <p className="flex justify-between text-xs">
              <span className="w-full">TOTAL EXPENSES</span>
              <span className="ml-4">P</span>
              <span className="text-center border-b border-black w-36"></span>
            </p>
            <p className="flex justify-between text-xs">
              <span className="w-full">BALANCE</span>
              <span className="ml-4">P</span>
              <span className="text-center border-b border-black w-36"></span>
            </p>
          </div>
        </div>
        <div className="flex justify-between w-full">
          {printData?.notedBy?.length > 0 && (
            <div className="ml-20">
              <p className="text-xs">Noted By:</p>
              <div className="text-center border-black ">
                {printData?.notedBy.map((approver: any, index: number) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center justify-center pt-3 mr-10"
                  >
                    {approver.status === "Approved" && (
                      <Image
                        className="absolute transform -translate-x-1/2 -translate-y-6 pointer-events-none -top-0.5 left-1/2"
                        src={Storage(approver.signature) || ""}
                        alt=""
                        width={120}
                        height={120}
                      />
                    )}
                    <div className="border-b w-[200px] border-black">
                      <p className="relative z-10 text-sm font-medium text-center">
                        {approver.firstName} {approver.lastName}
                      </p>
                    </div>
                    <p className="text-xs font-light text-center">
                      {approver.position}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mr-20">
            <p className="text-xs">Approved By:</p>
            <div className="text-center border-black ">
              {printData?.approvedBy.map((approver: any, index: number) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-center pt-3 mr-10"
                >
                  {approver.status === "Approved" && (
                    <Image
                      className="absolute transform -translate-x-1/2 -translate-y-6 pointer-events-none -top-1 left-1/2"
                      src={Storage(approver.signature) || ""}
                      alt=""
                      width={120}
                      height={120}
                    />
                  )}
                  <div className="border-b w-[200px] border-black">
                    <p className="relative z-10 text-sm font-medium text-center">
                      {approver.firstName} {approver.lastName}
                    </p>
                  </div>
                  <p className="text-xs font-light text-center">
                    {approver.position}
                  </p>
                </div>
              ))}
              {/* <div className="relative flex flex-col items-center justify-center pt-4 mr-10">
                <div className="border-b w-[200px] border-black">
                  <p className="relative z-10 text-sm font-medium text-center">
                    Marilou D. Lumapas
                  </p>
                </div>
                <p className="text-xs font-light text-center">Vice President</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-auto font-bold border-2 border-black break-before-page">
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center w-1/2 mt-2 !text-6xl font-extrabold">{logo}</div>

          <h1 className="mt-2 text-base font-bold uppercase">
            Application for Cash Advance
          </h1>
          <div className="flex flex-col items-center mt-1 font-bold">
            <h1 className="text-base font-medium underline uppercase">
              {printData?.user?.branch?.branch}
            </h1>
            <h1 className="text-base font-semibold">BRANCH</h1>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <table className="border w-[70%] mr-2 h-auto">
            <thead className="border border-black ">
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>From</th>
                <th>To</th>
                <th>Activity</th>
                <th>Hotel</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Per Diem</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {printData?.id.form_data.map((formData: any, index: number) => (
                <React.Fragment key={index}>
                  {formData.items.map((item: any, itemIndex: number) => (
                    <tr key={itemIndex}>
                      <td className="font-normal">
                        {formattedDate(item.cashDate)}
                      </td>
                      <td className="font-normal">{item.day}</td>
                      <td className="font-normal">{item.from}</td>
                      <td className="font-normal">{item.to}</td>
                      <td className="font-normal">{item.activity}</td>
                      <td className="font-normal">{item.hotel}</td>
                      <td className="font-normal">
                        {formattedAmount(item.rate)}
                      </td>
                      <td className="font-normal">
                        {formattedAmount(item.amount)}
                      </td>
                      <td className="font-normal">
                        {formattedAmount(item.perDiem)}
                      </td>
                      <td className="font-normal">{item.remarks}</td>
                    </tr>
                  ))}
                  {[...Array(Math.max(5 - formData.items.length, 0))].map(
                    (_, emptyIndex) => (
                      <tr key={`empty-${index}-${emptyIndex}`}>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                        <td className={`${tableStyle} `}></td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <table className="h-auto summary-table">
            <thead>
              <tr>
                <th colSpan={2} className="bg-[#8EC7F7]">
                  <p className="font-semibold">
                    SUMMARY OF EXPENSES TO BE INCURRED (for C/A)
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-normal">BOAT FARE</td>
                <td className="font-medium text-end">
                  {formattedAmount(printData?.id.form_data[0].totalBoatFare)}
                </td>
              </tr>
              <tr>
                <td className="font-normal">HOTEL</td>
                <td className="font-medium text-end">
                  {/* Display calculated total hotel rate */}
                  {formattedAmount(
                    printData?.id.form_data[0].items.reduce(
                      (totalHotelRate: number, item: any) =>
                        totalHotelRate + Number(item.rate),
                      0
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-normal">PER DIEM</td>
                <td className="font-medium text-end">
                  {/* Display calculated total per diem */}
                  {formattedAmount(
                    printData?.id.form_data[0].items.reduce(
                      (totalPerDiem: number, item: any) =>
                        totalPerDiem + Number(item.perDiem),
                      0
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td className="font-normal">FARE</td>
                <td className="font-medium text-end">
                  {formattedAmount(printData?.id.form_data[0].totalFare)}
                </td>
              </tr>
              <tr>
                <td className="font-normal">CONTINGENCY</td>
                <td className="font-medium text-end">
                  {formattedAmount(printData?.id.form_data[0].totalContingency)}
                </td>
              </tr>
              <tr>
                <td className={`${tableStyle} `}></td>
                <td className={`${tableStyle} `}></td>
              </tr>
              <tr>
                <td className="font-normal">TOTAL</td>
                <td className="font-medium text-end">
                  {formattedAmount(printData?.id.form_data[0].grand_total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <PrintRequestNotedApprovedBies printData={printData} />
      </div>
    </div>
  );
};

export default PrintCash;
