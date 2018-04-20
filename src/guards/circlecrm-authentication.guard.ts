import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Params,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CirclecrmAuthenticationService} from '../services/circlecrm-authentication.service';

@Injectable()
export class CirclecrmAuthenticationGuard implements CanActivate, CanActivateChild {

    public constructor(private router: Router, private authService: CirclecrmAuthenticationService) {
    }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const jwtToken: string | null = next.queryParams[CirclecrmAuthenticationService.TOKEN_URI_PARAM];
        this.authService.authenticate(jwtToken || '');

        if (jwtToken) {
            const params: Params = {};

            next.queryParamMap
                .keys
                .filter((key) => key !== CirclecrmAuthenticationService.TOKEN_URI_PARAM)
                .forEach((queryParam) => params[queryParam] = next.queryParamMap.getAll(queryParam));

            this.router.navigate(next.url, {queryParams: params});
        }

        return true;
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(childRoute, state);
    }

}
