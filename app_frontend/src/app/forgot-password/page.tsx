"use client";

import ForgotPasswordForm from "@/components/forms/forgot-password-form";
import AuthLayout from "@/components/layouts/auth-layout";
import { NextPage } from "next";

const ForgotPassword: NextPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
