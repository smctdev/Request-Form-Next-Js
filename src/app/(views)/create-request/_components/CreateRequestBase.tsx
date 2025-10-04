"use client";

import requestTypes from "@/data/request-data.json";
import { useEffect, useState } from "react";
import CreateStockRequistion from "../_components/CreateStockRequistion";
import CreatePurchaseOrder from "../_components/CreatePurchaseOrder";
import CreateCashDisbursement from "../_components/CreateCashDisbursement";
import CreateApplicationCash from "../_components/CreateApplicationCash";
import CreateLiquidation from "../_components/CreateLiquidation";
import CreateRefund from "../_components/CreateRefund";
import CreateDiscount from "../_components/CreateDiscount";
import { useRouter } from "next/navigation";
import { createRequestSelect } from "@/constants/createRequestSelect";
import CreateCheckIssuance from "./CreateCheckIssuance";
import authenticatedPage from "@/lib/authenticatedPage";
import { BiLoaderCircle } from "react-icons/bi";

function CreateRequestBase({ title }: { title: string }) {
  const path = requestTypes.find((item) => item.title === title)?.path;
  const [selected, setSelected] = useState<string | undefined>(path ?? "");
  const [isLoadingType, setIsLoadingType] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!selected) return;
    setIsLoadingType(true);
    const title = requestTypes.find((item) => item.path === selected)?.title;

    router.replace(`/create-request?title=${title}`);
    setTimeout(() => {
      setIsLoadingType(false);
    }, 1000);
  }, [selected, router]);

  return (
    <div className="h-full pt-[15px] px-[30px] pb-[15px]">
      <h1 className="text-primary !text-[32px] font-bold">
        {isLoadingType ? "Loading..." : selected ? title : "Type of Request"}
      </h1>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-2/5 lg:h-[56px] md:h-10 p-2 pl-[30px] border rounded-xl mb-2 cursor-pointer select"
      >
        <option value="" disabled>
          Type of request
        </option>
        {requestTypes.map((item) => (
          <option key={item.title} value={item.path}>
            {item.title}
          </option>
        ))}
      </select>

      {isLoadingType ? (
        <>
          <div className="flex justify-center items-center h-[calc(100vh-300px)]">
            <div className="text-primary !text-[32px] font-bold flex gap-1 items-center">
              <BiLoaderCircle className="animate-spin size-10" /> Loading...
            </div>
          </div>
        </>
      ) : selected === createRequestSelect.SR ? (
        <CreateStockRequistion />
      ) : selected === createRequestSelect.PORS ? (
        <CreatePurchaseOrder />
      ) : selected === createRequestSelect.COCDRS ? (
        <CreateCashDisbursement />
      ) : selected === createRequestSelect.AFCA ? (
        <CreateApplicationCash />
      ) : selected === createRequestSelect.LOAE ? (
        <CreateLiquidation />
      ) : selected === createRequestSelect.RFR ? (
        <CreateRefund />
      ) : selected === createRequestSelect.DR ? (
        <CreateDiscount />
      ) : selected === createRequestSelect.CI ? (
        <CreateCheckIssuance />
      ) : (
        <>
          <div className="flex justify-center items-center h-[calc(100vh-300px)]">
            <h1 className="text-primary !text-[32px] font-bold">
              No selected or invalid type of request
            </h1>
          </div>
        </>
      )}
    </div>
  );
}

export default authenticatedPage(CreateRequestBase);
