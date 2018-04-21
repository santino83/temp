import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Injector} from '@angular/core';
import {CirclecrmAuthenticationService} from "../services/circlecrm-authentication.service";
import "rxjs/add/operator/catch";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class CirclecrmAuthenticationHttpInterceptor implements HttpInterceptor {

    private authService: CirclecrmAuthenticationService | null = null;
    private isRefreshingToken: boolean = false;
    private refreshStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
                            return this.handle401Error(req, next);
                    }
                }

                return Observable.throw(error);
            });
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.refreshStatusSubject.next(false);

            return this.getAuthService().refreshToken()
                .switchMap((result) => {
                    if (result) {
                        this.refreshStatusSubject.next(true);
                        return next.handle(this.getAuthService().ensureCredentialsInRequest(req));
                    }

                    return Observable.throw('Unknown error');
                })
                .catch((error) => {
                    this.getAuthService().authenticate();
                    return Observable.throw(error);
                })
                .finally(() => {
                    this.isRefreshingToken = false;
                });

        } else {
            return this.refreshStatusSubject
                .filter((status) => status === true)
                .take(1)
                .switchMap(() => {
                    return next.handle(this.getAuthService().ensureCredentialsInRequest(req));
                });
        }

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
