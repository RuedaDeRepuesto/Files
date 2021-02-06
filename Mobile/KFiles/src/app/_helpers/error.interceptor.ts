import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth-service.service';
import { Router } from '@angular/router';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService,private router:Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {              
                this.authenticationService.logout();
                console.log('No autorizado');
                this.router.navigateByUrl('/login',{replaceUrl:true});
            }

            const error = err.error || err.statusText;
            console.log('Interceptando error');
            console.log(error);
            return throwError(error);
        }))
    }
}
