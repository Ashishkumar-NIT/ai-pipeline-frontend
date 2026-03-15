import { Suspense } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { SignInForm } from "../../components/auth/SignInForm";

export const metadata = {
  title: "Sign In — Celestique",
};

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your account."
      imageSrc="https://res.cloudinary.com/dsjjdnife/image/upload/v1771612613/101_k2qsju.png"
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}
