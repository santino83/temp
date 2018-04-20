import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CirclecrmCompanyService} from '../services/circlecrm-company.service';
import {ICcCompany} from '../types/circlecrm-auth-other.types';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'cmp-circlecrm-company-widget',
    styles: [
            `
            img#company-logo-widget {
                min-height: 45px;
                max-height: 45px;
            }
        `
    ],
    template: `
        <div class="panel widget {{ bgCssColor }}">
            <div class="panel-heading text-center">
                {{ 'YOUR_COMPANY' | translate }}
            </div>
            <div class="panel-body text-center">
                <div *ngIf="loading || company === null;else loaded">
                    <div class="ball-clip-rotate">
                        <div></div>
                    </div>
                </div>
                <ng-template #loaded>
                    <div class="clearfix">
                        <div class="pull-left"></div>
                        <div class="pull-right"></div>
                    </div>
                    <img id="company-logo-widget" class="img-thumbnail {{ bgCssColor }} b0" alt="{{ company.name }}"
                         src="{{ company.logo }}">
                    <h4 class="mb0">{{ company.name }}</h4>
                    <p class="m0">{{ company.vat }}</p>
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
            </div>
        </div>
    `
})
export class CirclecrmCompanyWidget implements OnInit {

    public loading = true;
    public company: ICcCompany;
    @Input() public bgCssColor = 'bg-white';
    public refreshBtnOver = false;

    public constructor(private companyService: CirclecrmCompanyService) {
    }

    public ngOnInit(): void {
        this.companyService.onLoading.subscribe((loading) => {
            this.loading = loading;
            this.refreshBtnOver = false;
            if (!loading) {
                this.company = this.companyService.getLoaded();
            }
        });
        this.refresh();
    }

    public refresh(): void {
        this.companyService.reload(true);
    }

}
