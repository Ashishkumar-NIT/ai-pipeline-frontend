import { ImageUploadBox } from "../ImageUploadBox";

export function DocumentUpload() {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
      <ImageUploadBox label="PAN Card*" />
      <ImageUploadBox label="GST Certificate*" />
    </div>
  );
}
