import {IAuthenticationModuleConfig, ISsoUser} from "../types";
import {HttpRequest} from "@angular/common/http";

export class CirclecrmAuthenticationActHelper {

    public constructor(private config: IAuthenticationModuleConfig) {
    }

    public shouldActOn(reqUrl: string): boolean {
        const loginApiURL = [this.config.remoteBaseURL, this.config.apiLoginPath].join('/');

        if (reqUrl === loginApiURL || reqUrl.startsWith(this.config.remoteVAuthURL!)) {
            return true;
        }

        for (const re of this.config.actsOnUrl || []) {
            if (re.test(reqUrl)) {
                return true;
            }
        }

        return false;
    }

    public actOn(req: HttpRequest<any>, user: ISsoUser, rawToken: string): HttpRequest<any> {

        if (req.url.startsWith(this.config.remoteVAuthURL!)) {
            const vptToken = btoa(user.username + ':' + user.attributes!.token!);
            return req.clone({setHeaders: {Authorization: 'VPT-AUTH ' + vptToken}});
        }

        return req.clone({setHeaders: {Authorization: 'JWT-SSO-TOKEN ' + rawToken}});
    }
}
