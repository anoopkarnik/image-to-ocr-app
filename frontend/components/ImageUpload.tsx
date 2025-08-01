"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  onChange: (file: File) => void;
  value: string | null;
};

export const ImageUploader = ({ value, onChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "AI Companions");

      // Simulate upload (or call onChange directly)
      onChange && onChange(file);
    } catch (e) {
      console.error(e);
      setError("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) await handleFile(file);
    },
    [onChange,handleFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // ✅ Paste event support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const item = e.clipboardData?.items?.[0];
      if (item && item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (file) handleFile(file);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  return (
    <div className="w-full h-full flex items-center justify-center b">
      <div
        ref={dropRef}
        {...(preview ? {} : getRootProps())} // Only apply dropzone props if no preview
        className={`
          w-full h-64 max-w-4xl
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all relative
          ${isDragActive ? "border-white/30" : "border-white/50 bg-black"}
          flex items-center justify-center
        `}
      >
        {!preview && <input {...getInputProps()} />}
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin w-4 h-4" />
            Uploading...
          </div>
        ) : preview ? (
        <>
          <Image
            src={preview} 
            alt="Preview"
            width={1000}
            height={1000}
            className="rounded-md object-cover max-h-48"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setPreview(null);
              onChange && onChange(null as any); // force parent to clear
            }}
            className="absolute top-2 right-2 bg-red-400 text-white rounded-full px-1 text-xs cursor-pointer
             hover:bg-red-700 transition z-50"
          >
            ✕
          </button>
        </>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Drag & drop, click to upload, or paste an image
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2 text-center w-full">{error}</p>
      )}
    </div>
  );
};
