import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthSerService {
  private token: string;

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
      const authData: AuthData = {email: email , password: password};

      this.http.post('http://localhost:3000/api/auth/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }


  loginUser(email: string, password: string) {
    const authData: AuthData = {email: email , password: password};
      this.http.post<{token: string}>('http://localhost:3000/api/auth/login', authData)
      .subscribe(response => {
        const  token = response.token;
        this.token = token;
      });
  }

  getToken() {
   // console.log(this.token);
    return this.token;
  }
}
