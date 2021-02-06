import { Injectable, resolveForwardRef } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User, UserLoginResponse } from '../_models/User';


 
const userKey = 'logedInUser';
const tokenKey = 'JWTToken'
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private currentUserSubject: BehaviorSubject<UserLoginResponse>;
  public currentUser: Observable<UserLoginResponse>;

  constructor(private httpClient:HttpClient)
  {
    this.currentUserSubject = new BehaviorSubject<UserLoginResponse>(JSON.parse(localStorage.getItem(userKey)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getUser() {
    return this.currentUserSubject.value;
  }

  public async login(user:string,pass:string):Promise<User>{
    var resp:UserLoginResponse;
    const body = {
      user:user,
      password:pass
    }
    resp = await this.httpClient.post<UserLoginResponse>(`${environment.APIurl}auth/token`,body).toPromise();
    console.log(resp);
    if(resp.access_token){
      localStorage.setItem(userKey,JSON.stringify(resp));
      this.currentUserSubject.next(resp);
    }

    return resp.user;
  }

  public isAuthenticated():boolean{
      if(this.getUser != null)
      {
        return true;
      }
      return false;
  }

  public logout() {
    localStorage.removeItem(userKey);
    this.currentUserSubject.next(null);
    location.reload();
  }

  public me(){
    return this.httpClient.get<User>(`${environment.APIurl}user`).toPromise();
  }
}