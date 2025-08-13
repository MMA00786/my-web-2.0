// Unit conversion functions
function convertLengthUnits(value, fromUnit, toUnit) {
    // Convert to meters first
    let meters;
    switch (fromUnit) {
        case 'mm': meters = value / 1000; break;
        case 'cm': meters = value / 100; break;
        case 'm': meters = value; break;
        case 'km': meters = value * 1000; break;
        case 'in': meters = value * 0.0254; break;
        case 'ft': meters = value * 0.3048; break;
        case 'yd': meters = value * 0.9144; break;
        case 'mi': meters = value * 1609.344; break;
        default: return 0;
    }
    
    // Convert from meters to target unit
    switch (toUnit) {
        case 'mm': return meters * 1000;
        case 'cm': return meters * 100;
        case 'm': return meters;
        case 'km': return meters / 1000;
        case 'in': return meters / 0.0254;
        case 'ft': return meters / 0.3048;
        case 'yd': return meters / 0.9144;
        case 'mi': return meters / 1609.344;
        default: return 0;
    }
}

function convertWeightUnits(value, fromUnit, toUnit) {
    // Convert to grams first
    let grams;
    switch (fromUnit) {
        case 'mg': grams = value / 1000; break;
        case 'g': grams = value; break;
        case 'kg': grams = value * 1000; break;
        case 't': grams = value * 1000000; break;
        case 'oz': grams = value * 28.3495; break;
        case 'lb': grams = value * 453.592; break;
        case 'st': grams = value * 6350.29; break;
        default: return 0;
    }
    
    // Convert from grams to target unit
    switch (toUnit) {
        case 'mg': return grams * 1000;
        case 'g': return grams;
        case 'kg': return grams / 1000;
        case 't': return grams / 1000000;
        case 'oz': return grams / 28.3495;
        case 'lb': return grams / 453.592;
        case 'st': return grams / 6350.29;
        default: return 0;
    }
}

function convertTemperatureUnits(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    switch (fromUnit) {
        case 'c': celsius = value; break;
        case 'f': celsius = (value - 32) * 5/9; break;
        case 'k': celsius = value - 273.15; break;
        default: return 0;
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
        case 'c': return celsius;
        case 'f': return celsius * 9/5 + 32;
        case 'k': return celsius + 273.15;
        default: return 0;
    }
}

function convertVolumeUnits(value, fromUnit, toUnit) {
    // Convert to liters first
    let liters;
    switch (fromUnit) {
        case 'ml': liters = value / 1000; break;
        case 'l': liters = value; break;
        case 'm3': liters = value * 1000; break;
        case 'tsp': liters = value * 0.00492892; break;
        case 'tbsp': liters = value * 0.0147868; break;
        case 'floz': liters = value * 0.0295735; break;
        case 'cup': liters = value * 0.236588; break;
        case 'pt': liters = value * 0.473176; break;
        case 'qt': liters = value * 0.946353; break;
        case 'gal': liters = value * 3.78541; break;
        default: return 0;
    }
    
    // Convert from liters to target unit
    switch (toUnit) {
        case 'ml': return liters * 1000;
        case 'l': return liters;
        case 'm3': return liters / 1000;
        case 'tsp': return liters / 0.00492892;
        case 'tbsp': return liters / 0.0147868;
        case 'floz': return liters / 0.0295735;
        case 'cup': return liters / 0.236588;
        case 'pt': return liters / 0.473176;
        case 'qt': return liters / 0.946353;
        case 'gal': return liters / 3.78541;
        default: return 0;
    }
}