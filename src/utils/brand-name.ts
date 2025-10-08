export default function BrandName(branchName: string) {
  let logo;

  if (branchName === "Strong Moto Centrum, Inc.") {
    logo = "SMCT";
  } else if (branchName === "Des Strong Motors, Inc.") {
    logo = "DSM";
  } else if (branchName === "Des Appliance Plaza, Inc.") {
    logo = "DAP";
  } else if (branchName === "Honda Des, Inc.") {
    logo = "HD";
  } else if (branchName === "Head Office") {
    logo = "HO";
  } else {
    logo = "N/A";
  }

  return logo;
}
