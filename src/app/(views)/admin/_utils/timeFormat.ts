import { formatDistanceToNowStrict } from "date-fns";

export function timeFormat(date: string) {
  return formatDistanceToNowStrict(date, { addSuffix: true }) === "0 second ago"
    ? "Just now"
    : formatDistanceToNowStrict(date, { addSuffix: true });
}
