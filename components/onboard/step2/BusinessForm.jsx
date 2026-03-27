"use client";

import { useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export function BusinessForm() {
  const [businessName, setBusinessName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="businessName" className="text-[13px] font-semibold text-[#374151]">Business name*</label>
        <input 
          id="businessName"
          type="text" 
          placeholder="Pc jewellers"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full bg-[#F5F5F5] rounded-[8px] border-none outline-none px-4 py-3.5 text-[15px] text-[#374151] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-black/10 transition-shadow"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:gap-5 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="state" className="text-[13px] font-semibold text-[#374151]">State*</label>
          <div className="relative">
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full appearance-none bg-[#FFFFFF] rounded-[8px] border border-[#E5E7EB] outline-none px-4 py-3.5 text-[15px] text-[#374151] focus:ring-2 focus:ring-black/10 transition-shadow cursor-pointer"
            >
              <option value="" disabled className="text-[#9CA3AF]">select</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#374151]">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-[13px] font-semibold text-[#374151]">City*</label>
          <div className="relative">
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none bg-[#FFFFFF] rounded-[8px] border border-[#E5E7EB] outline-none px-4 py-3.5 text-[15px] text-[#374151] focus:ring-2 focus:ring-black/10 transition-shadow cursor-pointer"
            >
              <option value="" disabled className="text-[#9CA3AF]">select</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Surat">Surat</option>
              <option value="Pune">Pune</option>
              <option value="Jaipur">Jaipur</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#374151]">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
