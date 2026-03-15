"use client";

import { useState } from "react";
import { Select } from "../ui/Select";
import { Toggle } from "../ui/Toggle";
import { Input } from "../ui/Input";
import { InputWithSuffix } from "../ui/InputWithSuffix";
import { ImageUpload } from "./ImageUpload";
import { ProcessingView } from "./ProcessingView";
import { processJewelleryImage } from "../../lib/api/products";
import { saveProduct } from "../../lib/actions/products";

const JEWELLERY_TYPES = [
  { value: "necklace", label: "Necklace" },
  { value: "ring", label: "Ring" },
  { value: "earrings", label: "Earrings" },
  { value: "bracelet", label: "Bracelet" },
  { value: "pendant", label: "Pendant" },
  { value: "bangles", label: "Bangles" },
  { value: "anklet", label: "Anklet" },
  { value: "brooch", label: "Brooch" },
];

const CATEGORIES = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "diamond", label: "Diamond" },
  { value: "platinum", label: "Platinum" },
  { value: "gemstone", label: "Gemstone" },
  { value: "pearl", label: "Pearl" },
];

const STYLES = [
  { value: "traditional", label: "Traditional" },
  { value: "modern", label: "Modern" },
  { value: "fusion", label: "Fusion" },
  { value: "antique", label: "Antique" },
  { value: "minimalist", label: "Minimalist" },
  { value: "bridal", label: "Bridal" },
];

const SIZES = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "freesize", label: "Free Size" },
];

const METAL_PURITIES = [
  { value: "24k", label: "24K (999)" },
  { value: "22k", label: "22K (916)" },
  { value: "18k", label: "18K (750)" },
  { value: "14k", label: "14K (585)" },
  { value: "925", label: "925 Silver" },
  { value: "950pt", label: "950 Platinum" },
];

const INITIAL_FORM = {
  jewellery_type: "",
  category: "",
  style: "",
  size: "",
  stockAvailable: false,
  makeToOrderDays: "",
  metalPurity: "",
  netWeight: "",
  grossWeight: "",
  stoneWeight: "",
  title: "",
};

