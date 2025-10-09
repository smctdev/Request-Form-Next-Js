import React, { useEffect, useState } from "react";
import formattedAmount from "@/utils/formattedAmount";
import PrintRequestNotedApprovedBies from "../print-request-noted-approved-bies";
import BrandName from "../../../../../utils/brand-name";
import Preloader from "@/components/loaders/PreLoader";
import GeneratingPrintDataLoader from "../generating-print-data-loader";
type PrintRefundProps = {
  data?: any;
};

const PrintStock: React.FC<PrintRefundProps> = ({ data }) => {
  const [printData, setPrintData] = useState<any>(null); // State to hold print data
  const logo = BrandName(printData?.user?.branch.branch);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

      setTimeout(() => {
        window.print();
      }, 3000);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      setTimeout(() => {
        if (!isPrinting) {
          window.close();
        }
      }, 3000);
    }
  }, [printData]);

  if (isLoading) return <GeneratingPrintDataLoader />;

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
        <div className="flex justify-end pr-3">
          <p className="flex text-sm font-medium">
            Date:{" "}
            <span className="ml-2 text-sm font-normal underline">
              {formatDate(printData?.id.created_at)}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center flex w-1/2 text-center !text-6xl font-extrabold">
            {logo}
          </div>

          <h1 className="mt-2 text-sm font-semibold uppercase">
            Stock Requisition Slip
          </h1>
          <div className="flex flex-col items-center mt-2 font-bold">
            <h1 className="text-sm font-medium underline uppercase">
              {printData?.user?.branch?.branch}
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
        <PrintRequestNotedApprovedBies printData={printData} />
      </div>
    </div>
  );
};

export default PrintStock;
