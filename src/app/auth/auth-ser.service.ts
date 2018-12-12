import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthSerService {
  private token: string;
  private isAuthenticated = false;
  private authSatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authSatusListener.next(false);
      } );
  }


  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number , userId: string }>('http://localhost:3000/api/auth/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          console.log(expiresInDuration);
          this.setAuthTime(expiresInDuration);
          this.isAuthenticated = true;
          this.authSatusListener.next(true);
          this.userId = response.userId;

          // save token and data of expiration on the save methode
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          // navgiate to home base
          this.router.navigate(['/']);
        }
      }, error => {
          this.authSatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authSatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    // delete the token from the storage
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    // console.log(this.token);
    return this.token;
  }
  getAuthSatusListener() {
    return this.authSatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTime(expiresIn / 1000);
      this.authSatusListener.next(true);

    }
  }

  private setAuthTime(duration: number) {
    console.log('setting timer:' + duration);
    this.tokenTimer = setTimeout(() => { this.logout(); }, duration * 1000);

  }
  // save data to localstorage 
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  // delete all data from localstorage
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  // return localstorage data
  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
