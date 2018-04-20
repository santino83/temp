import {Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";
import {CirclecrmAuthenticationService} from "../services/circlecrm-authentication.service";
import {CirclecrmAuthenticationGuard} from "../guards/circlecrm-authentication.guard";
import {CirclecrmAuthenticationHttpInterceptor} from "../http/circlecrm-authentication.http.interceptor";
import {Ng2Webstorage} from "ngx-webstorage";
import {CIRCLECRM_MENU_FILTER} from "@circlecrm/circlecrm-core";
import {CirclecrmRoleMenuFilter} from "../filters/circlecrm-role-menu.filter";
import {CirclecrmAuthenticationRoleGuard} from "../guards/circlecrm-authentication-role.guard";
import {CirclecrmAuthCommonModule} from "./circlecrm-auth.common.module";
import {
    CirclecrmCompanyService,
    CirclecrmGroupService,
    CirclecrmInvitationService,
    CirclecrmRoleService,
    CirclecrmUnitService,
    CirclecrmUserService
} from "../services/index";

export const defaultConfig = {
    apiLoginPath: 'api/authenticates',
    loginPath: 'sso/vauth/fwd',
    logoutURL: 'https://webapp.circlecrm.it/app/logout',
    redirectURL: 'https://webapp.circlecrm.it/u',
    remoteBaseURL: 'https://webapp.circlecrm.it',
    remoteVAuthURL: 'https://auth.circlecrm.it/api/v1'
};

@NgModule({
    imports: [
        HttpClientModule,
        Ng2Webstorage,
        CirclecrmAuthCommonModule
    ]
})
export class CirclecrmAuthModule {

    public static forRoot(config: IAuthenticationModuleConfig): ModuleWithProviders {
        return {
            ngModule: CirclecrmAuthModule,
            providers: [
                {
                    provide: AUTHMODULE_CONFIG,
                    useValue: Object.assign(defaultConfig, config)
                },
                // services
                CirclecrmAuthenticationService,
                CirclecrmCompanyService,
                CirclecrmGroupService,
                CirclecrmInvitationService,
                CirclecrmRoleService,
                CirclecrmUnitService,
                CirclecrmUserService,
                // guards
                CirclecrmAuthenticationGuard,
                CirclecrmAuthenticationRoleGuard,
                {
                    deps: [
                        Injector
                    ],
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useFactory: providerCirclecrmAuthenticationHttpInterceptor
                },
                {
                    deps: [
                        Injector
                    ],
                    multi: true,
                    provide: CIRCLECRM_MENU_FILTER,
                    useFactory: providerCirclecrmMenuFilter
                }
            ]
        };
    }

}

export function providerCirclecrmAuthenticationHttpInterceptor(injector: Injector):
    CirclecrmAuthenticationHttpInterceptor {
    return new CirclecrmAuthenticationHttpInterceptor(injector);
}

export function providerCirclecrmMenuFilter(injector: Injector): CirclecrmRoleMenuFilter {
    return new CirclecrmRoleMenuFilter(injector);
}