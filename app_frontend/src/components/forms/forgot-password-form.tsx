"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import PasswordInput from "../custom/password-input";
import OtpInput from "../custom/otp-input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "../custom/spinner";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z
  .object({
    code: z.string().length(6, "Code must be 6 digits"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

interface ClerkError {
  errors: Array<{
    longMessage: string;
    message: string;
    code: string;
  }>;
}

const ForgotPasswordForm: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const [successfulCreation, setSuccessfulCreation] = React.useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isLoaded || !signIn) {
    return null;
  }

  // Send the password reset code to the user's email
  const handleEmailSubmit = async (values: EmailFormValues) => {
    setIsEmailLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.email,
      });
      setSuccessfulCreation(true);
      toast.success("Code sent", {
        description: "Please check your email for the verification code.",
      });
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      const errorMessage = clerkError.errors[0].longMessage;
      toast.error("Failed to send code", {
        description: errorMessage,
      });
      emailForm.setError("email", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  // Reset the user's password
  const handleResetSubmit = async (values: ResetFormValues) => {
    setIsResetLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: values.code,
        password: values.password,
      });

      if (result.status === "complete") {
        toast.success("Password reset successful", {
          description: "You can now login with your new password.",
        });
        setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      const errorMessage = clerkError.errors[0].longMessage;
      toast.error("Failed to reset password", {
        description: errorMessage,
      });
      resetForm.setError("code", {
        type: "manual",
        message: errorMessage,
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password?</CardTitle>
          <CardDescription>
            {successfulCreation
              ? "Enter the code sent to your email"
              : "Enter your email address to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!successfulCreation ? (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          type="email"
                          disabled={isEmailLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isEmailLoading}
                >
                  {isEmailLoading ? (
                    <>
                      <Spinner className="mr-2" size="small" />
                      Sending code...
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(handleResetSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6">
                  <FormField
                    control={resetForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <OtpInput
                            code={field.value}
                            setCode={(value) => field.onChange(value)}
                            name={field.name}
                            id={field.name}
                            length={6}
                            disabled={isResetLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="New Password"
                              disabled={isResetLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder="Confirm Password"
                              disabled={isResetLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isResetLoading}
                    >
                      {isResetLoading ? (
                        <>
                          <Spinner className="mr-2" size="small" />
                          Resetting password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
