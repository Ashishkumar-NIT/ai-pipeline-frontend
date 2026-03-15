# Frontend Integration Guide — AI Jewellery Image Pipeline

This guide covers everything a frontend developer needs to upload a jewellery image with its metadata, trigger the AI processing pipeline, and display the resulting processed image.

---

## Base URL

```
http://localhost:8000
```

> Replace with your deployed server URL in production (e.g. `https://api.yourdomain.com`).

---

## Pipeline Overview

```
User uploads image + metadata
        │
        ▼
POST /process  ──► Returns product_id immediately (202 Accepted)
        │
        ▼ (runs in background)
  Step 1 — Save raw image to Supabase Storage
  Step 2 — Reve AI: Background removal
  Step 3 — Nanobana AI: Scene compositing & enhancement
  Step 4 — Upload final PNG to Supabase Storage
  Step 5 — Update product record with processed image URL
        │
        ▼
GET /product/{product_id}  ──► Poll until image_url is updated
```

---

## Endpoints

### 1. `GET /health`

Check whether the server is running.

**Request**
```
GET /health
```

**Response `200 OK`**
```json
{
  "status": "ok",
  "environment": "development"
}
```

**Usage:** Call this on app load to confirm the backend is reachable before showing the upload UI.

---

### 2. `POST /process` — Upload Image & Start Pipeline

Upload a new jewellery image along with its metadata. The server stores the raw image and immediately starts the AI pipeline in the background, returning a `product_id` you can use to poll for the result.

**Request**

- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

| Field            | Type   | Required | Description                                              |
|------------------|--------|----------|----------------------------------------------------------|
| `file`           | File   | ✅ Yes   | Raw jewellery image. JPEG / PNG / WebP only. Max **10 MB** |
| `title`          | string | ❌ No    | Display name for the product (e.g. `"Gold Necklace"`)   |
| `jewellery_type` | string | ❌ No    | Category (e.g. `"necklace"`, `"ring"`, `"earrings"`)    |

**Example — `fetch`**
```js
async function uploadAndProcess(imageFile, title, jewelleryType) {
  const formData = new FormData();
  formData.append("file", imageFile);          // File object from <input type="file">
  formData.append("title", title);
  formData.append("jewellery_type", jewelleryType);

  const response = await fetch("http://localhost:8000/process", {
    method: "POST",
    body: formData,
    // Do NOT set Content-Type manually — the browser sets it with the boundary
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail);
  }

  return await response.json();
}
```

**Example — `axios`**
```js
import axios from "axios";

async function uploadAndProcess(imageFile, title, jewelleryType) {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("title", title);
  formData.append("jewellery_type", jewelleryType);

  const { data } = await axios.post("http://localhost:8000/process", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { message, product_id, raw_image_url }
}
```

**Response `202 Accepted`**
```json
{
  "message": "Uploaded. Processing started in background.",
  "product_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "raw_image_url": "https://xyz.supabase.co/storage/v1/object/public/plant-images/products/a1b2c3d4.jpg"
}
```

> **Important:** This returns immediately — the processed image is **not** ready yet. Save the `product_id` and start polling (see step 4).

**Error Responses**

| Status | Reason                                      |
|--------|---------------------------------------------|
| `413`  | File exceeds 10 MB limit                   |
| `415`  | Unsupported file type (non JPEG/PNG/WebP)  |
| `422`  | Request body validation error              |
| `500`  | Server / storage / database error          |

---

### 3. `POST /process/{product_id}` — Re-process an Existing Product

Trigger the AI pipeline again for a product that already exists. Optionally attach a new image to replace the stored one.

**Request**

- **Method:** `POST`
- **URL Param:** `product_id` — UUID of the existing product
- **Content-Type:** `multipart/form-data` *(only if attaching a new file)*

| Field  | Type | Required | Description                                                      |
|--------|------|----------|------------------------------------------------------------------|
| `file` | File | ❌ No    | New image to replace the existing raw image before reprocessing |

