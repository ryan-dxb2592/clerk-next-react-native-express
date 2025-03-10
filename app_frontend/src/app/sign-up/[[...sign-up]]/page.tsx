"use client";

import { SignUpForm } from "@/components/forms/signup-form";
import AuthLayout from "@/components/layouts/auth-layout";
import { usePathname } from "next/navigation";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Spinner } from "@/components/custom/spinner";

const SignUp = () => {
  const pathname = usePathname();

  if (pathname === "/sign-up/sso-callback") {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <Spinner size={"large"} />
        <div className="text-xs text-center text-muted-foreground text-balance">
          Redirecting...
        </div>
        <div id="clerk-captcha" />
        <AuthenticateWithRedirectCallback />;
      </div>
    );
  }
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
