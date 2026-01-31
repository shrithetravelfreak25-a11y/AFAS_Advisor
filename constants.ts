
import { MarketPrice, Product } from './types';

export const REGIONS = ['Punjab', 'Andhra Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'];

export const CROPS = ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton', 'Potato', 'Onion'];

export const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Arid'];

export const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

export const MOCK_PRICES: MarketPrice[] = [
  { crop: 'Wheat', price: 2275, unit: 'quintal', trend: 'up', mandi: 'Khanna Mandi' },
  { crop: 'Rice (Basmati)', price: 4500, unit: 'quintal', trend: 'down', mandi: 'Nellore Mandi' },
  { crop: 'Maize', price: 2100, unit: 'quintal', trend: 'stable', mandi: 'Kurnool Mandi' },
  { crop: 'Sugarcane', price: 340, unit: 'quintal', trend: 'up', mandi: 'Chittoor Mandi' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Neem Coated Urea', category: 'Fertilizer', price: 266, unit: '45kg Bag', image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=200' },
  { id: 'p2', name: 'DAP (Di-Ammonium Phosphate)', category: 'Fertilizer', price: 1350, unit: '50kg Bag', image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1e?auto=format&fit=crop&q=80&w=200' },
  { id: 'p3', name: 'MOP (Muriate of Potash)', category: 'Fertilizer', price: 1700, unit: '50kg Bag', image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=200' },
  { id: 'p4', name: 'Electric Sprayer 16L', category: 'Equipment', price: 2499, unit: 'Unit', image: 'https://images.unsplash.com/photo-1591193113735-5260b6327df4?auto=format&fit=crop&q=80&w=200' },
  { id: 'p5', name: 'Drip Irrigation Kit (1 Acre)', category: 'Equipment', price: 12500, unit: 'Set', image: 'https://images.unsplash.com/photo-1463123081488-72993afcde90?auto=format&fit=crop&q=80&w=200' },
  { id: 'p6', name: 'Hybrid Wheat Seeds', category: 'Seeds', price: 1800, unit: '40kg Bag', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200' }
];

export const FERTILIZER_RULES: Record<string, any> = {
  'Wheat': {
    'Alluvial': { urea: 120, dap: 60, mop: 40 },
    'Black': { urea: 100, dap: 50, mop: 30 },
    'default': { urea: 110, dap: 55, mop: 35 }
  },
  'Rice': {
    'Alluvial': { urea: 150, dap: 80, mop: 60 },
    'default': { urea: 130, dap: 70, mop: 50 }
  },
  'default': { urea: 100, dap: 50, mop: 40 }
};

export const SOURCES = [
  'Indian Council of Agricultural Research (ICAR)',
  'State Department of Agriculture',
  'Regional Fertilizer Guidelines'
];