**Example — re-process without changing image**
```js
const { data } = await axios.post(`http://localhost:8000/process/${productId}`);
```

**Example — re-process with a new image**
```js
const formData = new FormData();
formData.append("file", newImageFile);

const { data } = await axios.post(
  `http://localhost:8000/process/${productId}`,
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);
```

**Response `202 Accepted`**
```json
{
  "message": "Processing queued.",
  "product_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Gold Necklace",
  "raw_image_url": "https://xyz.supabase.co/storage/v1/object/public/plant-images/products/a1b2c3d4.jpg"
}
```

**Error Responses**

| Status | Reason                                             |
|--------|----------------------------------------------------|
| `404`  | Product ID not found in database                  |
| `413`  | File exceeds 10 MB                                |
| `415`  | Unsupported file type                             |
| `422`  | No image stored and no file uploaded              |

---

### 4. `GET /product/{product_id}` — Poll for Processed Result

Fetch the current state of a product. Poll this endpoint until `image_url` points to the processed image.

**Request**
```
GET /product/{product_id}
```

**Response `200 OK` — still processing**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Gold Necklace",
  "jewellery_type": "necklace",
  "image_url": "https://xyz.supabase.co/storage/v1/object/public/plant-images/products/a1b2c3d4.jpg",
  "created_at": "2026-02-21T10:00:00.000Z"
}
```

**Response `200 OK` — processing complete**

Once the pipeline finishes, `image_url` is updated to the final processed PNG:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Gold Necklace",
  "jewellery_type": "necklace",
  "image_url": "https://xyz.supabase.co/storage/v1/object/public/plant-images/products/processed/a1b2c3d4.png",
  "created_at": "2026-02-21T10:00:00.000Z"
}
```

> **Detect completion:** Check if `image_url` ends with `/processed/{product_id}.png` or compare it against the `raw_image_url` returned from step 2. If different — processing is done.

**Error Responses**

| Status | Reason                   |
|--------|--------------------------|
| `404`  | Product ID not found     |

---

## Complete Frontend Flow

Below is a self-contained example implementing the full upload → process → display flow.

```js
const API_BASE = "http://localhost:8000";
const POLL_INTERVAL_MS = 3000;   // check every 3 seconds
const POLL_TIMEOUT_MS  = 300000; // give up after 5 minutes

/**
 * Upload image + metadata, wait for AI processing, return processed URL.
 * @param {File}   imageFile
 * @param {string} title
 * @param {string} jewelleryType
 * @returns {Promise<string>} processed image URL
 */
async function processJewelleryImage(imageFile, title, jewelleryType) {
  // ── Step 1: Upload & start pipeline ──────────────────────────────────
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("title", title);
  formData.append("jewellery_type", jewelleryType);

  const uploadRes = await fetch(`${API_BASE}/process`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const { detail } = await uploadRes.json();
    throw new Error(`Upload failed: ${detail}`);
  }

  const { product_id, raw_image_url } = await uploadRes.json();
  console.log("Uploaded. product_id:", product_id);
  console.log("Raw image URL:", raw_image_url);

  // ── Step 2: Poll until processed image is ready ───────────────────────
  const processedUrl = await pollForResult(product_id, raw_image_url);
  return processedUrl;
}

/**
 * Poll GET /product/{id} until image_url differs from raw_image_url
 * (i.e. the processed version is written).
 */
async function pollForResult(productId, rawImageUrl) {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);

    const res = await fetch(`${API_BASE}/product/${productId}`);
    if (!res.ok) throw new Error(`Poll failed with status ${res.status}`);

    const product = await res.json();

    // Pipeline updates image_url once processing is complete
    if (product.image_url && product.image_url !== rawImageUrl) {
      console.log("Processing complete:", product.image_url);
      return product.image_url;
    }

    console.log("Still processing…");
  }

  throw new Error("Timed out waiting for processed image.");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// ── Example UI wiring ─────────────────────────────────────────────────────