export function AddProductForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | bg_removed | saving | done | error
  const [variantUrls, setVariantUrls] = useState([]); // up to 4 Nanobana variant URLs
  const [rawImageUrl, setRawImageUrl] = useState(null);
  const [bgRemovedUrl, setBgRemovedUrl] = useState(null);
  const [error, setError] = useState(null);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!imageFile) {
      setError("Please upload a product image.");
      window.scrollTo(0, 0);
      return;
    }
    setError(null);

    try {
      const { product_id, variantUrls: variants, rawImageUrl: raw } = await processJewelleryImage(
        {
          file: imageFile,
          title: form.title ||
            (form.jewellery_type
              ? JEWELLERY_TYPES.find((t) => t.value === form.jewellery_type)?.label
              : undefined),
          jewellery_type: form.jewellery_type || undefined,
        },
        {
          onStatusChange: setStatus,
          onBgRemoved: setBgRemovedUrl,
        }
      );

      // ── Update Supabase row with form metadata ────────────
      // The backend already created the row — we UPDATE it with
      // the wholesaler's details and the extra form fields.
      setStatus("saving");
      const saveResult = await saveProduct({
        product_id,
        title:              form.title || JEWELLERY_TYPES.find((t) => t.value === form.jewellery_type)?.label || "Untitled",
        jewellery_type:     form.jewellery_type || null,
        category:           form.category || null,
        style:              form.style || null,
        size:               form.size || null,
        stock_available:    form.stockAvailable,
        make_to_order_days: form.makeToOrderDays || null,
        metal_purity:       form.metalPurity || null,
        net_weight:         form.netWeight || null,
        gross_weight:       form.grossWeight || null,
        stone_weight:       form.stoneWeight || null,
        raw_image_url:      raw || null,
        // Pass variant URLs so saveProduct can write them as a safety net
        // if the backend somehow hadn't stored them yet
        processed_image_url:  variants?.[0] || null,
        generated_image_urls: variants?.length ? variants : null,
      });

      if (saveResult?.error) {
        console.error("[saveProduct]", saveResult.error);
        // Surface to user so they know the metadata wasn't saved
        setError(`Image processed but metadata save failed: ${saveResult.error}`);
      }

      setRawImageUrl(raw);
      setVariantUrls(variants);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setImageFile(null);
    setVariantUrls([]);
    setRawImageUrl(null);
    setBgRemovedUrl(null);
    setError(null);
    setStatus("idle");
  }

  const isProcessing = status === "uploading" || status === "processing" || status === "bg_removed" || status === "saving";

  if (isProcessing || status === "done") {
    return (
      <ProcessingView
        status={status}
        bgRemovedUrl={bgRemovedUrl}
        variantUrls={variantUrls}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-celestique-cream border border-celestique-taupe">
      
      {/* Header */}
      <div className="px-8 py-12 md:px-16 md:py-16 border-b border-celestique-taupe text-center">
        <h2 className="text-4xl md:text-5xl font-serif text-celestique-dark tracking-tight">Add New Product</h2>
        <p className="text-celestique-dark/60 mt-4 text-sm uppercase tracking-[0.2em]">Enter the details below to create a new listing</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-20">
        
        {/* Section: Media */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-4 space-y-4">
             <h3 className="text-xl font-serif text-celestique-dark flex items-center gap-3">
               <span className="text-sm font-sans uppercase tracking-[0.2em] text-celestique-dark/40">01</span>
               Product Image
             </h3>
             <p className="text-xs uppercase tracking-[0.1em] text-celestique-dark/60 leading-relaxed">
               Upload a high-quality image. Our AI will automatically enhance it and remove the background.
             </p>
           </div>
           <div className="lg:col-span-8">
             <ImageUpload onFileChange={setImageFile} />
           </div>
        </div>

        <div className="h-px w-full bg-celestique-taupe"></div>

        {/* Section: Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-4">
             <h3 className="text-xl font-serif text-celestique-dark flex items-center gap-3">
               <span className="text-sm font-sans uppercase tracking-[0.2em] text-celestique-dark/40">02</span>
               Essential Details
             </h3>
             <p className="text-xs uppercase tracking-[0.1em] text-celestique-dark/60 leading-relaxed">
               Define the core identity of your jewelry piece.
             </p>
          </div>
          
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <Input
                id="title"
                name="title"
                label="Product Title"
                type="text"
                placeholder="e.g. Vintage Gold Necklace"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Select
                id="jewellery_type"
                label="Type"
                options={JEWELLERY_TYPES}
                value={form.jewellery_type}
                onChange={(e) => setField("jewellery_type", e.target.value)}
              />
              <Select
                id="category"
                label="Material Category"
                options={CATEGORIES}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Select
                id="style"
                label="Style Aesthetic"
                options={STYLES}
                value={form.style}
                onChange={(e) => setField("style", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-6">
                <Select
                  id="size"
                  label="Size"
                  options={SIZES}
                  value={form.size}
                  onChange={(e) => setField("size", e.target.value)}
                />
                <Select
                  id="metalPurity"
                  label="Purity"
                  options={METAL_PURITIES}
                  value={form.metalPurity}
                  onChange={(e) => setField("metalPurity", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-celestique-taupe"></div>

        {/* Section: Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-4">
             <h3 className="text-xl font-serif text-celestique-dark flex items-center gap-3">
               <span className="text-sm font-sans uppercase tracking-[0.2em] text-celestique-dark/40">03</span>
               Specifications
             </h3>
             <p className="text-xs uppercase tracking-[0.1em] text-celestique-dark/60 leading-relaxed">
               Precise measurements and inventory details.
             </p>
          </div>

          <div className="lg:col-span-8 space-y-10">
            {/* Weights */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 bg-celestique-taupe/10 p-8 border border-celestique-taupe">
              <InputWithSuffix
                id="netWeight"
                label="Net Weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                suffix="g"
                value={form.netWeight}
                onChange={(e) => setField("netWeight", e.target.value)}
              />
              <InputWithSuffix
                id="grossWeight"
                label="Gross Weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                suffix="g"
                value={form.grossWeight}
                onChange={(e) => setField("grossWeight", e.target.value)}
              />
              <InputWithSuffix
                id="stoneWeight"
                label="Stone Weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                suffix="g"
                value={form.stoneWeight}
                onChange={(e) => setField("stoneWeight", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-6 border border-celestique-taupe bg-celestique-taupe/5">
              <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-celestique-dark">Available in Stock</span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-celestique-dark/60">Is this piece ready for immediate shipment?</span>
              </div>
              <Toggle
                id="stockAvailable"
                label=""
                checked={form.stockAvailable}
                onChange={(val) => setField("stockAvailable", val)}
              />
            </div>

            {!form.stockAvailable && (
              <div className="animate-fade-in">
                  <InputWithSuffix
                    id="makeToOrderDays"
                    label="Production Time"
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    suffix="days"
                    value={form.makeToOrderDays}
                    onChange={(e) => setField("makeToOrderDays", e.target.value)}
                    helperText="Days required to manufacture this piece"
                  />
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 p-6 animate-fade-in">
            <div className="flex items-center gap-4">
               <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-red-200 text-red-600">
                 !
               </div>
               <div>
                 <h3 className="text-xs uppercase tracking-[0.2em] text-red-900">Submission Error</h3>
                 <p className="text-sm text-red-700 mt-1">{error}</p>
               </div>
            </div>
          </div>
        )}

        {/* Submit - Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-celestique-cream/95 backdrop-blur-md border-t border-celestique-dark/10 p-4 md:p-6 flex justify-center md:justify-end shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-4 md:px-8">
            <div className="hidden md:block">
              <p className="text-[10px] uppercase tracking-widest text-celestique-dark/60 font-bold">
                Ready to process?
              </p>
              <p className="text-sm font-serif italic text-celestique-dark mt-1">
                Our AI will remove the background and generate 4 variants.
              </p>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto group relative inline-flex items-center justify-center gap-4 px-12 py-5 bg-celestique-dark text-celestique-cream text-[11px] uppercase tracking-widest font-bold hover:bg-celestique-dark/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>Process & Create Product</span>
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </button>
          </div>
        </div>
      </form>
      
      {/* Spacer to prevent footer overlap */}
      <div className="h-24"></div>
    </div>
  );
}
