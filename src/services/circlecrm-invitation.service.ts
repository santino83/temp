import {CirclecrmAbstractService} from './circlecrm-abstract.service';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {ICcInvitation, ISimpleInvitation, ISimpleInvitationPerson} from '../types/circlecrm-auth-other.types';
import {AlertService} from '@circlecrm/circlecrm-core';
import {AUTHMODULE_CONFIG, IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";

@Injectable()
export class CirclecrmInvitationService extends CirclecrmAbstractService<ICcInvitation> {

    public constructor(@Inject(AUTHMODULE_CONFIG) configToken: any, http: HttpClient, alertService: AlertService) {
        super(configToken as IAuthenticationModuleConfig, 'invitations', http, alertService);
    }

    public send(invitation: ISimpleInvitation, background?: boolean): boolean | Promise<boolean> {

        if (!invitation.groups || !invitation.roles || !invitation.unit ||
            invitation.roles.length <= 0) {
            return false;
        }

        const promises: Array<Promise<boolean>> = [];

        invitation.people.forEach((p) => promises.push(this.createPromiseAdd(p, invitation, background)));

        return new Promise<boolean>(async (resolve) => {

            const results = await Promise.all(promises);
            const result = results.reduce((prev, current) => {
                return prev && current;
            }, true);

            this.alertService.notify({
                message: result ? 'All invitations are sent' : 'Unable to send some invitations',
                title: result ? 'Invitations sent!' : 'Error!',
                type: result ? 'success' : 'error',
            }, (rt) => {
                resolve(true);
                this.reloadAction(true);
            });

        });
    }

    private createPromiseAdd(person: ISimpleInvitationPerson,
                             invitation: ISimpleInvitation,
                             background?: boolean): Promise<boolean> {

        return new Promise<boolean>((resolve) => {

            let headers = this.appendLink(invitation.unit, 'units', this.getHeaders(background || false));
            invitation.groups.forEach((g) => headers = this.appendLink(g.id!, 'groups', headers));
            invitation.roles.forEach((r) => headers = this.appendLink(r.id!, 'roles', headers));

            const body = Object.assign({}, person, {valid_until: Math.trunc(invitation.validUntil / 1000)});

            this.http.post(this.getUrl(this.remoteEndpoint), body, {headers, observe: 'response'})
                .subscribe((res) => resolve(res.ok), (error) => resolve(false));

        });
    }

}
