import {Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "./circlecrm-auth.types";
import {CirclecrmAuthenticationService} from "./circlecrm-authentication.service";
import {CirclecrmAuthenticationGuard} from "./circlecrm-authentication.guard";
import {CirclecrmAuthenticationHttpInterceptor} from "./circlecrm-authentication.http.interceptor";
import {Ng2Webstorage} from "ngx-webstorage";

export const defaultConfig = {
    apiLoginPath: 'api/authenticates',
    loginPath: 'sso/vauth/fwd',
    logoutURL: 'https://webapp.circlecrm.it/app/logout',
    redirectURL: 'https://webapp.circlecrm.it/u',
    remoteBaseURL: 'https://webapp.circlecrm.it'
};

@NgModule({
    imports: [
        HttpClientModule,
        Ng2Webstorage
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
                CirclecrmAuthenticationService,
                CirclecrmAuthenticationGuard,
                {
                    deps: [
                        Injector
                    ],
                    multi: true,
                    provide: HTTP_INTERCEPTORS,
                    useFactory: providerCirclecrmAuthenticationHttpInterceptor
                }
            ]
        };
    }

}

export function providerCirclecrmAuthenticationHttpInterceptor(injector: Injector):
    CirclecrmAuthenticationHttpInterceptor {
    return new CirclecrmAuthenticationHttpInterceptor(injector);
}
