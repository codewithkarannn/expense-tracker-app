import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

export interface ToastData {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}
@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private toastSubject = new Subject<ToastData>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastData['type']) {
    this.toastSubject.next({ message, type });
  }
}
