document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Tab navigation
    const tabs = document.querySelectorAll('.nav-tabs li');
    const sections = document.querySelectorAll('.converter-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-converter`).classList.add('active');
        });
    });
    
    // Initialize converters
    initCurrencyConverter();
    initLengthConverter();
    initWeightConverter();
    initTemperatureConverter();
    initVolumeConverter();
});

function initCurrencyConverter() {
    const amountInput = document.getElementById('currency-amount');
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    const resultInput = document.getElementById('currency-result');
    const swapBtn = document.getElementById('swap-currencies');
    const convertBtn = document.getElementById('convert-currency');
    const rateInfo = document.getElementById('exchange-rate');
    const lastUpdated = document.getElementById('last-updated');
    
    // Populate currency dropdowns
    fetchCurrencies().then(currencies => {
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency.code;
            option1.textContent = `${currency.code} - ${currency.name}`;
            
            const option2 = option1.cloneNode(true);
            
            fromSelect.appendChild(option1);
            toSelect.appendChild(option2);
        });
        
        // Set default currencies based on user's location or common pairs
        setDefaultCurrencies(fromSelect, toSelect);
    });
    
    // Convert on button click
    convertBtn.addEventListener('click', convertCurrency);
    
    // Also convert when amount changes
    amountInput.addEventListener('input', convertCurrency);
    
    // Convert when currency selection changes
    fromSelect.addEventListener('change', convertCurrency);
    toSelect.addEventListener('change', convertCurrency);
    
    // Swap currencies
    swapBtn.addEventListener('click', function() {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        convertCurrency();
    });
    
    function convertCurrency() {
        const amount = parseFloat(amountInput.value) || 0;
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;
        
        if (!fromCurrency || !toCurrency) return;
        
        getExchangeRate(fromCurrency, toCurrency).then(rate => {
            const result = amount * rate;
            resultInput.value = result.toFixed(4);
            
            // Update rate info
            rateInfo.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
            
            // Update last updated time
            const now = new Date();
            lastUpdated.textContent = `Updated: ${now.toLocaleTimeString()}`;
            
            // Load historical data for chart
            loadHistoricalData(fromCurrency, toCurrency);
        }).catch(error => {
            console.error('Error converting currency:', error);
            resultInput.value = 'Error';
            rateInfo.textContent = 'Unable to get exchange rate';
        });
    }
}

function initLengthConverter() {
    const amountInput = document.getElementById('length-amount');
    const fromSelect = document.getElementById('length-from');
    const toSelect = document.getElementById('length-to');
    const resultInput = document.getElementById('length-result');
    const convertBtn = document.getElementById('convert-length');
    
    convertBtn.addEventListener('click', convertLength);
    
    // Also convert when inputs change
    amountInput.addEventListener('input', convertLength);
    fromSelect.addEventListener('change', convertLength);
    toSelect.addEventListener('change', convertLength);
    
    function convertLength() {
        const amount = parseFloat(amountInput.value) || 0;
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;
        
        const result = convertLengthUnits(amount, fromUnit, toUnit);
        resultInput.value = result.toFixed(6);
    }
}

function initWeightConverter() {
    const amountInput = document.getElementById('weight-amount');
    const fromSelect = document.getElementById('weight-from');
    const toSelect = document.getElementById('weight-to');
    const resultInput = document.getElementById('weight-result');
    const convertBtn = document.getElementById('convert-weight');
    
    convertBtn.addEventListener('click', convertWeight);
    
    amountInput.addEventListener('input', convertWeight);
    fromSelect.addEventListener('change', convertWeight);
    toSelect.addEventListener('change', convertWeight);
    
    function convertWeight() {
        const amount = parseFloat(amountInput.value) || 0;
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;
        
        const result = convertWeightUnits(amount, fromUnit, toUnit);
        resultInput.value = result.toFixed(6);
    }
}

function initTemperatureConverter() {
    const amountInput = document.getElementById('temp-amount');
    const fromSelect = document.getElementById('temp-from');
    const toSelect = document.getElementById('temp-to');
    const resultInput = document.getElementById('temp-result');
    const convertBtn = document.getElementById('convert-temp');
    
    convertBtn.addEventListener('click', convertTemperature);
    
    amountInput.addEventListener('input', convertTemperature);
    fromSelect.addEventListener('change', convertTemperature);
    toSelect.addEventListener('change', convertTemperature);
    
    function convertTemperature() {
        const amount = parseFloat(amountInput.value) || 0;
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;
        
        const result = convertTemperatureUnits(amount, fromUnit, toUnit);
        resultInput.value = result.toFixed(2);
    }
}

function initVolumeConverter() {
    const amountInput = document.getElementById('volume-amount');
    const fromSelect = document.getElementById('volume-from');
    const toSelect = document.getElementById('volume-to');
    const resultInput = document.getElementById('volume-result');
    const convertBtn = document.getElementById('convert-volume');
    
    convertBtn.addEventListener('click', convertVolume);
    
    amountInput.addEventListener('input', convertVolume);
    fromSelect.addEventListener('change', convertVolume);
    toSelect.addEventListener('change', convertVolume);
    
    function convertVolume() {
        const amount = parseFloat(amountInput.value) || 0;
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;
        
        const result = convertVolumeUnits(amount, fromUnit, toUnit);
        resultInput.value = result.toFixed(6);
    }
}

function setDefaultCurrencies(fromSelect, toSelect) {
    // Try to detect user's country currency
    const userCurrency = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let defaultFrom = 'USD';
    let defaultTo = 'EUR';
    
    // Simple detection - for production you might want a more robust solution
    if (userCurrency.includes('Europe')) {
        defaultFrom = 'EUR';
        defaultTo = 'USD';
    } else if (userCurrency.includes('America') || userCurrency.includes('New_York')) {
        defaultFrom = 'USD';
        defaultTo = 'EUR';
    } else if (userCurrency.includes('Asia')) {
        defaultFrom = 'CNY';
        defaultTo = 'USD';
    }
    
    // Set the values if they exist in the dropdowns
    if (fromSelect.querySelector(`option[value="${defaultFrom}"]`)) {
        fromSelect.value = defaultFrom;
    }
    
    if (toSelect.querySelector(`option[value="${defaultTo}"]`)) {
        toSelect.value = defaultTo;
    }
}

function loadHistoricalData(fromCurrency, toCurrency) {
    getHistoricalRates(fromCurrency, toCurrency).then(data => {
        const dates = Object.keys(data).map(date => {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        });
        
        const rates = Object.values(data);
        
        const ctx = document.getElementById('currency-chart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (window.currencyChart) {
            window.currencyChart.destroy();
        }
        
        window.currencyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${fromCurrency} to ${toCurrency} Exchange Rate`,
                    data: rates,
                    borderColor: '#1a73e8',
                    backgroundColor: 'rgba(26, 115, 232, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-color')
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `1 ${fromCurrency} = ${context.parsed.y.toFixed(6)} ${toCurrency}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: getComputedStyle(document.body).getPropertyValue('--border-color')
                        },
                        ticks: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-color')
                        }
                    },
                    y: {
                        grid: {
                            color: getComputedStyle(document.body).getPropertyValue('--border-color')
                        },
                        ticks: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-color'),
                            callback: function(value) {
                                return value.toFixed(4);
                            }
                        }
                    }
                }
            }
        });
    }).catch(error => {
        console.error('Error loading historical data:', error);
    });
}