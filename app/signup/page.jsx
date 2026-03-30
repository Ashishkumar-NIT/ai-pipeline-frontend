import { Suspense } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { EntryForm } from "../../components/auth/EntryForm";

export const metadata = {
  title: "Get Started — Celestique",
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Join Celestique"
      subtitle="Enter your email to get started. We'll check if you already have an account."
      imageSrc="https://res.cloudinary.com/dcs0vuzwg/image/upload/v1774883373/authImg_ivftu7.png"
    >
      <Suspense>
        <EntryForm />
      </Suspense>
    </AuthLayout>
  );
}
