export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  inviteCode: string;
  accountType: string;
  stoken: string | null;
  walletAddress: string;
  createdAt: Date;
}
