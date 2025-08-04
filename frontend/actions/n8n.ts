"use server"
export const imageToGoogleSheetWorkflow = async (type: string,image: File, currency: string) => {
  try {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("image", image);
    formData.append("currency", currency);
    let url = process.env.N8N_WEBHOOK_URL2;
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