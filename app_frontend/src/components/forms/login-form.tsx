"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "../custom/password-input";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "../custom/spinner";
import { useState } from "react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface ClerkError {
  errors: Array<{
    longMessage: string;
    message: string;
    code: string;
  }>;
}

export const LoginForm: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!signIn) return null;

  const handleSubmit = async (values: LoginFormValues) => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
        });
      }
    } catch (error: unknown) {
      const clerkError = error as ClerkError;
      const errorMessage =
        clerkError.errors?.[0]?.message || "An error occurred during login";
      toast.error("Login failed", {
        description: errorMessage,
      });
      form.setError("root", { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (strategy: OAuthStrategy) => {
    setIsGoogleLoading(true);
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/",
      })
      .then((res) => {
        console.log(res);
        console.log("redirecting to", "/sign-in/sso-callback");
      })
      .catch((err) => {
        const errorMessage =
          err.errors?.[0]?.message || "Failed to login with Google";
        toast.error("Google login failed", {
          description: errorMessage,
        });
        setIsGoogleLoading(false);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with Email or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => handleGoogleLogin("oauth_google")}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Spinner className="mr-2" size="small" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  <span className="ml-2">Login with Google</span>
                </Button>
              </div>
              <div className="relative text-sm text-center after:border-border after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="relative z-10 px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          type="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Password
                        <Link
                          href="/forgot-password"
                          className="font-normal text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4"
                        >
                          Forgot password?
                        </Link>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div id="clerk-captcha" />
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2" size="small" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              <div className="text-sm text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4"
                >
                  Sign up
                </Link>
              </div>

              {/* <div className="flex justify-between items-center text-sm">
                <Link href="/sign-up" className="underline underline-offset-4">
                  Create account
                </Link>
                <Link
                  href="/forgot-password"
                  className="underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div> */}
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
