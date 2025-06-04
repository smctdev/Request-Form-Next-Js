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

export default function CreateRequestBase({ title }: { title: string }) {
  const path = requestTypes.find((item) => item.title === title)?.path;
  const [selected, setSelected] = useState<string | undefined>(path);
  const router = useRouter();

  useEffect(() => {
    if (!selected) return;
    const title = requestTypes.find((item) => item.path === selected)?.title;

    router.replace(`/create-request?title=${title}`);
  }, [selected, router]);

  return (
    <div className="bg-graybg dark:bg-blackbg h-full pt-[15px] px-[30px] pb-[15px]">
      <h1 className="text-primary dark:text-primaryD text-[32px] font-bold">
        Create Request
      </h1>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-2/5  lg:h-[56px] md:h-10 p-2 bg-gray-200 pl-[30px] border-2 border-black rounded-xl mb-2 cursor-pointer"
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

      {selected === "/create-request/stock-requisition" ? (
        <CreateStockRequistion />
      ) : selected === "/create-request/purchase-order-requisition-slip" ? (
        <CreatePurchaseOrder />
      ) : selected ===
        "/create-request/cash-or-card-disbursement-requisition-slip" ? (
        <CreateCashDisbursement />
      ) : selected === "/create-request/application-for-cash-advance" ? (
        <CreateApplicationCash />
      ) : selected === "/create-request/liquidation-of-actual-expense" ? (
        <CreateLiquidation />
      ) : selected === "/create-request/request-for-refund" ? (
        <CreateRefund />
      ) : selected === "/create-request/discount-request" ? (
        <CreateDiscount />
      ) : null}
    </div>
  );
}
