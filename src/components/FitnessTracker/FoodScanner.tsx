import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const fetchOpenFoodFacts = async (barcode) => {
  try {
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}.json`);
    if (!response.ok) throw new Error("Product not found");
    const data = await response.json();
    const product = data.product;
    return {
      name: product.product_name,
      calories: product.nutriments["energy-kcal_100g"],
      fat: product.nutriments["fat_100g"],
      sugars: product.nutriments["sugars_100g"],
    };
  } catch (error) {
    return { error: "Product not found or error fetching data." };
  }
};

const FoodScanner = ({ className = "" }) => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Barcode state
  const [barcode, setBarcode] = useState("");
  const [barcodeResult, setBarcodeResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  // New: weight in grams
  const [weight, setWeight] = useState(""); // Weight state

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      // Convert image to base64
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
      });
      const base64Image = await toBase64(image);

      // Gemini API endpoint and key (replace with your own if needed)
      const GEMINI_API_KEY = "AIzaSyBA9fgqD-iiFxORI-DGisCr-xjGJ_ulapU"; // IMPORTANT: Consider moving this key to environment variables for security
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`; // Changed model to gemini-2.0-flash and endpoint to v1beta

      let promptText = "Identify the food in this image and estimate the calories. Respond in JSON with keys 'food' and 'calories'.";
      if (weight) {
        promptText = `Identify the food in this image and estimate the calories for ${weight} grams. Respond in JSON with keys 'food' and 'calories'.`;
      }
      const geminiRequest = {
        contents: [
          {
            parts: [
              {
                text: promptText
              },
              {
                inline_data: {
                  mime_type: image.type,
                  data: base64Image
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(geminiRequest)
      });
      if (!response.ok) {
        const errText = await response.text();
        setError(`Gemini API request failed: ${response.status} ${response.statusText}. ${errText}`);
        setLoading(false);
        return;
      }
      const data = await response.json();
      // Try to extract JSON from Gemini's text response
      let food = "Unknown";
      let calories = "N/A";
      try {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          food = parsed.food || food;
          calories = parsed.calories || calories;
        } else {
          food = text;
        }
      } catch (e) {
        food = "Could not parse Gemini response.";
      }
      setResult({ food, calories });
    } catch (err) {
      setError("Failed to scan food. Please try again. See console for details.");
      console.error("Food scan error:", err);
    }
    setLoading(false);
  };

  const handleBarcodeSearch = async () => {
    setLoading(true);
    setError(null);
    setBarcodeResult(null);
    const res = await fetchOpenFoodFacts(barcode);
    if (res.error) setError(res.error);
    else setBarcodeResult(res);
    setLoading(false);
  };

  return (
    <div className={`food-scanner bg-card/70 p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-8 ${className}`}>
      <h2 className="text-xl font-bold mb-2">Food Scanner</h2>
      <p className="mb-4 text-muted-foreground text-sm">Upload a photo of your food to estimate calories, or search by barcode.</p>
      <label htmlFor="food-image" className="block mb-2 font-medium">Select food image</label>
      <input id="food-image" type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
      {/* New: Weight input */}
      <label htmlFor="food-weight" className="block mb-2 font-medium">Food weight (grams, optional)</label>
      <input
        id="food-weight"
        type="number"
        min="1"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        className="mb-4 border rounded px-2 py-1 w-full"
        placeholder="e.g. 150"
      />
      {image && (
        <div className="mb-4 flex justify-center">
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded food preview"
            className="max-h-40 rounded shadow"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
      <button
        onClick={handleScan}
        disabled={!image || loading}
        className="w-full bg-primary text-white py-2 rounded mt-2 disabled:opacity-50"
      >
        {loading ? "Scanning..." : "Scan Food"}
      </button>
      <div className="mt-6">
        <label htmlFor="barcode" className="block mb-2 font-medium">Or enter barcode</label>
        <div className="flex gap-2 mb-2">
          <input
            id="barcode"
            type="text"
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="e.g. 3274080005003"
          />
          {!scanning && (
            <button
              type="button"
              onClick={() => setScanning(true)}
              className="bg-primary text-white px-3 rounded flex items-center justify-center"
              title="Scan barcode with camera"
            >
              {/* Modern QR code scan icon (Lucide SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="inline-block align-middle">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 17v2a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          )}
        </div>
        {scanning && (
          <div className="mb-2">
            <BarcodeScannerComponent
              width={300}
              height={200}
              onUpdate={(err, result) => {
                if (result) {
                  setBarcode(result.text);
                  setScanning(false);
                }
              }}
            />
            <button
              type="button"
              onClick={() => setScanning(false)}
              className="w-full bg-destructive text-white py-2 rounded mt-2"
            >
              Cancel Scan
            </button>
          </div>
        )}
        <button
          onClick={handleBarcodeSearch}
          disabled={!barcode || loading}
          className="w-full bg-primary text-white py-2 rounded mt-2 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search by Barcode"}
        </button>
        {barcodeResult && (
          <div className="mt-4 p-3 bg-muted rounded">
            <p className="font-semibold">Product: <span className="font-normal">{barcodeResult.name}</span></p>
            <p className="font-semibold">Calories/100g: <span className="font-normal">{barcodeResult.calories}</span></p>
            <p className="font-semibold">Fat/100g: <span className="font-normal">{barcodeResult.fat}</span></p>
            <p className="font-semibold">Sugars/100g: <span className="font-normal">{barcodeResult.sugars}</span></p>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-4 p-3 bg-muted rounded">
          <p className="font-semibold">Food: <span className="font-normal">{result.food}</span></p>
          <p className="font-semibold">Estimated Calories{weight ? ` (${weight}g)` : ""}: <span className="font-normal">{result.calories}</span></p>
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-4">
      </div>
    </div>
  );
};

export default FoodScanner;
