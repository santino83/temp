import {ElementRef, Injector, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IHateoasEntity, IServiceAction, ServiceActionType} from '../circlecrm-auth.types';
import {CirclecrmAuthAbstractService} from '../services/circlecrm-auth-abstract.service';

export abstract class CirclecrmAbstractFindDirective<T extends IHateoasEntity> implements OnChanges {

    @Input() public entityId: string;
    private isListening = false;

    protected constructor(protected el: ElementRef, protected injector: Injector) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.entityId) {
            return;
        }

        this.listen();
        this.getService().findAction(this.entityId, true);
    }

    protected listen(): void {
        if (this.isListening) {
            return;
        }

        this.isListening = true;
        this.getService().onAction.subscribe((action: IServiceAction<T>) => {
            if (action.type === ServiceActionType.FOUNDED &&
                action.extras!.status &&
                action.payload![0].id === this.entityId) {
                this.onAction(action);
            }
        });
    }

    protected abstract onAction(action: IServiceAction<T>): void;

    protected abstract getService(): CirclecrmAuthAbstractService<T>;

}
