export default function UploadButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-celestique-dark px-8 py-3.5 text-sm font-medium text-white shadow-md hover:bg-[#2a2a2a] active:scale-[0.97] transition-all duration-200"
    >
      <i className="bi bi-upload"></i>
      Upload Now
    </button>
  );
}
