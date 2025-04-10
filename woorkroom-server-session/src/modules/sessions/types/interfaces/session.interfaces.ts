export interface ISession {
  id: number;
  userId: number;
  accessToken: string;
  refreshToken: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}