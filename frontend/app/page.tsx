"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUpload";
import { imageToGoogleSheetWorkflow } from "@/actions/n8n";
import { waitFor } from "@/lib/waitFor";
import LoadingButton from "@/components/LoadingButton";
import { toast } from "sonner";

export default function Home() {
  const [currency, setCurrency] = useState("USD");
  const [image, setImage] = useState<File | null>(null);
  const [webhookUrl, setWebhookUrl] = useState(process.env.N8N_WEBHOOK_URL2!);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    setLoading(true);
    toast("The workflow has started", {
        description: "Please wait for a minute for the sheet to be updated",
      })

    if (!image) {
      alert("Please upload an image.");
      setLoading(false);
      return;
    }

    await imageToGoogleSheetWorkflow(image, currency, webhookUrl);

    await waitFor(60000);
    toast("The workflow has completed", {
        description: "Please check your Google Sheet for the results",
      })
    await waitFor(60000);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-black text-white"
    >
      <div className="max-w-xl w-full space-y-6 bg-black p-8 rounded-xl shadow-md border-[1px] border-white/50">

        <h1 className="text-2xl font-semibold text-center text-white/80">
          Image to Google Sheet 
        </h1>
         {/* <div className="flex flex-col gap-2">
          <label htmlFor="webhookUrl" className="text-sm font-medium text-muted-foreground">
            N8N Webhook URL (Only if you are hosting n8n)
          </label>
          <input
            id="webhookUrl"
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="p-2 border-[1px] border-white/50 rounded-md focus:outline-none focus:ring-[1px] focus:ring-primary bg-black"
            placeholder="Enter your webhook URL"
          />
        </div> */}

        <div className="flex flex-col gap-2">
          <label htmlFor="currency" className="text-sm font-medium text-muted-foreground">
            Select Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border-[1px] border-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black"
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

        <LoadingButton
          variant="primary"
          pending={loading}
          onClick={handleSubmit}
        >
          Convert
        </LoadingButton>

      </div>
    </form>
  );
}
