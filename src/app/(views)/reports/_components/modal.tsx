import {
  AFCA,
  CDRS,
  CIRS,
  DRF,
  LOAE,
  PORS,
  RR,
  SRS,
} from "../_constants/formTypes";
import CashAdvanceDetails from "./cash-advance";
import CashDisbursementDetails from "./cash-disbursement";
import CheckIssuanceDetails from "./check-issuance";
import DiscountDetails from "./discount";
import LiquiditionDetails from "./liquidition";
import PurchaseOrderDetails from "./purchase";
import RefundRequestDetails from "./request";
import StockDetails from "./stock";

export default function Modal({
  isOpen,
  details,
  handleCloseViewDetails,
}: any) {
  const formType = details?.form_type;
  if (!isOpen) return;
  console.log(details);
  switch (formType) {
    case SRS:
      return (
        <StockDetails closeModal={handleCloseViewDetails} record={details} />
      );
    case RR:
      return (
        <RefundRequestDetails
          closeModal={handleCloseViewDetails}
          record={details}
        />
      );
    case PORS:
      return (
        <PurchaseOrderDetails
          closeModal={handleCloseViewDetails}
          record={details}
        />
      );
    case LOAE:
      return (
        <LiquiditionDetails
          closeModal={handleCloseViewDetails}
          record={details}
        />
      );
    case DRF:
      return (
        <DiscountDetails closeModal={handleCloseViewDetails} record={details} />
      );
    case CIRS:
      return (
        <CheckIssuanceDetails
          closeModal={handleCloseViewDetails}
          record={details}
        />
      );
    case CDRS:
      return (
        <CashDisbursementDetails
          closeModal={handleCloseViewDetails}
          record={details}
        />
      );
    case AFCA:
      return (
        <CashAdvanceDetails
          closeModal={handleCloseViewDetails}
          record={details}
        />
      );
    default:
      return null;
  }
}
