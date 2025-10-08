import React, { useEffect, useState } from "react";
import formattedAmount from "@/utils/formattedAmount";
import PrintRequestNotedApprovedBies from "../print-request-noted-approved-bies";
import BrandName from "@/utils/brand-name";

type PrintRefundProps = {
  data?: any;
};
const PrintDiscount: React.FC<PrintRefundProps> = ({ data }) => {
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

  const tableStyle = "border-black border py-2 font-bold text-xs text-center";
  return (
    <div className="  bg-base-100 h-lvh">
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
          <p className="flex text-xs font-medium">
            Date:{" "}
            <span className="ml-2 text-xs font-normal underline">
              {formatDate(printData?.id.created_at)}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="justify-center w-1/2 !text-6xl font-extrabold">
            {logo}
          </div>

          <h1 className="mt-2 text-xs font-semibold uppercase">
            Discount Requisition Slip
          </h1>
          <div className="flex flex-col items-center mt-2 text-xs font-medium">
            <h1 className="text-xs font-medium underline uppercase">
              {printData?.user?.branch?.branch}
            </h1>
            <h1 className="text-xs font-semibold">BRANCH</h1>
          </div>
        </div>
        <div className="flex justify-center w-full mt-2">
          <table className="w-full border">
            <thead className="border border-black ">
              <tr>
                <th className="px-1 text-xs font-medium text-center border border-black">
                  Brand
                </th>
                <th className="px-1 text-xs font-medium text-center border border-black">
                  Model
                </th>
                <th className="px-1 text-xs font-medium text-center border border-black whitespace-nowrap">
                  Unit/Part/Job Description
                </th>
                <th className="px-1 text-xs font-medium text-center border border-black whitespace-nowrap">
                  Part No./Job Order No.
                </th>
                <th className="px-1 text-xs font-medium text-center border border-black whitespace-nowrap">
                  Labor Charge
                </th>
                <th className="px-1 text-xs font-medium text-center border border-black whitespace-nowrap">
                  Net Spotcash
                </th>
                <th className="px-1 text-xs font-medium text-center border border-black whitespace-nowrap">
                  Discounted Price
                </th>
              </tr>
            </thead>
            <tbody>
              {printData?.id.form_data.map((formData: any, index: number) => (
                <React.Fragment key={index}>
                  {formData.items.map((item: any, itemIndex: number) => (
                    <tr key={itemIndex}>
                      <td className="px-1 text-xs font-normal text-center border border-black">
                        {item.brand}
                      </td>
                      <td className="px-1 text-xs font-normal text-center border border-black">
                        {item.model}
                      </td>
                      <td className="px-1 text-xs font-normal text-center border border-black">
                        {item.unit}
                      </td>
                      <td className="px-1 text-xs font-normal text-center border border-black">
                        {item.partno}
                      </td>
                      <td className="px-1 text-xs font-normal text-center border border-black">
                        {formattedAmount(item.labor)}
                      </td>
                      <td className="px-1 text-xs font-normal text-center border border-black">
                        {formattedAmount(item.spotcash)}
                      </td>
                      <td className="px-1 text-xs font-normal text-center border border-black">
                        {formattedAmount(item.discountedPrice)}
                      </td>
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
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot className={`${tableStyle} `}>
              <tr>
                <td
                  colSpan={4}
                  className="text-xs font-medium text-right border border-black"
                >
                  Total:
                </td>
                <td className="text-xs font-medium text-center border border-black">
                  {formattedAmount(printData?.id.form_data[0].total_labor)}
                </td>
                <td className="text-xs font-medium text-center border border-black">
                  {formattedAmount(printData?.id.form_data[0].total_spotcash)}
                </td>
                <td className="text-xs font-medium text-center border border-black">
                  {formattedAmount(printData?.id.form_data[0].total_discount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <PrintRequestNotedApprovedBies printData={printData} />
      </div>
    </div>
  );
};

export default PrintDiscount;
