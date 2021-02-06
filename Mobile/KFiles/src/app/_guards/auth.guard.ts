import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad  {

  constructor(private loginService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
      console.log(route);
      console.log(segments);
      if (!this.loginService.isAuthenticated())
      {
        this.router.navigateByUrl('/login');
      }
      return this.loginService.isAuthenticated();
    }
}
