import { ImageUploadBox } from "../ImageUploadBox";

export function DocumentUpload({ panFile, setPanFile, gstFile, setGstFile, submitAttempted }) {
  const panError = submitAttempted && !panFile;
  const gstError = submitAttempted && !gstFile;

  return (
    <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full">
      <ImageUploadBox 
        label="PAN Card*" 
        image={panFile} 
        onUpload={(file) => setPanFile(file)}
        onRemove={() => setPanFile(null)}
        error={panError ? "Please upload your PAN Card" : null}
        accept="image/jpeg, image/png, image/webp, application/pdf"
      />
      <ImageUploadBox 
        label="GST Certificate*" 
        image={gstFile} 
        onUpload={(file) => setGstFile(file)}
        onRemove={() => setGstFile(null)}
        error={gstError ? "Please upload your GST Certificate" : null}
        accept="image/jpeg, image/png, image/webp, application/pdf"
      />
    </div>
  );
}
