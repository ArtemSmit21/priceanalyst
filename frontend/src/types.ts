export interface Product {
  id: string;
  name: string;
  marketplace: string;
  url?: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  addedAt?: string;
  updatedAt?: string;
}
