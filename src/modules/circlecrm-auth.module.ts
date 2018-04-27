import {InjectionToken, Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Ng2Webstorage} from "ngx-webstorage";
import {CIRCLECRM_MENU_FILTER} from "@circlecrm/circlecrm-core";
import {AUTHMODULE_CONFIG, CIRCLECRM_URI_NS, IAuthenticationModuleConfig} from '../circlecrm-auth.types';
import {CirclecrmAuthenticationGuard, CirclecrmAuthenticationRoleGuard} from "../guards/index";
import {CirclecrmAuthenticationHttpInterceptor} from "../http/circlecrm-authentication.http.interceptor";
import {CirclecrmRoleMenuFilter} from "../filters/circlecrm-role-menu.filter";
import {CirclecrmAuthCommonModule} from "./circlecrm-auth.common.module";
import {
    CirclecrmAppsService,
    CirclecrmAuthenticationService,
    CirclecrmCompanyService,
    CirclecrmGroupService,
    CirclecrmInvitationService,
    CirclecrmRoleService,
    CirclecrmUnitService,
    CirclecrmUserService
} from "../services/index";

export const OVERRIDE_AUTHMODULE_CONFIG = new InjectionToken<IAuthenticationModuleConfig>('OVERRIDE_AUTHMODULE_CONFIG');

@NgModule({
    exports: [
        CirclecrmAuthCommonModule
    ],
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
                    provide: OVERRIDE_AUTHMODULE_CONFIG,
                    useValue: config
                },
                {
                    deps: [
                        OVERRIDE_AUTHMODULE_CONFIG
                    ],
                    provide: AUTHMODULE_CONFIG,
                    useFactory: providerCirclecrmAuthModuleConfig
                },
                // services
                CirclecrmAuthenticationService,
                CirclecrmCompanyService,
                CirclecrmGroupService,
                CirclecrmInvitationService,
                CirclecrmRoleService,
                CirclecrmUnitService,
                CirclecrmUserService,
                CirclecrmAppsService,
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

export function providerCirclecrmAuthModuleConfig(config: any): IAuthenticationModuleConfig {
    const result = Object.assign({
        actsOnUrl: [],
        apiLoginPath: 'api/authenticates',
        loginPath: 'sso/vauth/fwd',
        logoutURL: 'https://webapp.circlecrm.it/app/logout',
        redirectURL: 'https://webapp.circlecrm.it/u',
        remoteBaseURL: 'https://webapp.circlecrm.it',
        remoteVAuthURL: 'https://auth.circlecrm.it/api/v1'
    }, config) as IAuthenticationModuleConfig;

    result.actsOnUrl!.push(CIRCLECRM_URI_NS);
    return result;
}
