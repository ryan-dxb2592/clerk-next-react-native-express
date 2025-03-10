import { SignUpForm } from "@/components/forms/signup-form";
import AuthLayout from "@/components/layouts/authLayout";

const SignUp = () => {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
