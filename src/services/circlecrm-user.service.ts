import {Inject, Injectable} from '@angular/core';
import {ICcUser} from '../types/circlecrm-auth-extra.types';
import {HttpClient} from '@angular/common/http';
import {CirclecrmAuthAbstractService} from './circlecrm-auth-abstract.service';
import {AlertService} from '@circlecrm/circlecrm-core';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";
import {get_groups_id, get_roles_id, get_unit_id} from "../functions/index";

@Injectable()
export class CirclecrmUserService extends CirclecrmAuthAbstractService<ICcUser> {

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, http: HttpClient, alertService: AlertService) {
        super(configToken as IAuthenticationModuleConfig, 'users', http, alertService);
    }

    /**
     * @deprecated use get_unit_id instead
     * @param {ICcUser} user
     * @returns {string | null}
     */
    public getUnitIdFromEntity(user: ICcUser): string | null {
        return get_unit_id(user);
    }

    /**
     * @deprecated use get_groups_id instead
     * @param {ICcUser} user
     * @returns {string[]}
     */
    public getGroupIdsFromEntity(user: ICcUser): string[] {
        return get_groups_id(user);
    }

    /**
     * @deprecated use get_roles_id instead
     * @param {ICcUser} user
     * @returns {string[]}
     */
    public getRoleIdsFromEntity(user: ICcUser): string[] {
        return get_roles_id(user);
    }

}
