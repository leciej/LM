export type SalesStatsDto = {
  date: string;
  totalSales: number;
};

export type TopProductDto = {
  productId: string;
  name: string;
  soldCount: number;
};

export type StatsOverviewDto = {
  sales: SalesStatsDto[];
  topProducts: TopProductDto[];
};
