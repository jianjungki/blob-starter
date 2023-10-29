"use client";

import { useState } from "react";
import { Progress } from "@nextui-org/react";

export default function MyProgresss({ pageData }) {
  const [nowVal, setNowValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  console.log(pageData);
  const current = pageData?.value?.current || 0;
  const total = pageData?.value?.total || 100;
  const url = pageData?.value?.url || "";

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <Progress
        label="Process Progessing"
        aria-label="Loading..."
        value={current}
        maxValue={total}
        showValueLabel={true}
        className="max-w-md"
      />
      <div className="relative py-2 max-w-xl">
        <span className="absolute  left-0">{current} rows processed</span>
        <span className="absolute  right-0">Total {total} rows</span>
      </div>
      {url.length > 0 && (
        <div className="relative py-5 max-w-xl">
          <span className="absolute  left-0">
            Download Url:{" "}
            <a href={url} className="text-blue-500">
              Click Here
            </a>
          </span>
        </div>
      )}
    </div>
  );
}
