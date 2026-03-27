"use client";

import { useState } from "react";
import { IdentityForm } from "./IdentityForm";
import { AadharUpload } from "./AadharUpload";
import { Step1Footer } from "./Step1Footer";

export function Step1Container() {
  const [name, setName] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isNameValid = name.trim().length > 0;
  const isAadharValid = aadhar.replace(/\s/g, '').length === 12;
  const isFormValid = isNameValid && isAadharValid && frontImage !== null && backImage !== null;

  return (
    <div className="flex flex-col gap-8 w-full mt-10">
      <IdentityForm 
        name={name} setName={setName} 
        aadhar={aadhar} setAadhar={setAadhar} 
        submitAttempted={submitAttempted} 
      />
      
      <AadharUpload 
        frontImage={frontImage} setFrontImage={setFrontImage}
        backImage={backImage} setBackImage={setBackImage}
        submitAttempted={submitAttempted}
      />
      
      <div className="mt-2 w-full">
        <Step1Footer 
          isFormValid={isFormValid} 
          onSubmitAttempt={() => setSubmitAttempted(true)} 
        />
      </div>
    </div>
  );
}
