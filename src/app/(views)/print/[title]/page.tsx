"use client";

import { useParams } from "next/navigation";
import PrintStock from "../../approver/_components/prints/PrintStock";
import NotFound from "@/app/not-found";
import PrintCash from "../../approver/_components/prints/PrintCash";
import PrintCashDisbursement from "../../approver/_components/prints/PrintCashDisbursement";
import PrintDiscount from "../../approver/_components/prints/PrintDiscount";
import PrintPurchase from "../../approver/_components/prints/PrintPurchase";
import PrintRefund from "../../approver/_components/prints/PrintRefund";
import PrintLiquidation from "../../approver/_components/prints/PrintLiquidation";
import { useEffect, useState } from "react";
import Preloader from "@/components/loaders/PreLoader";

export default function PrintTitle() {
  const { title } = useParams();
  const [printData, setPrintData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const req: any = localStorage.getItem("printData");
    if (!req) return;
    setPrintData(req);
  }, [title]);

  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  if (isLoading) return <Preloader />;

  if (!printData) return <NotFound />;
  switch (title) {
    case "stock":
      return <PrintStock />;
    case "cash":
      return <PrintCash />;
    case "cash-disbursement":
      return <PrintCashDisbursement />;
    case "discount":
      return <PrintDiscount />;
    case "purchase":
      return <PrintPurchase />;
    case "refund":
      return <PrintRefund />;
    case "liquidation":
      return <PrintLiquidation />;
    default:
      return <NotFound />;
  }
}
