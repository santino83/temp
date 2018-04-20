import {Inject, Injectable} from '@angular/core';
import {ICcUser} from '../types/circlecrm-auth-other.types';
import {HttpClient} from '@angular/common/http';
import {CirclecrmAbstractService} from './circlecrm-abstract.service';
import {AlertService} from '@circlecrm/circlecrm-core';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";

@Injectable()
export class CirclecrmUserService extends CirclecrmAbstractService<ICcUser> {

  public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, http: HttpClient, alertService: AlertService) {
    super(configToken as IAuthenticationModuleConfig, 'users', http, alertService);
  }

}
