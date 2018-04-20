import {Directive, ElementRef, Injector} from '@angular/core';
import {ICcRole, IServiceAction} from '../types/circlecrm-auth-other.types';
import {CirclecrmAbstractFindDirective} from './circlecrm-abstract-find.directive';
import {CirclecrmAbstractService} from '../services/circlecrm-abstract.service';
import {CirclecrmRoleService} from '../services/circlecrm-role.service';

@Directive({
  selector: '[dirCircleCRMResolveRole]'
})
export class CirclecrmFindRoleDirective extends CirclecrmAbstractFindDirective<ICcRole> {

  public constructor(el: ElementRef, injector: Injector) {
    super(el, injector);
  }

  protected onAction(action: IServiceAction<ICcRole>): void {
    this.el.nativeElement.innerHTML = action.payload![0].name;
  }

  protected getService(): CirclecrmAbstractService<ICcRole> {
    return this.injector.get(CirclecrmRoleService);
  }

}
