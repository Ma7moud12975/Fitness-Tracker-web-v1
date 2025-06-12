const response = await fetch("https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition", {
  method: "POST",
  headers: {
    "accept": "application/json",
    "X-API-KEY": "YOUR_CALORIE_MAMA_API_KEY",
  },
  body: formData,
});