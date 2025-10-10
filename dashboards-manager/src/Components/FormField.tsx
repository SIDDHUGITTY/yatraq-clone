// /src/components/FormField.tsx
"use client";

import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

const FormField: React.FC<Props> = ({ label, hint, ...rest }) => (
  <label className="block">
    <div className="mb-1 text-sm text-gray-600">{label}</div>
    <input
      {...rest}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
    />
    {hint && <div className="mt-1 text-xs text-gray-400">{hint}</div>}
  </label>
);

export default FormField;
