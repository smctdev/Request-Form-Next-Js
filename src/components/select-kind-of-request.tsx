import React, { SelectHTMLAttributes } from "react";
import kindOfRequests from "@/data/kind-of-request.json";

interface W {
  width?: string;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement>, W {}

export default function SelectKindOfRequest(props: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="select-kind-of-request"
        className="font-bold"
      >
        What kind of request?
      </label>

      <select
        id="select-kind-of-request"
        className={`rounded-md select h-12 focus:outline-none focus:ring-1 focus:border-primary ${
          props.width ?? "w-1/4"
        }`}
        {...props}
      >
        <option value="" disabled>
          What kind of request?
        </option>
        {kindOfRequests.map(({ title, value }, index: number) => (
          <option key={index} value={value}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
}
