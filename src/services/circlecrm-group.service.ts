import {Inject, Injectable} from '@angular/core';
import {ICcGroup, IHateoasLink} from '../types/circlecrm-auth-extra.types';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CirclecrmAuthAbstractService} from './circlecrm-auth-abstract.service';
import {AlertService} from '@circlecrm/circlecrm-core';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";

@Injectable()
export class CirclecrmGroupService extends CirclecrmAuthAbstractService<ICcGroup> {

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, http: HttpClient, alertService: AlertService) {
        super(configToken as IAuthenticationModuleConfig, 'groups', http, alertService);
    }

    public create(entity: ICcGroup, background?: boolean): boolean | Promise<boolean> {
        const unitId = this.getUnitIdFromEntity(entity);

        if (unitId === null) {
            return false;
        }

        const body = {name: entity.name, ref: entity.ref};

        return this.doCreate(this.getUrl(this.remoteEndpoint), body, this.buildHeaders(unitId, background));
    }

    public update(entity: ICcGroup, background?: boolean): boolean | Promise<boolean> {

        const unitId = this.getUnitIdFromEntity(entity);

        if (unitId === null) {
            return false;
        }

        const body = {name: entity.name, ref: entity.ref};
        return this.doUpdate(
            this.getUrl(this.remoteEndpoint, entity.id || ''),
            body,
            this.buildHeaders(unitId, background)
        );
    }

    public getUnitIdFromEntity(group: ICcGroup): string | null {
        if (group._links && ('unit' in group._links)) {
            return (group._links.unit as IHateoasLink).ref_id || '';
        }

        return null;
    }

    private buildHeaders(unitId: string, background?: boolean): HttpHeaders {
        return this.getHeaders(background)
            .set('Link', this.getUrl('units', unitId));
    }

}
