// src/utils/format.js
export const formatNumber = (value, options = {}) => {
    if (value === null || value === undefined) return '-';
    
    const {
      decimals = 2,
      decimalSeparator = ',',
      thousandSeparator = '.',
      currency = ''
    } = options;
  
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numericValue)) return value;
  
    const parts = numericValue.toFixed(decimals).split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] || '';
  
    // Agregar separadores de miles
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
    // Construir el resultado
    let result = integerPart;
    if (decimals > 0) {
      result += decimalSeparator + decimalPart;
    }
  
    return currency ? `${currency} ${result}` : result;
  };