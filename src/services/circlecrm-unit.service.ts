import {Inject, Injectable} from '@angular/core';
import {ICcUnit} from '../types/circlecrm-auth-extra.types';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CirclecrmAuthAbstractService} from './circlecrm-auth-abstract.service';
import {AlertService} from '@circlecrm/circlecrm-core';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";
import {get_parent_unit_id} from "../functions/index";

@Injectable()
export class CirclecrmUnitService extends CirclecrmAuthAbstractService<ICcUnit> {

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, http: HttpClient, alertService: AlertService) {
        super(configToken as IAuthenticationModuleConfig, 'units', http, alertService);
    }

    public create(entity: ICcUnit, background?: boolean): boolean | Promise<boolean> {

        const unitId = this.getParentUnitIdFromEntity(entity);
        const body = {
            email: entity.email,
            fax: entity.fax,
            name: entity.name,
            phone: entity.phone,
            ref: entity.ref,
            website: entity.website
        };

        return this.doCreate(this.getUrl(this.remoteEndpoint), body, this.buildHeaders(unitId, background));
    }

    public update(entity: ICcUnit, background?: boolean): boolean | Promise<boolean> {

        const unitId = this.getParentUnitIdFromEntity(entity);

        if (unitId === entity.id) {
            return false;
        }

        const body = {
            email: entity.email,
            fax: entity.fax,
            name: entity.name,
            phone: entity.phone,
            ref: entity.ref,
            website: entity.website
        };

        return this.doUpdate(
            this.getUrl(this.remoteEndpoint, entity.id || ''),
            body,
            this.buildHeaders(unitId, background)
        );
    }

    /**
     * @deprecated use get_parent_unit_id instead
     * @param {ICcUnit} unit
     * @returns {string | null}
     */
    public getParentUnitIdFromEntity(unit: ICcUnit): string | null {
        return get_parent_unit_id(unit);
    }

    private buildHeaders(unitId: string | null, background?: boolean): HttpHeaders {
        const headers = this.getHeaders(background);
        if (unitId !== null && unitId !== '') {
            return headers.set('Link', this.getUrl('units', unitId));
        }
        return headers;
    }

}
