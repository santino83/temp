import {Inject, Injectable} from '@angular/core';
import {ICcUser, IHateoasLink} from '../types/circlecrm-auth-extra.types';
import {HttpClient} from '@angular/common/http';
import {CirclecrmAuthAbstractService} from './circlecrm-auth-abstract.service';
import {AlertService} from '@circlecrm/circlecrm-core';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";

@Injectable()
export class CirclecrmUserService extends CirclecrmAuthAbstractService<ICcUser> {

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, http: HttpClient, alertService: AlertService) {
        super(configToken as IAuthenticationModuleConfig, 'users', http, alertService);
    }

    public getUnitIdFromEntity(user: ICcUser): string | null {
        if (user._links && ('unit' in user._links)) {
            return (user._links.unit as IHateoasLink).ref_id || '';
        }

        return null;
    }

    public getGroupIdsFromEntity(user: ICcUser): string[] {
        if (user._links && ('group' in user._links)) {
            return (user._links.group as IHateoasLink[]).map((link) => link.ref_id!);
        }

        return [];
    }

    public getRoleIdsFromEntity(user: ICcUser): string[] {
        if (user._links && ('role' in user._links)) {
            return (user._links.role as IHateoasLink[]).map((link) => link.ref_id!);
        }

        return [];
    }

}
