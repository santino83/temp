import {Injectable} from '@angular/core';
import {CirclecrmAuthenticationService} from "./circlecrm-authentication.service";
import {ISsoApp} from "../types";

@Injectable()
export class CirclecrmAppsService {

    public constructor(private authService: CirclecrmAuthenticationService) {
    }

    public getApps(): ISsoApp[] {

        if (!this.authService.isAuthenticated()) {
            return [];
        }

        const result: ISsoApp[] = [];

        this.authService.user!.attributes!.service!.forEach((service) => {
            switch (service.tag) {
                case 'CIRCLE-PBX':
                    result.push({
                        name: 'Pbx',
                        order: 30,
                        url: service.uri!
                    });
                    break;
                case 'CIRCLE-UPORTAL':
                    result.push({
                        name: 'Web App',
                        order: 20,
                        url: service.uri!
                    });
                    break;
                case 'CIRCLE-ADMIN':
                    result.push({
                        name: 'Admin',
                        order: 10,
                        url: service.uri!
                    });
                    break;
            }
        });

        return result.sort((a: ISsoApp, b: ISsoApp) => {
            return a.order > b.order ? 1 : (a.order < b.order ? -1 : 0);
        });
    }

}
