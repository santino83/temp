import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {LocalStorageService} from 'ngx-webstorage';
import {
    AUTHMODULE_CONFIG,
    IAuthenticationModuleConfig,
    IDecodedToken,
    ISsoToken,
    ISsoUser
} from './circlecrm-auth.types';
import 'rxjs/add/operator/map';

// jwt-decode doesn't support "import" statement
const jwt_decode = require('jwt-decode');

@Injectable()
export class CirclecrmAuthenticationService {

    public static readonly TOKEN_KEY = 'sso_token';
    public static readonly TOKEN_URI_PARAM = 'jwtToken';

    private ssoToken: ISsoToken | null = null;
    private config: IAuthenticationModuleConfig;

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any,
                       private http: HttpClient,
                       private localStorage: LocalStorageService) {

        this.config = configToken as IAuthenticationModuleConfig;
        this.load();
    }

    /**
     * Returns the authenticated user if any
     * @returns {ISsoUser | null}
     */
    public get user(): ISsoUser | null {
        return this.token ? this.token.user : null;
    }

    /**
     * Returns the authenticated token if any
     * @returns {ISsoToken | null}
     */
    public get token(): ISsoToken | null {
        return this.ssoToken;
    }

    /**
     * returns the raw authenticated token
     * @returns {string | null}
     */
    public get rawToken(): string | null {
        return this.localStorage.retrieve(CirclecrmAuthenticationService.TOKEN_KEY);
    }

    /**
     * Checks if user is authenticated with a valid token
     * @returns {boolean}
     */
    public isAuthenticated(): boolean {
        return this.token !== null && this.valid(this.token);
    }

    /**
     * Performs a login with the api system
     *
     * @param {string} username
     * @param {string} secret
     * @returns {Promise<ISsoUser>}
     */
    public login(username: string, secret: string): Promise<ISsoUser> {

        this.clearToken();
        const hash = btoa(username + ':' + secret);
        const headers = new HttpHeaders({Authorization: 'JWT-SSO-LOGIN ' + hash});

        return this.http.post<ISsoUser>(
            this.config.remoteBaseURL + '/' + this.config.apiLoginPath,
            null,
            {headers, observe: 'response'})
            .map((res: HttpResponse<ISsoUser>) => {
                if (!res.headers.has('X-JWT-SSO-TOKEN')) {
                    throw new Error('Invalid credentials');
                }

                const tokenDigest: string | null = res.headers.get('X-JWT-SSO-TOKEN');

                this.updateToken(tokenDigest || '');

                if (!this.isAuthenticated() || this.user === null) {
                    this.clearToken();
                    throw new Error('Invalid credentials');
                }

                return this.user;
            }).toPromise<ISsoUser>();
    }

    /**
     * Authenticates digest token or redirect to login page
     *
     * @param {string} jwtTokenDigest
     * @returns {ISsoUser | false}
     */
    public authenticate(jwtTokenDigest?: string): ISsoUser | false {

        if (jwtTokenDigest) {
            this.updateToken(jwtTokenDigest);
        }

        if (this.isAuthenticated() && this.user) {
            return this.user;
        }

        const loginUrl = this.config.remoteBaseURL + '/' + this.config.loginPath;
        const url = loginUrl + (loginUrl.indexOf('?') > -1 ? '&' : '?')
            + 'proxyTarget=' + encodeURI(this.config.redirectURL);

        window.location.href = url;

        return false;
    }

    /**
     * Performs a logout and redirect to remote logout url for sso-logout
     */
    public logout(): void {
        this.clearToken();
        window.location.href = this.config.logoutURL || '';
    }

    /**
     * Adds authentication token in request. Skips API_LOGIN request
     * @param {HttpRequest<any>} req
     * @returns {HttpRequest<any>}
     */
    public ensureCredentialsInRequest(req: HttpRequest<any>): HttpRequest<any> {

        const loginApiURL = [this.config.remoteBaseURL, this.config.apiLoginPath].join('/');

        if (req.url === loginApiURL || !this.isAuthenticated()) {
            return req;
        }

        return req.clone({setHeaders: {Authorization: 'JWT-SSO-TOKEN ' + this.rawToken}});
    }

    /**
     * Checks if logged user has one of the input roles
     *
     * @param {string[]} roles
     * @returns {boolean}
     */
    public check(roles: string[]): boolean {

        if (!this.isAuthenticated() || !this.user) {
            return false;
        }

        return (this.user.role || [])
            .filter((role) => roles.includes((role.ref || role.name) + ''))
            .length > 0;
    }

    /**
     * Checks if logged user has all input roles
     *
     * @param {string[]} roles
     * @returns {boolean}
     */
    public checkAll(roles: string[]): boolean {

        if (!this.isAuthenticated() || !this.user) {
            return false;
        }

        return (this.user.role || [])
            .filter((role) => roles.includes((role.ref || role.name) + ''))
            .length === roles.length;
    }

    /**
     * Removes stored token from persist storage and clear
     * current authenticated state
     */
    private clearToken(): void {
        this.ssoToken = null;
        this.localStorage.clear(CirclecrmAuthenticationService.TOKEN_KEY);
    }

    private valid(token: ISsoToken): boolean {
        const now = new Date();
        return token.expiresAt * 1000 >= now.getTime();
    }

    private updateToken(jwtTokenDigest: string) {
        this.clearToken();
        const ssoToken = this.decode(jwtTokenDigest);
        this.store(jwtTokenDigest);
        this.ssoToken = ssoToken;
    }

    private decode(jwtTokenDigest: string): ISsoToken | null {
        try {
            const rawToken: IDecodedToken = jwt_decode(jwtTokenDigest) as IDecodedToken;

            return {
                createdAt: rawToken.iat,
                expiresAt: rawToken.exp,
                notBefore: rawToken.nbf,
                user: JSON.parse(rawToken.data, (key, value) => {
                    return (key === 'created' || key === 'updated') ? new Date(value) : value;
                })
            } as ISsoToken;
        } catch (e) {
            return null;
        }
    }

    private store(token: string): void {
        this.localStorage.store(CirclecrmAuthenticationService.TOKEN_KEY, token);
    }

    private load(): void {
        this.ssoToken = this.decode(this.localStorage.retrieve(CirclecrmAuthenticationService.TOKEN_KEY));
    }

}
