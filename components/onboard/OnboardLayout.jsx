import { OnboardNavbar } from "./OnboardNavbar";
import { LeftPanel } from "./LeftPanel";

export function OnboardLayout({ children, heading, description, backRoute }) {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans antialiased text-[#374151]">
      <OnboardNavbar backRoute={backRoute} />
      
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-10 md:py-20 md:px-10 flex flex-col md:flex-row md:items-start gap-12 md:gap-24">
        {/* Left Side */}
        <div className="w-full md:w-[40%] shrink-0 pt-2">
          <LeftPanel heading={heading} description={description} />
        </div>
        
        {/* Right Side - Dynamic Content */}
        <div className="w-full md:w-[60%] flex flex-col items-start min-h-[400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
