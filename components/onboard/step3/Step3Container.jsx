"use client";

import { useState } from "react";
import { useOnboard } from "../../../context/OnboardContext";
import { DocumentUpload } from "./DocumentUpload";
import { Step3Footer } from "./Step3Footer";

export function Step3Container() {
  const {
    panFile, setPanFile,
    gstFile, setGstFile,
  } = useOnboard();

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isFormValid = panFile !== null && gstFile !== null;

  return (
    <div className="flex flex-col gap-8 w-full mt-10">
      <DocumentUpload
        panFile={panFile} setPanFile={setPanFile}
        gstFile={gstFile} setGstFile={setGstFile}
        submitAttempted={submitAttempted}
      />
      <div className="mt-8 w-full">
        <Step3Footer
          isFormValid={isFormValid}
          onSubmitAttempt={() => setSubmitAttempted(true)}
        />
      </div>
    </div>
  );
}
