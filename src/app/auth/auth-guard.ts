import { AuthSerService } from './auth-ser.service';
// import { CanActivate } from '@angular/router/src/utils/preactivation';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(private authService: AuthSerService , private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.authService.getIsAuth();
        if (!isAuth) {
            this.router.navigate(['/login']);
        }
        return true;
        // throw new Error("Method not implemented.");
    }


}