import { OnboardLayout } from "../../components/onboard/OnboardLayout";
import { StepIndicator } from "../../components/onboard/StepIndicator";
import { IdentityForm } from "../../components/onboard/IdentityForm";
import { ImageUploadBox } from "../../components/onboard/ImageUploadBox";
import { OnboardFooter } from "../../components/onboard/OnboardFooter";

export const metadata = { title: "Step 1 of 3 — Onboarding" };

export default function OnboardStep1Page() {
  return (
    <OnboardLayout 
      heading="Let's get to know you"
      description="We need a few details to verify who you are. This keeps your account and your business safe."
    >
      <div className="flex flex-col w-full max-w-[500px] mx-auto md:mx-0 md:ml-auto md:pr-4">
        <StepIndicator currentStep={1} totalSteps={3} />
        
        <div className="flex flex-col gap-8 w-full mt-10">
          <IdentityForm />
          
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
            <ImageUploadBox label="Aadhar Front*" />
            <ImageUploadBox label="Aadhar Back*" />
          </div>
        </div>
        
        <div className="mt-8 w-full">
          <OnboardFooter />
        </div>
      </div>
    </OnboardLayout>
  );
}
