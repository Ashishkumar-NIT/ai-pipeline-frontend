import { Suspense } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { SignUpForm } from "../../components/auth/SignUpForm";

export const metadata = {
  title: "Sign Up — Celestique",
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Showcase your designs, connect with verified retailers, and expand your business with confidence."
      imageSrc="https://res.cloudinary.com/dsjjdnife/image/upload/v1771612613/101_k2qsju.png"
    >
      <Suspense>
        <SignUpForm />
      </Suspense>
    </AuthLayout>
  );
}
