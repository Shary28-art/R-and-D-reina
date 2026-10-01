"use client";

import { useRef, useState, DragEvent } from "react";
import Image from "next/image";
import { Upload, CheckCircle2, FileImage, X } from "lucide-react";

const ACCEPT = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export function PaymentUpload({
  onFile,
}: {
  onFile: (file: File | null, preview?: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function processFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPT.includes(file.type)) {
      setError("Please upload a valid image (JPG, PNG) or PDF document.");
      onFile(null);
      return;
    }
    setError("");
    setName(file.name);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setPreview(url);
        onFile(file, url);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onFile(file);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  }

  function handleRemove() {
    setName("");
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onFile(null);
  }

  return (
    <div className="mt-6 rounded-md border border-gold/30 bg-[#fdfbf7] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal flex items-center gap-2">
          <span>Upload Payment Confirmation Screenshot</span>
        </h3>
        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-700">
          Required *
        </span>
      </div>

      <p className="mt-2 text-xs text-warm-gray leading-relaxed">
        After completing your Zelle transfer, upload the screenshot or receipt from your banking app. Our team will match it with your order.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="sr-only"
        onChange={(e) => processFile(e.target.files?.[0])}
      />

      {!name ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`mt-4 flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center cursor-pointer transition ${
            isDragging
              ? "border-gold bg-champagne/20 scale-[0.99]"
              : "border-gray-300 hover:border-gold hover:bg-white"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/40 text-gold mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal">
            Click to upload or drag &amp; drop
          </p>
          <p className="mt-1 text-[11px] text-warm-gray">
            PNG, JPG, or PDF (receipt or transaction screenshot)
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-green-900 font-medium truncate">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <FileImage className="h-4 w-4 text-green-700 shrink-0" />
              <span className="truncate">{name}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-600 p-1 transition"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {preview && (
            <div className="relative mt-3 aspect-video max-h-52 w-full overflow-hidden rounded border border-gray-200 bg-white">
              <Image src={preview} alt="Zelle payment confirmation preview" fill className="object-contain" />
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-green-800 font-medium">
              ✓ Screenshot ready for verification
            </span>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] font-semibold text-gold-dark hover:underline"
            >
              Change screenshot
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
