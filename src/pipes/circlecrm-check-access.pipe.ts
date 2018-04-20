import {Injector, Pipe, PipeTransform} from '@angular/core';
import {CirclecrmAuthenticationService} from "../services/circlecrm-authentication.service";

@Pipe({
    name: 'PipeCcCheckAccess'
})
export class CirclecrmCheckAccessPipe implements PipeTransform {

    private authService: CirclecrmAuthenticationService;

    public constructor(private injector: Injector) {
    }

    public transform(input: any, requiredRoles: string[]): any {
        if (this.getAuthService().check(requiredRoles)) {
            return input;
        }

        return null;
    }

    private getAuthService(): CirclecrmAuthenticationService {
        if (!this.authService) {
            this.authService = this.injector.get(CirclecrmAuthenticationService);
        }

        return this.authService;
    }

}
