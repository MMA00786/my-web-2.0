# ConvertEasy - Unit & Currency Converter

A modern, responsive website for converting between currencies and various units of measurement with light/dark mode toggle.

## Features

- Real-time currency conversion with ExchangeRate-API
- 30-day historical currency data chart
- Unit conversion for length, weight, temperature, and volume
- Auto-detection of visitor's likely currency
- Light/dark mode with manual toggle
- SEO-optimized with proper meta tags
- AdSense-ready placements
- Netlify-ready deployment

## Setup Instructions

1. **Clone or download** the repository
2. **Get an API key** from [ExchangeRate-API](https://www.exchangerate-api.com/)
3. **Replace the API key** in `currency-api.js`:
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';