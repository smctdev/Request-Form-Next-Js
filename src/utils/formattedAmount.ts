export default function formattedAmount(amount: string | number) {
  return Number(amount)?.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP",
  });
}
