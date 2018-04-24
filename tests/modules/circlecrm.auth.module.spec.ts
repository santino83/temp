import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CirclecrmAuthModule} from "../../src/modules/circlecrm-auth.module";
import {AUTHMODULE_CONFIG} from "../../src/types/circlecrm-auth.types";
import {CirclecrmAuthenticationService} from "../../src/services/circlecrm-authentication.service";
import {CirclecrmAuthenticationGuard} from "../../src/guards/circlecrm-authentication.guard";
import {CirclecrmAuthenticationHttpInterceptor} from "../../src/http/circlecrm-authentication.http.interceptor";
import {RouterTestingModule} from "@angular/router/testing";
import {HTTP_INTERCEPTORS, HttpInterceptor} from "@angular/common/http";
import {CirclecrmAuthenticationRoleGuard} from "../../src/guards/circlecrm-authentication-role.guard";
import {CirclecrmContactsCommonModule} from "../../src/modules";

describe('CirclecrmAuthModule', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                CirclecrmAuthModule.forRoot({
                    redirectURL: 'http://localhost:4200',
                    remoteBaseURL: 'https://foo.ext'
                })
            ]
        });
    });

    it('provides AUTHMODULE_CONFIG', () => {
        expect(TestBed.get(AUTHMODULE_CONFIG)).toBeDefined();
    });

    it('provides CirclecrmAuthenticationService', () => {
        expect(TestBed.get(CirclecrmAuthenticationService)).toBeDefined();
    });

    it('provides CirclecrmAuthenticationGuard', () => {
        expect(TestBed.get(CirclecrmAuthenticationGuard)).toBeDefined();
    });

    it('provides CirclecrmAuthenticationHttpInterceptor', () => {
        expect(TestBed.get(HTTP_INTERCEPTORS)).toBeDefined();
        const interceptor = (TestBed.get(HTTP_INTERCEPTORS) as HttpInterceptor[])
            .filter((hi) => hi instanceof CirclecrmAuthenticationHttpInterceptor);

        expect(interceptor).not.toBeNull();
    });

    it('provides CirclecrmAuthenticationRoleGuard', () => {
        expect(TestBed.get(CirclecrmAuthenticationRoleGuard)).toBeDefined();
    });

});
