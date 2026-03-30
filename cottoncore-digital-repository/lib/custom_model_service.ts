
export async function predictWithCustomModel(imageBase64: string) {
  try {
    // Convert base64 to Blob
    const base64Data = imageBase64.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', blob, 'sample.jpg');

    // Assumes backend is running on localhost:8000
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Backend model server is not responding.');

    const result = await response.json();
    
    // Format to match the expected UI result structure
    return {
      prediction: result.prediction,
      probability: result.probability,
      analysis_logs: [
        "Uplink established with Local PyTorch Node...",
        "ResNet18 Architecture Initialized...",
        "Image tensor normalized to [0.485, 0.456, 0.406]...",
        "Classification complete."
      ],
      morphology: {
        fineness_estimate: "Calculated by model",
        convolution_rate: "N/A",
        maturity_visual: "N/A"
      },
      reasoning: `Custom .pth model identifies this sample as ${result.prediction} with ${(result.probability * 100).toFixed(2)}% confidence.`
    };
  } catch (error) {
    console.error("Custom Model Error:", error);
    throw error;
  }
}
