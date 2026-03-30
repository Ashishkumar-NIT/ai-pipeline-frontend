import { Suspense } from "react";
import { AuthLayout } from "../../../components/auth/AuthLayout";
import { SetPasswordForm } from "../../../components/auth/SetPasswordForm";

export const metadata = {
  title: "Create Password — Celestique",
};

export default function SetPasswordPage() {
  return (
    <AuthLayout
      title="Create your password"
      subtitle="Almost there. Set a strong password to secure your Celestique account."
      imageSrc="https://res.cloudinary.com/dcs0vuzwg/image/upload/v1774883373/authImg_ivftu7.png"
    >
      <Suspense>
        <SetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
