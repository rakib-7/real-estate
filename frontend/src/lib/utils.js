// --- lib/utils.js ---
// Utility functions
import React, { useState, useEffect, createContext, useContext } from 'react';
/**
 * Formats a number into Bangladeshi Taka (BDT) Lakh and Crore currency format.
 * @param {number | string} price - The price in BDT.
 * @returns {string} The formatted price string (e.g., "৳ 50.5 Lakh", "৳ 2.1 Crore").
 */
// function formatPrice(price) {
//   if (typeof price !== 'number') {
//     return price; // Return as is if not a number
//   }
//   return `BDT ${price.toLocaleString('en-BD')}`;
// }

export const formatBdtPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Price not available';
  }

  const numericPrice = Number(price);
  
  if (numericPrice >= 10000000) { // 1 Crore or more
    const crore = (numericPrice / 10000000).toFixed(2);
    // Remove .00 if it's a whole number
    return `৳ ${parseFloat(crore)} Crore`; 
  } else if (numericPrice >= 100000) { // 1 Lakh or more
    const lakh = (numericPrice / 100000).toFixed(2);
    // Remove .00 if it's a whole number
    return `৳ ${parseFloat(lakh)} Lakh`;
  } else {
    // For prices below 1 Lakh, show the regular number with commas
    return `৳ ${numericPrice.toLocaleString('en-IN')}`;
  }
};

export const locationsData = {
  "Chittagong": {
    "Chittagong": ["Panchlaish", "Kotwali", "Chandgaon", "Pahartali"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Teknaf", "Ukhia"],
    "Comilla": ["Comilla Sadar", "Laksam"],
  },
  "Dhaka": {
    "Dhaka": ["Gulshan", "Banani", "Dhanmondi", "Uttara", "Motijheel"],
    "Gazipur": ["Gazipur Sadar", "Tongi"],
    "Narayanganj": ["Narayanganj Sadar", "Siddhirganj"],
  },
  "Sylhet": {
    "Sylhet": ["Sylhet Sadar", "Beanibazar"],
    "Habiganj": ["Habiganj Sadar"],
  }
};

// export {formatPrice};