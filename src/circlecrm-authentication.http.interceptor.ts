import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Injector} from '@angular/core';
import {CirclecrmAuthenticationService} from "./circlecrm-authentication.service";
import "rxjs/add/operator/catch";

export class CirclecrmAuthenticationHttpInterceptor implements HttpInterceptor {

    private authService: CirclecrmAuthenticationService | null = null;

    public constructor(private injector: Injector) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(this.getAuthService().ensureCredentialsInRequest(req))
            .catch((error) => {
                if (error instanceof HttpErrorResponse) {
                    switch ((error as HttpErrorResponse).status) {
                        case 400:
                            this.handle400Error(error);
                            break;
                        case 401:
                            this.getAuthService().authenticate();
                            break;
                    }
                }

                return Observable.throw(error);
            });
    }

    private handle400Error(error: HttpErrorResponse): any {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            this.getAuthService().authenticate();
        }
    }

    private getAuthService(): CirclecrmAuthenticationService {
        if (!this.authService) {
            this.authService = this.injector.get(CirclecrmAuthenticationService);
        }

        if (this.authService === null) {
            throw new Error('Unable to load the authentication service');
        }

        return this.authService;
    }

}
