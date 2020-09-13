import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";


@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private userSubject: BehaviorSubject<{ refreshToken: string; token: string }>;
  public user: Observable<{ refreshToken: string; token: string }>;
    UserService: any;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<{
      refreshToken: string;
      token: string;
    }>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): { refreshToken: string; token: string } {
    const refreshToken = localStorage.getItem("refreshToken");
    const token = localStorage.getItem("token");
    return {refreshToken,token};
  }

  

  registration(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, {
      email,
      password,
    });
  }

  verification(otp: number, hashToken: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/verification`, {
      otp,
      hashToken,
    });
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((data) => {
          const { refreshToken, token } = data || {};
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("token", token);
          this.userSubject.next({ refreshToken, token });
          this.startRefreshTokenTimer();
          return data;
        })
      );
  }

  logout() {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(["/login"]);
  }

  refreshToken() {
    const {token, refreshToken } = this.userValue;
    if(!token){
      return of([])
    }
    return this.http
      .post<any>(`${environment.apiUrl}/auth/refreshToken`, {accessToken:token,refreshToken})
      .pipe(
        map((data) => {
          const { refreshToken, token } = data || {};
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("token", token);
          this.userSubject.next({ refreshToken, token });
          this.startRefreshTokenTimer();
          return data;
        })
      );
  }

  // helper methods

  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.token.split(".")[1]));
   
    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
