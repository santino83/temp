import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ICcGroup, IServiceAction, ServiceActionType} from '../types/circlecrm-auth-extra.types';
import {CirclecrmGroupService} from '../services/circlecrm-group.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'cmp-circlecrm-groups-widget',
    template: `
        <div class="panel widget {{ bgCssColor }}">
            <div class="panel-heading text-center">
                {{ 'YOUR_GROUPS' | translate }}
            </div>
            <div class="panel-body text-center">
                <div *ngIf="loading || groups === null;else loaded">
                    <div class="ball-clip-rotate">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <ng-template #loaded>
            <div class="clearfix">
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
                <span>{{ groups.length }}</span>
            </div>
        </ng-template>

        <ng-template #listview>
            <div class="table-responsive">
                <table class="table table-hover">
                    <tbody>
                    <tr *ngFor="let entity of groups">
                        <td class="text-left">{{ entity.name }}</td>
                        <td class="text-center">
              <span *ngIf="getUnitIdFromEntity(entity)"
                    dirCircleCRMResolveUnit [entityId]="getUnitIdFromEntity(entity)"
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
                                    <button (click)="delete(entity)"
                                            class="btn btn-xs btn-danger"
                                            title="{{ 'DELETE' | translate}}">
                                        <em class="fa fa-trash"></em>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr *ngIf="groups.length <= 0">
                        <td colspan="3" class="text-left">{{ 'NO_ENTRY_FOUND' | translate }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </ng-template>
    `
})
export class CirclecrmGroupsWidget implements OnInit {

    public groups: ICcGroup[];
    public loading = false;
    @Input() public bgCssColor = 'bg-white';
    @Input() public radialCssColor = 'br-info';
    public refreshBtnOver = false;

    private summaryView = true;

    public constructor(private groupService: CirclecrmGroupService) {
    }

    public ngOnInit(): void {

        this.groupService.onAction.subscribe((action: IServiceAction<ICcGroup>) => {
            switch (action.type) {
                case ServiceActionType.LIST:
                case ServiceActionType.RELOAD:
                    this.loading = true;
                    break;
                case ServiceActionType.LOADED:
                    this.loading = false;
                    this.groups = action.payload || [];
                    break;
            }
        });

        this.refresh();
    }

    public refresh(): void {
        this.groupService.reloadAction(true);
    }

    public isSummaryView(): boolean {
        return this.summaryView;
    }

    public switchView(): void {
        this.summaryView = !this.summaryView;
    }

    public delete(group: ICcGroup): void {
        this.groupService.deleteAction(group, true);
    }

    public edit(group: ICcGroup): void {
        this.groupService.editAction(group);
    }

    public view(group: ICcGroup): void {
        this.groupService.viewAction(group);
    }

    public add(): void {
        this.groupService.addAction();
    }

    public getUnitIdFromEntity(group: ICcGroup): string | null {
        return this.groupService.getUnitIdFromEntity(group);
    }
}
