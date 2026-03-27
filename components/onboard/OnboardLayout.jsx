import { OnboardNavbar } from "./OnboardNavbar";
import { LeftPanel } from "./LeftPanel";

export function OnboardLayout({ children, heading, description, backRoute }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans antialiased text-[#374151]">
      <OnboardNavbar backRoute={backRoute} />
      
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-[clamp(16px,3vw,48px)] py-[clamp(32px,5vw,80px)] flex flex-col md:flex-row md:items-start gap-10 md:gap-[clamp(24px,4vw,96px)]">
        {/* Left Side */}
        <div className="w-full md:w-[35%] shrink-0 pt-2 flex flex-col items-center md:items-start text-center md:text-left">
          <LeftPanel heading={heading} description={description} />
        </div>
        
        {/* Right Side - Dynamic Content */}
        <div className="w-full md:flex-1 flex flex-col items-center md:items-start min-h-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
