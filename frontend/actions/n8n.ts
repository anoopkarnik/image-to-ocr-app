"use server"
export const imageToGoogleSheetWorkflow = async (image: File, currency: string, webhookUrl?: string) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("currency", currency);
    let url = webhookUrl || process.env.N8N_WEBHOOK_URL2;
    const response = await fetch(url + "webhook/ocr-sheet-workflow", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process image");
    }

    const result = await response.json();
    console.log("Processing result:", result);
    return result;
  } catch (error) {
    console.error("Error in imageToGoogleSheetWorkflow:", error);
    throw error;
  }
}