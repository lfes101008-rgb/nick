import { StockDataPoint, MovingAverageData } from "../types";

export const calculateMovingAverages = (data: StockDataPoint[]): MovingAverageData[] => {
  const result: MovingAverageData[] = [];

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const ma5 = calculateSMA(data, i, 5);
    const ma20 = calculateSMA(data, i, 20);
    const ma60 = calculateSMA(data, i, 60);

    result.push({
      ...point,
      ma5,
      ma20,
      ma60
    });
  }

  return result;
};

const calculateSMA = (data: StockDataPoint[], currentIndex: number, period: number): number | null => {
  if (currentIndex < period - 1) return null;

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[currentIndex - i].close;
  }
  return Number((sum / period).toFixed(2));
};
