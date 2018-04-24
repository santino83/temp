import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {IProfile} from '../types/circlecrm-contact.types';
import {CirclecrmProfileService} from '../services/circlecrm-profile.service';
import {wrap} from '@circlecrm/circlecrm-core';

@Component({
    selector: 'cmp-circlecrm-profile-info',
    template: `
        <div class="item user-block" *ngIf="profile" (click)="onClick()">

            <div class="user-block-picture">
                <div class="user-block-status">
                    <img class="img-thumbnail img-circle"
                         dirCircleCRMPhotoProfile
                         [photo]="profile.photo"
                         [defaultImage]="defaultImage"
                         [alt]="profile.full_name"
                         [title]="profile.full_name"/>
                    <div class="circle circle-success circle-lg"></div>
                </div>
            </div>

            <div class="user-block-info" [ngClass]="blockInfoClass">
                <span class="user-block-name">{{ profile.full_name }}</span>
                <span class="user-block-role">{{ profile.owner }}</span>
            </div>
        </div>
    `
})
export class CirclecrmProfileInfoComponent implements OnInit {

    @Input() public owner: string;
    @Input() public silentRequests = true;
    @Input() public defaultImage = 'assets/images/nophoto.jpg';
    @Input() public blockInfoClass: string;
    @Output() public clicked: EventEmitter<IProfile> = new EventEmitter<IProfile>();

    public profile: IProfile | null;

    public constructor(private injector: Injector) {
    }

    public ngOnInit(): void {

        const profileService: CirclecrmProfileService = this.injector.get(CirclecrmProfileService);

        profileService.onUpdate
            .filter((p) => p.owner === this.owner)
            .subscribe((p) => this.profile = p);

        profileService.onLoad
            .filter((p) => p.owner === this.owner)
            .subscribe((p) => this.profile = p);

        wrap(Promise.resolve(profileService.getByOwner(this.owner, this.silentRequests)))
            .then((result) => this.profile = result.success ? result.data! : null);

    }

    public onClick(): void {
        if (this.profile) {
            this.clicked.next(this.profile);
        }
    }

}
