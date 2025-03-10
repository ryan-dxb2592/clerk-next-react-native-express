"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({
  id,
  name,
  label,
  placeholder,
  forgotPassword,
  value,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  forgotPassword?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="*:not-first:mt-2">
      <div className="flex items-center">
        <Label htmlFor={id}>{label}</Label>
        {forgotPassword && (
          <a
            href="#"
            className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-foreground"
          >
            Forgot your password?
          </a>
        )}
      </div>
      <div className="relative">
        <Input
          id={id}
          name={name}
          className="pe-9"
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
        />

        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
