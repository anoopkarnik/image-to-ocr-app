"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/ImageUpload";
import { imageToGoogleSheetWorkflow } from "@/actions/n8n";

export default function Home() {
  const [currency, setCurrency] = useState("USD");
  const [image, setImage] = useState<File | null>(null);
  const [webhookUrl, setWebhookUrl] = useState(process.env.N8N_WEBHOOK_URL!);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    await imageToGoogleSheetWorkflow(image, currency, webhookUrl);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-muted/30"
    >
      <div className="max-w-xl w-full space-y-6 bg-background p-8 rounded-xl shadow-md border">

        <h1 className="text-2xl font-semibold text-center text-primary">
          Image to Google Sheet Workflow
        </h1>
         <div className="flex flex-col gap-2">
          <label htmlFor="webhookUrl" className="text-sm font-medium text-muted-foreground">
            N8N Webhook URL
          </label>
          <input
            id="webhookUrl"
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black"
            placeholder="Enter your webhook URL"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="currency" className="text-sm font-medium text-muted-foreground">
            Select Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black"
          >
            <option value="USD">USD</option>
            <option value="EURO">EURO</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Upload or Paste Image
          </label>
          <ImageUploader value="" onChange={setImage} />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          Convert
        </button>
      </div>
    </form>
  );
}
