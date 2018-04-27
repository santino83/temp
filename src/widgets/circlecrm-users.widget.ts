import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ICcUser, IProfile, IServiceAction, ServiceActionType} from '../circlecrm-auth.types';
import {CirclecrmUserService} from "../services/index";

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'cmp-circlecrm-users-widget',
    styles: [
            `
            .users-list-summary {
                height: 160px;
                overflow-y: auto;
            }

            .users-list-pictures {
                min-height: 130px;
            }

            .users-list-pictures .user-block {
                padding: 12px 0 !important;
            }
        `
    ],
    template: `
        <div class="panel widget {{ bgCssColor }}">
            <div class="panel-heading text-center">
                {{ 'YOUR_USERS' | translate }}
            </div>
            <div class="panel-body text-center">
                <div *ngIf="loading || users === null;else loaded">
                    <div class="ball-clip-rotate">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <ng-template #loaded>
            <div class="clearfix">
                <div class="pull-left"></div>
                <div class="pull-right">
                    <a (click)="switchView()"
                       title="{{ (isSummaryView() ? 'LIST_VIEW' : 'SUMMARY_VIEW') | translate }}"
                       class="pull-right text-muted">
                        <em class="fa"
                            [ngClass]="{'icon-list':isSummaryView(),'icon-eye':!isSummaryView()}"></em>
                    </a></div>
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
                <span>{{ loadedUsers.length }}</span>
            </div>
        </ng-template>

        <ng-template #listview>

            <div class="row users-list-summary" style="" infinite-scroll
                 [infiniteScrollDistance]="2"
                 [infiniteScrollThrottle]="50"
                 [scrollWindow]="false"
                 (scrolled)="onModalScrollDown()">
                <div *ngFor="let user of users" class="col-sm-3 mb-lg">
                    <div class="p-sm bg-gray-lighter users-list-pictures">
                        <cmp-circlecrm-profile-info
                                [owner]="user.email"
                                (clicked)="onClicked(user, $event)"
                                [blockInfoClass]="'mt0 pt0'"></cmp-circlecrm-profile-info>
                    </div>
                </div>
            </div>

        </ng-template>
    `
})
export class CirclecrmUsersWidget implements OnInit {

    @Input() public bgCssColor = 'bg-white';
    @Input() public radialCssColor = 'br-success';

    public users: ICcUser[] = [];
    public loading = false;
    public refreshBtnOver = false;
    public loadedUsers: ICcUser[] = [];
    private summaryView = true;

    public constructor(private userService: CirclecrmUserService) {
    }

    public ngOnInit(): void {

        this.userService.onAction.subscribe((action: IServiceAction<ICcUser>) => {
            switch (action.type) {
                case ServiceActionType.LIST:
                case ServiceActionType.RELOAD:
                    this.loading = true;
                    break;
                case ServiceActionType.LOADED:
                    this.loading = false;
                    this.users = [];
                    this.loadedUsers = action.payload!;
                    this.onModalScrollDown();
                    break;
            }
        });

        this.refresh();
    }

    public refresh(): void {
        this.userService.reloadAction(true);
    }

    public isSummaryView(): boolean {
        return this.summaryView;
    }

    public switchView(): void {
        this.summaryView = !this.summaryView;
    }

    public onClicked(user: ICcUser, profile: IProfile): void {
        this.userService.viewAction(user, {profile});
    }

    public onModalScrollDown(): void {
        const start = this.users.length > 0 ? this.users.length : 0;
        const max = (this.users.length + 12 > this.loadedUsers.length ?
            this.loadedUsers.length :
            this.users.length + 12);
        this.users.push(...this.loadedUsers.slice(start, max));
    }

}
