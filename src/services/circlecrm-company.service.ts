import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ICcCompany} from '../types/circlecrm-auth-other.types';
import {CirclecrmAuthUtils} from '../utils/circlecrm-auth.utils';
import {HTTP_BACKGROUND_TASK_HEADER} from '@circlecrm/circlecrm-core';
import {Observable} from 'rxjs/Observable';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";

@Injectable()
export class CirclecrmCompanyService {

    public onLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
    private config: IAuthenticationModuleConfig;
    private company: ICcCompany;

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, private http: HttpClient) {
        this.config = configToken as IAuthenticationModuleConfig;
    }

    public getLoaded(): ICcCompany {
        return this.company;
    }

    public reload(background?: boolean): Promise<ICcCompany> {
        return this.doGet(background);
    }

    public getCompany(background?: boolean, refresh?: boolean): Promise<ICcCompany> | ICcCompany {

        if (this.company && !(refresh || false)) {
            return this.company;
        }

        return this.doGet(background);
    }

    protected doGet(background?: boolean): Promise<ICcCompany> {
        const url = CirclecrmAuthUtils.mergeUrlFragments(this.config.remoteVAuthURL!, 'company');
        const headers = new HttpHeaders().set(HTTP_BACKGROUND_TASK_HEADER, background ? 'true' : 'false');
        this.onLoading.next(true);
        return this.http.get<ICcCompany>(url, {headers})
            .map((res: ICcCompany) => {
                this.company = res;
                this.onLoading.next(false);
                return this.company;
            })
            .catch((error) => {
                this.onLoading.next(false);
                return Observable.throw(error);
            })
            .toPromise();
    }

}
