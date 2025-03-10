"use client";
import { LoginForm } from "@/components/forms/login-form";
import AuthLayout from "@/components/layouts/authLayout";
import { usePathname } from "next/navigation";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Spinner } from "@/components/custom/spinner";

const SignIn = () => {
  const pathname = usePathname();
  console.log(pathname);

  if (pathname === "/sign-in/sso-callback") {
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
      <LoginForm />
    </AuthLayout>
  );
};

export default SignIn;
