import { ImageUploadBox } from "../ImageUploadBox";

export function AadharUpload({ frontImage, setFrontImage, backImage, setBackImage, submitAttempted }) {
  const frontError = submitAttempted && !frontImage;
  const backError = submitAttempted && !backImage;

  return (
    <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full">
      <ImageUploadBox 
        label="Aadhar Front*" 
        image={frontImage} 
        onUpload={(file) => setFrontImage(file)}
        onRemove={() => setFrontImage(null)}
        error={frontError ? "Please upload Aadhar Front" : null}
      />
      <ImageUploadBox 
        label="Aadhar Back*" 
        image={backImage} 
        onUpload={(file) => setBackImage(file)}
        onRemove={() => setBackImage(null)}
        error={backError ? "Please upload Aadhar Back" : null}
      />
    </div>
  );
}
