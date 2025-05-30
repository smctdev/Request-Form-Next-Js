import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { FeedbackType } from "../../_types/Feedback";

export default function TableData({ item }: { item: FeedbackType }) {
  return (
    <tr>
      <td className="p-2 max-w-[180px] break-words font-bold text-gray-600">
        {item.id}/{item.feedback_code}
      </td>
      <td className="p-2">{item.name}</td>
      <td className="p-2">{item.email}</td>
      <td className="p-2">{item.phone}</td>
      <td className="p-2">{item.department}</td>
      <td className="p-2">{item.message}</td>
      <td className="p-2">
        <p>{formatDate(item.created_at, "MMM dd, yyyy h:mm a")}</p>
        <p className="text-gray-500 !text-sm">
          {formatDistanceToNowStrict(item.created_at, { addSuffix: true })}
        </p>
      </td>
    </tr>
  );
}
