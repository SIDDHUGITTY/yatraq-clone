// /src/components/Chart.tsx
"use client";

import React, { useMemo } from "react";

interface ChartProps {
  title: string;
  values?: number[];
}

const Chart: React.FC<ChartProps> = ({ title, values = [5, 7, 9, 6, 10, 8] }) => {
  const max = useMemo(() => Math.max(...values, 1), [values]);
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="mb-2 text-sm text-gray-500">{title}</div>
      <div className="flex items-end gap-2 h-32">
        {values.map((v, i) => (
          <div key={i} className="w-8 rounded bg-gray-200" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
    </div>
  );
};

export default Chart;
