// API key for ExchangeRate-API - replace with your own key
const API_KEY = '4be7135fb44f31ae4f433e63';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

// Cache for exchange rates to minimize API calls
const rateCache = {};
const historicalCache = {};

// Fetch list of available currencies
async function fetchCurrencies() {
    try {
        const response = await fetch(`${BASE_URL}/${API_KEY}/codes`);
        const data = await response.json();
        
        if (data.result === 'success') {
            return data.supported_codes.map(([code, name]) => ({ code, name }));
        } else {
            console.error('Error fetching currencies:', data['error-type']);
            return getDefaultCurrencies();
        }
    } catch (error) {
        console.error('Error fetching currencies:', error);
        return getDefaultCurrencies();
    }
}

// Get exchange rate between two currencies
async function getExchangeRate(fromCurrency, toCurrency) {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    
    // Check cache first
    if (rateCache[cacheKey] && rateCache[cacheKey].timestamp > Date.now() - 3600000) {
        return rateCache[cacheKey].rate;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/${API_KEY}/pair/${fromCurrency}/${toCurrency}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            // Cache the rate
            rateCache[cacheKey] = {
                rate: data.conversion_rate,
                timestamp: Date.now()
            };
            return data.conversion_rate;
        } else {
            console.error('Error fetching exchange rate:', data['error-type']);
            throw new Error(data['error-type']);
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        throw error;
    }
}

// Get historical rates for the last 30 days
async function getHistoricalRates(fromCurrency, toCurrency) {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    
    // Check cache first
    if (historicalCache[cacheKey]) {
        return historicalCache[cacheKey];
    }
    
    try {
        // Calculate dates for the last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        const dateStrings = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dateStrings.push(d.toISOString().split('T')[0]);
        }
        
        // Fetch historical data (note: this is a simplified approach)
        // In a real app, you might need a different API endpoint for historical data
        const response = await fetch(`${BASE_URL}/${API_KEY}/timeseries/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}/${fromCurrency}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            const rates = {};
            
            // Extract the rates for the target currency
            for (const date in data.conversion_rates) {
                if (data.conversion_rates[date][toCurrency]) {
                    rates[date] = data.conversion_rates[date][toCurrency];
                }
            }
            
            // Cache the data
            historicalCache[cacheKey] = rates;
            return rates;
        } else {
            console.error('Error fetching historical rates:', data['error-type']);
            return generateMockHistoricalData();
        }
    } catch (error) {
        console.error('Error fetching historical rates:', error);
        return generateMockHistoricalData();
    }
}

// Fallback currency list if API fails
function getDefaultCurrencies() {
    return [
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'HKD', name: 'Hong Kong Dollar' },
        { code: 'NZD', name: 'New Zealand Dollar' }
    ];
}

// Generate mock historical data when API fails
function generateMockHistoricalData() {
    const data = {};
    const today = new Date();
    const baseRate = 0.85; // Example base rate for EUR
    
    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        // Add some random fluctuation
        const fluctuation = (Math.random() * 0.1) - 0.05;
        data[dateString] = baseRate + fluctuation;
    }
    
    return data;
}