import { OnboardLayout } from "../../../components/onboard/OnboardLayout";
import { VerificationTimeline } from "../../../components/onboard/submitted/VerificationTimeline";
import { SubmittedFooter } from "../../../components/onboard/submitted/SubmittedFooter";

export const metadata = { title: "Under Verification — Onboarding" };

export default function OnboardSubmittedPage() {
  return (
    <OnboardLayout 
      heading="You're all submitted!"
      description="we're reviewing your details"
      backRoute="/onboard/step3"
    >
      <div className="flex flex-col w-full max-w-[500px] mx-auto md:mx-0 md:ml-auto md:pr-4">
        
        {/* Top Header tracking */}
        <div className="flex flex-col gap-4 w-full">
          <div className="text-[16px] text-[#868A91] font-medium tracking-wide">
            Under Verification
          </div>
          <svg className="w-full h-[6px] rounded-full mt-1" preserveAspectRatio="none" viewBox="0 0 100 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="6" rx="3" fill="#000000" />
          </svg>
        </div>
        
        <div className="flex flex-col w-full mt-10">
          <VerificationTimeline />
          
          <p className="text-[14px] text-[#9CA3AF] text-center mt-6">
            We&apos;ll verify your documents in 24–48 hours and notify you on your number once you&apos;re approved.
          </p>
        </div>
        
        <div className="mt-8 w-full">
          <SubmittedFooter />
        </div>
      </div>
    </OnboardLayout>
  );
}
