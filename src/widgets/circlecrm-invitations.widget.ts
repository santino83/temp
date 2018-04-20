import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ICcInvitation, IServiceAction, ServiceActionType} from '../types/circlecrm-auth-other.types';
import {CirclecrmInvitationService} from '../services/circlecrm-invitation.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'cmp-circlecrm-invitations-widget',
    template: `
        <div class="panel widget {{ bgCssColor }}">
            <div class="panel-heading text-center">
                {{ 'YOUR_INVITATIONS' | translate }}
            </div>
            <div class="panel-body text-center">
                <div *ngIf="loading || invitations === null;else loaded">
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
            <ng-container *ngIf="isSummaryView();then summaryview;else listview"></ng-container>
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
                <span>{{ invitations.length }}</span>
            </div>
        </ng-template>

        <ng-template #listview>
            <div class="table-responsive">
                <table class="table table-hover">
                    <tbody>
                    <tr *ngFor="let entity of invitations">
                        <td class="text-left">
                            {{ entity.email }}
                            <span *ngIf="isExpired(entity)" class="label label-danger btn-xs">{{ 'EXPIRED' | translate
                                }}</span></td>
                        <td class="text-right">
                            <div class="showhide-box">
                                <div class="showhide-content btn-group btn-group-xs">
                                    <button (click)="view(entity)"
                                            class="btn btn-xs btn-success"
                                            title="{{ 'VIEW' | translate}}">
                                        <em class="fa fa-eye"></em>
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
                    <tr *ngIf="invitations.length <= 0">
                        <td colspan="2" class="text-left">{{ 'NO_ENTRY_FOUND' | translate }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </ng-template>
    `
})
export class CirclecrmInvitationsWidget implements OnInit {

    public invitations: ICcInvitation[];
    public loading = false;
    public refreshBtnOver = false;
    @Input() public bgCssColor = 'bg-white';
    @Input() public radialCssColor = 'br-danger';

    private summaryView = true;

    public constructor(private invitationService: CirclecrmInvitationService) {
    }

    public ngOnInit(): void {

        this.invitationService.onAction.subscribe((action: IServiceAction<ICcInvitation>) => {
            switch (action.type) {
                case ServiceActionType.LIST:
                case ServiceActionType.RELOAD:
                    this.loading = true;
                    break;
                case ServiceActionType.LOADED:
                    this.loading = false;
                    this.invitations = action.payload || [];
                    break;
            }
        });

        this.refresh();
    }

    public refresh(): void {
        this.invitationService.reloadAction(true);
    }

    public isSummaryView(): boolean {
        return this.summaryView;
    }

    public switchView(): void {
        this.summaryView = !this.summaryView;
    }

    public delete(invitation: ICcInvitation): void {
        this.invitationService.deleteAction(invitation, true);
    }

    public view(invitation: ICcInvitation): void {
        this.invitationService.viewAction(invitation);
    }

    public add(): void {
        this.invitationService.addAction();
    }

    public isExpired(invitation: ICcInvitation): boolean {
        return new Date().getTime() > invitation.valid_until * 1000;
    }

}
