import {Injectable, Injector} from '@angular/core';
import {IFilter, IMenuItem} from '@circlecrm/circlecrm-core';
import {CirclecrmAuthenticationService} from "./circlecrm-authentication.service";

@Injectable()
export class CirclecrmRoleMenuFilter implements IFilter<IMenuItem> {

  private static readonly REGEXP = /hasRole\(([A-Za-z0-9_\- ]+)\)/;

  private authService: CirclecrmAuthenticationService;
  private re: RegExp;

  public constructor(private injector: Injector) {
    this.re = new RegExp(CirclecrmRoleMenuFilter.REGEXP, 'ig');
  }

  public filter(item: IMenuItem): boolean {
    if (!item.enabledBy || item.enabledBy.length <= 0) {
      return true;
    }

    const enabledBy = item.enabledBy.join(',');
    const requiredRoles: string[] = [];

    let matched;
    while ((matched = this.re.exec(enabledBy)) !== null) {
      requiredRoles.push(matched[1]);
    }

    // if no roles are required, return true
    if (!requiredRoles || requiredRoles.length <= 0) {
      return true;
    }

    return this.getAuthService().check(requiredRoles);
  }

  private getAuthService(): CirclecrmAuthenticationService {
    if (!this.authService) {
      this.authService = this.injector.get(CirclecrmAuthenticationService);
    }

    return this.authService;
  }

}
