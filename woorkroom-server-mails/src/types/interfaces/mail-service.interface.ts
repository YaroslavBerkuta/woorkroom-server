export interface IMailService {
  sendVerificationCode(to: string, code: string): Promise<void>;
}
