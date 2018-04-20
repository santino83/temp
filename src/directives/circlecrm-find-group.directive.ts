import {Directive, ElementRef, Injector} from '@angular/core';
import {ICcGroup, IServiceAction} from '../types/circlecrm-auth-other.types';
import {CirclecrmAbstractFindDirective} from './circlecrm-abstract-find.directive';
import {CirclecrmAbstractService} from '../services/circlecrm-abstract.service';
import {CirclecrmGroupService} from '../services/circlecrm-group.service';

@Directive({
  selector: '[dirCircleCRMResolveGroup]'
})
export class CirclecrmFindGroupDirective extends CirclecrmAbstractFindDirective<ICcGroup> {

  public constructor(el: ElementRef, injector: Injector) {
    super(el, injector);
  }

  protected onAction(action: IServiceAction<ICcGroup>): void {
    this.el.nativeElement.innerHTML = action.payload![0].name;
  }

  protected getService(): CirclecrmAbstractService<ICcGroup> {
    return this.injector.get(CirclecrmGroupService);
  }

}
