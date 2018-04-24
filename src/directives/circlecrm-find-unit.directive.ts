import {Directive, ElementRef, Injector} from '@angular/core';
import {ICcUnit, IServiceAction} from '../types/circlecrm-auth-extra.types';
import {CirclecrmAbstractFindDirective} from './circlecrm-abstract-find.directive';
import {CirclecrmAuthAbstractService} from '../services/circlecrm-auth-abstract.service';
import {CirclecrmUnitService} from '../services/circlecrm-unit.service';

@Directive({
  selector: '[dirCircleCRMResolveUnit]'
})
export class CirclecrmFindUnitDirective extends CirclecrmAbstractFindDirective<ICcUnit> {

  public constructor(el: ElementRef, injector: Injector) {
    super(el, injector);
  }

  protected onAction(action: IServiceAction<ICcUnit>): void {
    this.el.nativeElement.innerHTML = action.payload![0].name;
  }

  protected getService(): CirclecrmAuthAbstractService<ICcUnit> {
    return this.injector.get(CirclecrmUnitService);
  }

}
