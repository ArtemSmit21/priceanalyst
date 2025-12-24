export interface Product {
  id: string;
  name: string;
  marketplace: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface ProductStatistics {
  min: number;
  max: number;
  avg: number;
}

export interface NotificationRule {
  id: string;
  userId: string;
  productId: string;
  condition: string;
  threshold: number;
}
