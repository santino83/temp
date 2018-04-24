import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CirclecrmRoleService} from '../services/circlecrm-role.service';
import {ICcRole, IServiceAction, ServiceActionType} from '../types/circlecrm-auth-extra.types';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'cmp-circlecrm-roles-widget',
    template: `
        <div class="panel widget {{ bgCssColor }}">
            <div class="panel-heading text-center">
                {{ 'YOUR_ROLES' | translate }}
            </div>
            <div class="panel-body text-center">
                <div *ngIf="loading || roles === null;else loaded">
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
                    </a>
                </div>
            </div>
            <ng-container *ngIf="isSummaryView(); then summaryview;else listview"></ng-container>
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
                <span>{{ roles.length }}</span>
            </div>
        </ng-template>

        <ng-template #listview>
            <div class="table-responsive">
                <table class="table table-hover">
                    <tbody>
                    <tr *ngFor="let role of roles">
                        <td class="text-left">{{ role.name }}
                            <span *ngIf="role.system" class="label label-warning btn-sm">{{ 'PROTECTED' | translate
                                }}</span>
                        </td>
                        <td class="text-right">
                            <div class="showhide-box">
                                <div class="showhide-content btn-group btn-group-xs">
                                    <button (click)="view(role)"
                                            class="btn btn-xs btn-success"
                                            title="{{ 'VIEW' | translate}}">
                                        <em class="fa fa-eye"></em>
                                    </button>
                                    <button *ngIf="!role.system"
                                            (click)="edit(role)"
                                            class="btn btn-xs btn-info"
                                            title="{{ 'EDIT' | translate}}">
                                        <em class="fa fa-pencil"></em>
                                    </button>
                                    <button *ngIf="!role.system"
                                            (click)="delete(role)"
                                            class="btn btn-xs btn-danger"
                                            title="{{ 'DELETE' | translate}}">
                                        <em class="fa fa-trash"></em>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr *ngIf="roles.length <= 0">
                        <td colspan="2" class="text-left">{{ 'NO_ENTRY_FOUND' | translate }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </ng-template>
    `
})
export class CirclecrmRolesWidget implements OnInit {

    public roles: ICcRole[];
    public loading = false;
    @Input() public bgCssColor = 'bg-white';
    @Input() public radialCssColor = 'br-info';
    public refreshBtnOver = false;

    private summaryView = true;

    public constructor(private roleService: CirclecrmRoleService) {
    }

    public ngOnInit(): void {

        this.roleService.onAction.subscribe((action: IServiceAction<ICcRole>) => {
            switch (action.type) {
                case ServiceActionType.LIST:
                case ServiceActionType.RELOAD:
                    this.loading = true;
                    break;
                case ServiceActionType.LOADED:
                    this.loading = false;
                    this.roles = action.payload || [];
                    break;
            }
            this.refreshBtnOver = false;
        });

        this.refresh();
    }

    public refresh(): void {
        this.roleService.reloadAction(true);
    }

    public isSummaryView(): boolean {
        return this.summaryView;
    }

    public switchView(): void {
        this.summaryView = !this.summaryView;
    }

    public delete(role: ICcRole): void {
        this.roleService.deleteAction(role, true);
    }

    public edit(role: ICcRole): void {
        this.roleService.editAction(role);
    }

    public view(role: ICcRole): void {
        this.roleService.viewAction(role);
    }

    public add(): void {
        this.roleService.addAction();
    }

}