document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput      = document.getElementById("image-input");
  const titleInput     = document.getElementById("title-input");
  const typeInput      = document.getElementById("type-input");
  const resultImg      = document.getElementById("result-image");
  const statusText     = document.getElementById("status-text");

  statusText.textContent = "Uploading…";
  resultImg.style.display = "none";

  try {
    const processedUrl = await processJewelleryImage(
      fileInput.files[0],
      titleInput.value,
      typeInput.value
    );

    resultImg.src = processedUrl;
    resultImg.style.display = "block";
    statusText.textContent = "Done! Processed image displayed above.";
  } catch (err) {
    statusText.textContent = `Error: ${err.message}`;
    console.error(err);
  }
});
```

---

## Minimal HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Jewellery AI Pipeline</title>
</head>
<body>

  <h1>Upload Jewellery Image</h1>

  <form id="upload-form">
    <label>
      Image (JPEG / PNG / WebP, max 10 MB)
      <input type="file" id="image-input" accept="image/jpeg,image/png,image/webp" required />
    </label>
    <br />

    <label>
      Title
      <input type="text" id="title-input" placeholder="e.g. Gold Necklace" />
    </label>
    <br />

    <label>
      Jewellery Type
      <select id="type-input">
        <option value="">— select —</option>
        <option value="necklace">Necklace</option>
        <option value="ring">Ring</option>
        <option value="earrings">Earrings</option>
        <option value="bracelet">Bracelet</option>
        <option value="pendant">Pendant</option>
      </select>
    </label>
    <br /><br />

    <button type="submit">Process Image</button>
  </form>

  <p id="status-text"></p>

  <!-- Processed result displayed here -->
  <img id="result-image" style="display:none; max-width:600px;" alt="Processed jewellery" />

  <script src="app.js"></script>
</body>
</html>
```

---

## File Upload Constraints

| Constraint         | Value                        |
|--------------------|------------------------------|
| Accepted formats   | JPEG, PNG, WebP              |
| Maximum file size  | **10 MB**                    |
| Recommended size   | < 5 MB for faster processing |

---

## CORS
If your frontend runs on a different origin (for example `http://localhost:3000`), the backend must allow that origin via CORS. Note: CORS works at the origin level — do not include path segments such as `/dashboard/add-product` in the allowed origins list; use the origin only (e.g. `http://localhost:3000`).

Below is a small, copy-pasteable FastAPI example that allows your local frontend to call the API and supports credentials (cookies) if required.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
  "http://localhost:3000",
  # add production origin(s) here, e.g. "https://app.yourdomain.com"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,    # set True if you use cookies or Authorization headers
  allow_methods=["GET", "POST", "OPTIONS"],
  allow_headers=["*"],
)

@app.get("/health")
def health():
  return {"status": "ok"}
```

If `allow_credentials=True` is used, your frontend fetch/axios calls must send credentials explicitly:

```js
// fetch
fetch("http://localhost:8000/process", { method: "POST", body: formData, credentials: 'include' })

// axios
axios.post("http://localhost:8000/process", formData, { withCredentials: true })
```

In most cases the image pipeline endpoints do not require cookies and can work with `allow_credentials=False`; prefer the stricter configuration in production and only allow the specific origins your app uses.

---

## Processing Time

The pipeline runs two AI models sequentially:

| Step | Model     | Task                       | Typical Duration |
|------|-----------|----------------------------|------------------|
| 2    | Reve      | Background removal         | 5 – 20 s         |
| 3    | Nanobana  | Scene compositing          | 10 – 40 s        |

**Total expected wait:** roughly **15 – 60 seconds** per image. The polling interval in the example above is set to 3 s, which is a safe default.

---

## Error Handling Reference

| HTTP Status | Meaning                          | Frontend Action                          |
|-------------|----------------------------------|------------------------------------------|
| `202`       | Accepted, processing started     | Save `product_id`, start polling         |
| `404`       | Product not found                | Show "Product not found" error           |
| `413`       | File too large                   | Prompt user to compress/resize image     |
| `415`       | Unsupported file type            | Prompt user to use JPEG/PNG/WebP         |
| `422`       | Validation error                 | Display `detail` message to user         |
| `500`       | Server error                     | Show generic error, allow retry          |
