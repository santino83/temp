import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {CirclecrmAuthenticationService} from "./circlecrm-authentication.service";

@Injectable()
export class CirclecrmAuthenticationRoleGuard implements CanActivate, CanActivateChild {

    public static readonly ROLES_DATA = 'roles';
    public static readonly UNAUTHORIZED_REDIRECT_DATA = 'onUnauthorized';

    public constructor(private authService: CirclecrmAuthenticationService,
                       private router: Router) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean> | Promise<boolean> | boolean {

        if (!route.data[CirclecrmAuthenticationRoleGuard.ROLES_DATA]) {
            return true;
        }

        if (!this.authService.isAuthenticated()) {
            // user is not authenticated, return true
            // and let CirclecrmAuthenticationGuard to authenticate
            // the user
            return true;
        }

        const roles: string[] = route.data[CirclecrmAuthenticationRoleGuard.ROLES_DATA] as string[];
        const redirect: string | null = route.data[CirclecrmAuthenticationRoleGuard.UNAUTHORIZED_REDIRECT_DATA] || null;

        // checks user roles
        if (this.authService.check(roles)) {
            return true;
        }

        if (redirect !== null) {
            this.router.navigateByUrl(redirect);
        } else {
            this.authService.logout();
        }

        return false;
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(childRoute, state);
    }

}
