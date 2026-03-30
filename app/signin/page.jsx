import { Suspense } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { SignInForm } from "../../components/auth/SignInForm";

export const metadata = {
  title: "Welcome Back — Celestique",
};

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Your account was found. Enter your password to continue."
      imageSrc="https://res.cloudinary.com/dcs0vuzwg/image/upload/v1774883373/authImg_ivftu7.png"
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}

