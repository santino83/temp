import {Inject, Injectable} from '@angular/core';
import {ICcRole} from '../types/circlecrm-auth-extra.types';
import {HttpClient} from '@angular/common/http';
import {CirclecrmAuthAbstractService} from './circlecrm-auth-abstract.service';
import {AlertService} from '@circlecrm/circlecrm-core';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";

@Injectable()
export class CirclecrmRoleService extends CirclecrmAuthAbstractService<ICcRole> {

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, http: HttpClient, alertService: AlertService) {
        super(configToken as IAuthenticationModuleConfig, 'roles', http, alertService);
    }

    public create(entity: ICcRole, background?: boolean): boolean | Promise<boolean> {
        const body = {name: entity.name, ref: entity.ref};
        return this.doCreate(this.getUrl(this.remoteEndpoint), body, this.getHeaders(background));
    }

    public update(entity: ICcRole, background?: boolean): boolean | Promise<boolean> {
        const body = {name: entity.name, ref: entity.ref};
        return this.doUpdate(this.getUrl(this.remoteEndpoint, entity.id || ''), body, this.getHeaders(background));
    }

    protected preDelete(entity: ICcRole): boolean {
        if (entity.system) {
            this.alertService.notify({title: 'Error!', message: 'Cannot delete a system role!', type: 'error'});
            return false;
        }

        return true;
    }
}
