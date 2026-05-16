export interface IRabbitmqMailsService {
  sendVerificationCode(phone: string, code: string): unknown;
}
