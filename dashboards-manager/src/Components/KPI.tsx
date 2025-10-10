import React from "react";

interface KPIProps {
  label: string;
  value: string | number;  // accept both number and string
  subtext?: string;
}

const KPI: React.FC<KPIProps> = ({ label, value, subtext }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-2xl font-bold text-blue-600">{value}</h2>
      {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
    </div>
  );
};

export default KPI;
