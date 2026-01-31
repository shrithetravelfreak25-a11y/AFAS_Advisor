
export type ProblemType = 'fertilizer' | 'disease' | 'market' | 'general' | 'none';

export interface UserContext {
  region: string;
  crop: string;
  area: number;
  soilType: string;
  season: string;
  sowingDate?: string;
  language: string;
  images?: string[]; // Base64 strings for batch upload
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskMessage: string;
}

export interface FertilizerAdvice {
  urea: number; // kg
  dap: number; // kg
  mop: number; // kg
  schedule: string[];
  confidence: 'Low' | 'Medium' | 'High';
  source: string;
  explanation: string;
  diseaseFindings?: string; // Analysis of uploaded images
}

export interface MarketPrice {
  crop: string;
  price: number; // Per quintal
  unit: string;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Fertilizer' | 'Equipment' | 'Seeds' | 'Chemicals';
  price: number;
  unit: string;
  image: string;
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  date: string;
  amount: number;
  quantity: number;
  status: 'Delivered' | 'In Transit';
}

export enum AppStep {
  QUERY = 'query',
  CONTEXT = 'context',
  RESULT = 'result',
  MARKET = 'market',
  PRODUCTS = 'products',
  CART = 'cart',
  PURCHASES = 'purchases',
  SETTINGS = 'settings'
}
