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

function NumberIndicator({ number }) {
  return (
    <div className="w-[26px] h-[26px] rounded-full bg-black text-white flex items-center justify-center text-xs font-medium">
      {number}
    </div>
  );
}

export function AddProductForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [variantUrls, setVariantUrls] = useState([]);
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
        processed_image_url:  variants?.[0] || null,
        generated_image_urls: variants?.length ? variants : null,
      });

      if (saveResult?.error) {
        console.error("[saveProduct]", saveResult.error);
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
    <div className="flex flex-col gap-10">
      {/* Section 1 - Page Title */}
      <div className="flex flex-col items-center text-center gap-2.5">
        <h1 className="text-4xl font-semibold text-[#111827] font-cirka">Add new product</h1>
        <p className="text-base text-[#6B7280] font-gilroy font-medium">
          Enter the details below to create a sparkling new listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Section 2 - Product Image Upload */}
        <div className="flex flex-row gap-[100px] items-start">
          {/* Left - Information */}
          <div className="flex flex-col gap-4 max-w-[360px]">
            <div className="flex items-center gap-3">
              <NumberIndicator number={1} />
              <h2 className="text-lg font-semibold text-[#111827] font-gilroy font-bold">Product image</h2>
            </div>
            <div className="text-sm text-[#6B7280] leading-relaxed font-gilroy">
              <p className="mb-3">
                Upload a clear image. We&apos;ll remove the background first, then enhance it.
              </p>
              <p className="font-medium text-[#374151] mb-2">Get the best result from your photo:</p>
              <ul className="list-disc list-inside space-y-1 text-[#6B7280]">
                <li>Place the jewellery on a background that contrasts with the product</li>
                <li>Upload a clear well-lit photo</li>
                <li>Keep only the product in the frame</li>
              </ul>
            </div>
          </div>

          {/* Right - Image Upload Area */}
          <div className="flex-1">
            <ImageUpload onFileChange={setImageFile} />
          </div>
        </div>

        {/* Section 3 - Essential Details */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <NumberIndicator number={2} />
            <h2 className="text-lg font-semibold text-[#111827] font-gilroy">Essential details</h2>
          </div>

          {/* Row 1 - Title with description */}
          <div className="flex justify-between gap-10 items-start">
            <div className="max-w-[300px]">
              <p className="text-sm text-[#6B7280] leading-relaxed font-gilroy">
                Define the core identity of your jewelry piece with a clear title and key attributes.
              </p>
            </div>
            <div className="flex-1 max-w-[500px]">
              <Input
                id="title"
                name="title"
                label="Product Title"
                type="text"
                placeholder="eg. Vintage gold Necklace"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 2 - Type and Material Category */}
          <div className="flex gap-5">
            <div className="flex-1">
              <Select
                id="jewellery_type"
                label="Type"
                options={JEWELLERY_TYPES}
                value={form.jewellery_type}
                onChange={(e) => setField("jewellery_type", e.target.value)}
                placeholder="select"
              />
            </div>
            <div className="flex-1">
              <Select
                id="category"
                label="Material Category"
                options={CATEGORIES}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                placeholder="select"
              />
            </div>
          </div>

          {/* Row 3 - Style, Size, Purity */}
          <div className="flex gap-5">
            <div className="flex-1">
              <Select
                id="style"
                label="Style Aesthetic"
                options={STYLES}
                value={form.style}
                onChange={(e) => setField("style", e.target.value)}
                placeholder="select"
              />
            </div>
            <div className="flex-1 flex gap-5">
              <div className="flex-1">
                <Select
                  id="size"
                  label="Size"
                  options={SIZES}
                  value={form.size}
                  onChange={(e) => setField("size", e.target.value)}
                  placeholder="select"
                />
              </div>
              <div className="flex-1">
                <Select
                  id="metalPurity"
                  label="Purity"
                  options={METAL_PURITIES}
                  value={form.metalPurity}
                  onChange={(e) => setField("metalPurity", e.target.value)}
                  placeholder="select"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 - Specifications */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <NumberIndicator number={3} />
            <h2 className="text-lg font-semibold text-[#111827] font-gilroy ">Specifications</h2>
          </div>

          {/* Block 1 - Description */}
          <p className="text-sm text-[#6B7280] leading-relaxed font-gilroy">
            Precise measurements help retailers understand your product better. Enter the weight details and availability information.
          </p>

          {/* Block 2 - Weight Inputs */}
          <div className="flex justify-between gap-5">
            <div className="flex-1">
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
            </div>
            <div className="flex-1">
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
            <div className="flex-1">
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
            </div>
          </div>

          {/* Block 3 - Stock Toggle */}
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#111827] font-gilroy">Available in Stock</span>
              <span className="text-M text-[#6B7280] font-gilroy ">Is this piece ready for immediate shipment?</span>
            </div>
            <Toggle
              id="stockAvailable"
              label=""
              checked={form.stockAvailable}
              onChange={(val) => setField("stockAvailable", val)}
            />
          </div>

          {/* Block 4 - Production Time (only shown when stock is OFF) */}
          {!form.stockAvailable && (
            <div className="animate-fade-in">
              <InputWithSuffix
                id="makeToOrderDays"
                label="Production time"
                type="number"
                min="0"
                placeholder="eg. 14"
                suffix="days"
                value={form.makeToOrderDays}
                onChange={(e) => setField("makeToOrderDays", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold">
                !
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-900">Submission Error</h3>
                <p className="text-sm text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section 5 - Submit Area */}
        <div className="flex justify-end items-center mt-5 gap-3">
          <p className="text-[8px] font-bold text-[#000000] max-w-[500px] font-gilroy mt-6.5 ">
           *By submitting, you allow us to display your product details <br />and images to retailers on the platform.
          </p>
          <button
            type="submit"
            className="bg-black text-white px-5 py-3 rounded-lg font-medium cursor-pointer hover:bg-black/90 transition-colors font-gilroy"
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
}
