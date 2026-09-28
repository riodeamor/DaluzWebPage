"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";

interface ProfileFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  value?: string | null;
  error?: string;
  isEditing?: boolean;
  register?: UseFormRegister<FieldValues>;
  className?: string;
}

export function ProfileField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  error,
  isEditing = false,
  register,
  className = "",
}: ProfileFieldProps) {
  const inputClasses = `font-text border-[#16345F]/30 focus:border-[#005080] focus:ring-[#005080]/50 ${
    error ? "border-red-500" : ""
  } ${className}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#16345F] font-text font-medium">
        {label}
      </Label>
      {isEditing && register ? (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          {...register(id)}
          className={inputClasses}
        />
      ) : (
        <div className="text-[#16345F] bg-white px-3 py-2 rounded-md border border-[#16345F]/20 font-text">
          {value || "No especificado"}
        </div>
      )}
      {error && <p className="text-sm text-red-600 font-text">{error}</p>}
    </div>
  );
}
