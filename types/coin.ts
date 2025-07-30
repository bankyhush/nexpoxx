export interface Coin {
  id: number;
  coinName: string;
  coinTitle: string;
  coinRate: number;
  photo: string | null;
  createdAt: Date;
  withMin: string | null;
  withMax: string | null;
  withInstructions: string | null;
  depositInstructions: string | null;
  depositAddress: string | null;
  percent: string | null;
  coinVisible: boolean;
}
