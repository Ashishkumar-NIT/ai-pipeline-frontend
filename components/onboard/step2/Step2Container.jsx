"use client";

import { useState } from "react";
import { BusinessForm } from "./BusinessForm";
import { BusinessLogoUpload } from "./BusinessLogoUpload";
import { Step2Footer } from "./Step2Footer";

export function Step2Container() {
  const [businessName, setBusinessName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [logoImage, setLogoImage] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isFormValid =
    businessName.trim().length >= 2 &&
    selectedState !== '' &&
    selectedCity !== '' &&
    logoImage !== null;

  return (
    <div className="flex flex-col gap-8 w-full mt-10">
      <BusinessForm 
        businessName={businessName} setBusinessName={setBusinessName}
        selectedState={selectedState} setSelectedState={setSelectedState}
        selectedCity={selectedCity} setSelectedCity={setSelectedCity}
        cities={cities} setCities={setCities}
        submitAttempted={submitAttempted}
      />
      
      <div className="w-full">
        <BusinessLogoUpload 
          logoImage={logoImage} setLogoImage={setLogoImage}
          submitAttempted={submitAttempted}
        />
      </div>
      
      <div className="mt-8 w-full">
        <Step2Footer 
          isFormValid={isFormValid}
          onSubmitAttempt={() => setSubmitAttempted(true)}
        />
      </div>
    </div>
  );
}
