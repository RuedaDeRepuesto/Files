import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth-service.service';



@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanLoad  {

  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
      console.log(route);
      console.log(segments);
      if (this.authService.isAuthenticated())
      {
        this.router.navigateByUrl('/files');
      }
      return !this.authService.isAuthenticated();
    }
}
