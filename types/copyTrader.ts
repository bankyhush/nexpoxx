export interface CopyTrader {
  id: number;
  name: string;
  photo: string | null;
  noTrades: string;
  noCopiers: string;
  status: string;
  noWins: string;
  rank: string;
  strategyDesc: string | null;
  noLoss: string;
  profit: string;
  loss: string;
  edate: string;
  commission: string;
  createdAt: Date;
}
