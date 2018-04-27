import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ICcUnit, IServiceAction, ServiceActionType} from '../circlecrm-auth.types';
import {CirclecrmUnitService} from '../services/circlecrm-unit.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'cmp-circlecrm-units-widget',
    template: `
        <div class="panel widget {{ bgCssColor }}">
            <div class="panel-heading text-center">
                {{ 'YOUR_UNITS' | translate }}
            </div>
            <div class="panel-body text-center">
                <div *ngIf="loading || units === null;else loaded">
                    <div class="ball-clip-rotate">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <ng-template #loaded>
            <div class="clearfix mb-sm">
                <div class="pull-left">
                    <a (click)="add()"
                       title="{{ 'ADD' | translate }}"
                       class="pull-left btn btn-success btn-xs">
                        <em class="fa fa-plus"></em>
                    </a>
                </div>
                <div class="pull-right">
                    <a (click)="switchView()"
                       title="{{ (isSummaryView() ? 'LIST_VIEW' : 'SUMMARY_VIEW') | translate }}"
                       class="pull-right text-muted">
                        <em class="fa"
                            [ngClass]="{'icon-list':isSummaryView(),'icon-eye':!isSummaryView()}"></em>
                    </a></div>
            </div>
            <ng-container *ngIf="isSummaryView(); then summaryview; else listview"></ng-container>
            <div class="clearfix">
                <div class="pull-left"></div>
                <div class="pull-right">
                    <a (click)="refresh()"
                       (mouseover)="refreshBtnOver=true"
                       (mouseout)="refreshBtnOver=false"
                       class="pull-right text-muted"
                       title="{{ 'refresh' | translate }}">
                        <em class="fa icon-refresh"
                            [class.text-gray-dark]="refreshBtnOver"
                            [class.text-gray]="!refreshBtnOver"></em>
                    </a>
                </div>
            </div>
        </ng-template>

        <ng-template #summaryview>
            <div (click)="switchView()"
                 class="radial-box {{ radialCssColor }} hg-xs wd-xs bg-gray-lighter m0">
                <span>{{ units.length }}</span>
            </div>
        </ng-template>

        <ng-template #listview>
            <div class="table-responsive">
                <table class="table table-hover">
                    <tbody>
                    <tr *ngFor="let entity of units">
                        <td class="text-left">{{ entity.name }}</td>
                        <td class="text-center">
              <span *ngIf="getParentUnitIdFromEntity(entity)"
                    dirCircleCRMResolveUnit [entityId]="getParentUnitIdFromEntity(entity)"
                    class="label label-info btn-sm"></span>
                        </td>
                        <td class="text-right">
                            <div class="showhide-box">
                                <div class="showhide-content btn-group btn-group-xs">
                                    <button (click)="view(entity)"
                                            class="btn btn-xs btn-success"
                                            title="{{ 'VIEW' | translate}}">
                                        <em class="fa fa-eye"></em>
                                    </button>
                                    <button (click)="edit(entity)"
                                            class="btn btn-xs btn-info"
                                            title="{{ 'EDIT' | translate}}">
                                        <em class="fa fa-pencil"></em>
                                    </button>
                                    <button *ngIf="units.length > 1"
                                            (click)="delete(entity)"
                                            class="btn btn-xs btn-danger"
                                            title="{{ 'DELETE' | translate}}">
                                        <em class="fa fa-trash"></em>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr *ngIf="units.length <= 0">
                        <td colspan="3" class="text-left">{{ 'NO_ENTRY_FOUND' | translate }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </ng-template>
    `
})
export class CirclecrmUnitsWidget implements OnInit {

    public units: ICcUnit[] = [];
    public loading = false;
    @Input() public bgCssColor = 'bg-white';
    @Input() public radialCssColor = 'br-info';
    public refreshBtnOver = false;

    private summaryView = true;

    public constructor(private unitService: CirclecrmUnitService) {
    }

    public ngOnInit(): void {

        this.unitService.onAction.subscribe((action: IServiceAction<ICcUnit>) => {
            switch (action.type) {
                case ServiceActionType.LIST:
                case ServiceActionType.RELOAD:
                    this.loading = true;
                    break;
                case ServiceActionType.LOADED:
                    this.loading = false;
                    this.units = action.payload || [];
                    break;
            }
            this.refreshBtnOver = false;
        });

        this.refresh();
    }

    public refresh(): void {
        this.unitService.reloadAction(true);
    }

    public isSummaryView(): boolean {
        return this.summaryView;
    }

    public switchView(): void {
        this.summaryView = !this.summaryView;
    }

    public delete(unit: ICcUnit): void {
        this.unitService.deleteAction(unit, true);
    }

    public edit(unit: ICcUnit): void {
        this.unitService.editAction(unit);
    }

    public view(unit: ICcUnit): void {
        this.unitService.viewAction(unit);
    }

    public add(): void {
        this.unitService.addAction();
    }

    public getParentUnitIdFromEntity(unit: ICcUnit): string | null {
        return this.unitService.getParentUnitIdFromEntity(unit);
    }

}
