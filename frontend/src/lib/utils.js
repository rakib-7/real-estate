// --- lib/utils.js ---
// Utility functions
import React, { useState, useEffect, createContext, useContext } from 'react';
function formatPrice(price) {
  if (typeof price !== 'number') {
    return price; // Return as is if not a number
  }
  return `BDT ${price.toLocaleString('en-BD')}`;
}

export {formatPrice};