import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login, UserMaster} from '../../models/login';
import {Observable} from 'rxjs';
import {ResponseModel} from '../../models/response-model';
import {APP_CONFIG} from '../../env/env';
import {Register} from '../../models/register';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http =  inject(HttpClient);
  userId =  signal<string>('');
  isLoggedIn = signal<boolean>(!!localStorage.getItem('auth_token'));




  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.extractAndStoreUserDetails(token);
  }

  loginUser(payload :  Login): Observable<ResponseModel<string>>{
    return this.http
      .post<ResponseModel<string>>(APP_CONFIG.baseUrl + '/auth/login', payload);
  }

  getUserDetails(userId: string): Observable<ResponseModel<UserMaster>> {
    return this.http.get<ResponseModel<UserMaster>>(
      `${APP_CONFIG.baseUrl}/auth/GetUserDetail?userId=${userId}`
    );
  }


  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_details');
    this.isLoggedIn.set(false);
  }

  registerUser(payload :  Register): Observable<ResponseModel<any>>{
    return this.http
      .post<ResponseModel<any>>(APP_CONFIG.baseUrl + '/auth/register', payload);
  }

  private extractAndStoreUserDetails(token: string): void {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      const userId =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

      const email =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

      if (userId) {
        localStorage.setItem('userId', userId);

      }

      if (email) {
        localStorage.setItem('email', email);
      }

    } catch (err) {
      console.error('JWT decode failed', err);
    }
  }

  getUserId(): string | null {

    const _userId = localStorage.getItem('userId');
    if (_userId) {
      this.userId.set(_userId);
    }

     return localStorage.getItem('userId');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }


}
