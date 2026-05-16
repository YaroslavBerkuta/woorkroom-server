import { Observable } from 'rxjs';

export interface IRabbitmqMailsService {
  sendVerificationCode(phone: string, code: string): Observable<unknown>;
}
