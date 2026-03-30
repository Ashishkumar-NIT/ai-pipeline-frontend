import { Suspense } from "react";
import { AuthLayout } from "../../../../components/auth/AuthLayout";
import { OtpForm } from "../../../../components/auth/OtpForm";

export const metadata = {
  title: "Verify OTP — Celestique",
};

export default function VerifyOtpPage() {
  return (
    <AuthLayout
      title="Enter your OTP"
      subtitle="We've sent a 6-digit verification code. It's valid for 60 seconds."
      imageSrc="https://res.cloudinary.com/dcs0vuzwg/image/upload/v1774883373/authImg_ivftu7.png"
    >
      <Suspense>
        <OtpForm />
      </Suspense>
    </AuthLayout>
  );
}
