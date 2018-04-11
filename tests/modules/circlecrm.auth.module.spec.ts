import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CirclecrmAuthModule} from "../../src/circlecrm-auth.module";
import {AUTHMODULE_CONFIG} from "../../src/circlecrm-auth.types";
import {CirclecrmAuthenticationService} from "../../src/circlecrm-authentication.service";
import {CirclecrmAuthenticationGuard} from "../../src/circlecrm-authentication.guard";
import {CirclecrmAuthenticationHttpInterceptor} from "../../src/circlecrm-authentication.http.interceptor";
import {RouterTestingModule} from "@angular/router/testing";
import {HTTP_INTERCEPTORS, HttpInterceptor} from "@angular/common/http";

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

});
