import { OnboardLayout } from "../../../components/onboard/OnboardLayout";
import { StepIndicator } from "../../../components/onboard/StepIndicator";
import { BusinessForm } from "../../../components/onboard/step2/BusinessForm";
import { BusinessLogoUpload } from "../../../components/onboard/step2/BusinessLogoUpload";
import { Step2Footer } from "../../../components/onboard/step2/Step2Footer";

export const metadata = { title: "Step 2 of 3 — Onboarding" };

export default function OnboardStep2Page() {
  return (
    <OnboardLayout 
      heading="Tell us about your business"
      description="This is how retailers will find and recognise you on the platform."
    >
      <div className="flex flex-col w-full max-w-[500px] mx-auto md:mx-0 md:ml-auto md:pr-4">
        <StepIndicator currentStep={2} totalSteps={3} />
        
        <div className="flex flex-col gap-8 w-full mt-10">
          <BusinessForm />
          
          <div className="w-full">
            <BusinessLogoUpload />
          </div>
        </div>
        
        <div className="mt-8 w-full">
          <Step2Footer />
        </div>
      </div>
    </OnboardLayout>
  );
}
