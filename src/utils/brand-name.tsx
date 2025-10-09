import SMCTLogo from "@/assets/SMCT.png";
import DSMLogo from "@/assets/DSM.jpg";
import DAPLogo from "@/assets/DAP.jpg";
import HDILogo from "@/assets/HDI.jpg";
import HOLogo from "@/assets/logo.png";
import Image from "next/image";

export default function BrandName(branchName: string) {
  let logo = "";
  if (branchName === "Strong Moto Centrum, Inc.") {
    logo = SMCTLogo.src;
  } else if (branchName === "Des Strong Motors, Inc.") {
    logo = DSMLogo.src;
  } else if (branchName === "Des Appliance Plaza, Inc.") {
    logo = DAPLogo.src;
  } else if (branchName === "Honda Des, Inc.") {
    logo = HDILogo.src;
  } else if (branchName === "Head Office") {
    logo = HOLogo.src;
  } else {
    logo = "";
  }

  return <Image width={300} height={300} src={logo} alt="SMCT Logo" />;
}
