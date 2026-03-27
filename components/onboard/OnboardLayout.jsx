import { OnboardNavbar } from "./OnboardNavbar";
import { LeftPanel } from "./LeftPanel";

export function OnboardLayout({ children, heading, description, backRoute }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans antialiased text-[#374151]">
      <OnboardNavbar backRoute={backRoute} />
      
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-10 lg:py-20 lg:px-10 flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-24">
        {/* Left Side */}
        <div className="w-full lg:w-[40%] shrink-0 pt-2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <LeftPanel heading={heading} description={description} />
        </div>
        
        {/* Right Side - Dynamic Content */}
        <div className="w-full lg:w-[60%] flex flex-col items-center lg:items-start min-h-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
