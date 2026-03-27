export function BusinessLogoUpload() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[13px] font-semibold text-[#374151]">Business Logo</span>
      <button 
        type="button" 
        className="w-full flex items-center justify-center bg-[#EEF4FF] border-[1.5px] border-dashed border-[#2563EB] rounded-[12px] hover:bg-blue-50 transition-colors cursor-pointer py-10"
      >
        <div className="w-12 h-12 rounded-full border-2 border-[#2563EB] flex items-center justify-center text-[#2563EB]">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[26px] h-[26px]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </div>
      </button>
    </div>
  );
}
