import {Inject, Injectable} from '@angular/core';
import {CONTACTS_CONFIG, IContact, IDeletedVersion, ISaveContactResult, STARRED_LABEL} from '../types/index';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AlertService, create_headers, json_decode, merge_url_fragments, wrap} from '@circlecrm/circlecrm-core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CirclecrmContactService {

    private static doFilter = (contacts: IContact[], search: string) => {
        if (!contacts || contacts.length <= 0) {
            return null;
        }
        const founds = contacts.filter((c) => c.id === search);
        return founds && founds.length > 0 ? founds[0] : null;
    }

    protected baseUrl: string;

    private cache: IContact[] = [];

    public constructor(@Inject(CONTACTS_CONFIG) configToken: any,
                       protected http: HttpClient,
                       protected alertService: AlertService) {
        this.baseUrl = configToken as string;
    }

    public refresh(background?: boolean): Promise<IContact[]> {
        this.cache = [];
        return this.doGetAll(background).toPromise();
    }

    public getById(id: string, background?: boolean): Promise<IContact | null> | IContact | null {

        return CirclecrmContactService.doFilter(this.cache, id) || this.doGetAll(background)
            .switchMap((contacts) => {
                return Observable.of(CirclecrmContactService.doFilter(contacts, id));
            }).toPromise();

    }

    public getAll(background?: boolean): Promise<IContact[]> | IContact[] {
        if (this.cache && this.cache.length > 0) {
            return this.cache;
        }

        return this.doGetAll(background).toPromise();
    }

    public save(contact: IContact, background?: boolean): Promise<boolean> | boolean {

        if (this.isPersisted(contact)) {
            // contact already versioned, use update
            return false;
        }

        const okNotify = {type: 'success', message: 'Contact created successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to create contact!', title: 'Error!'};

        return new Promise<boolean>(async (resolve) => {

            const result = await wrap(this.doSave(contact, background).toPromise());

            const hasResult: boolean = result.success && this.isPersisted(result.data!);

            this.alertService.notify(hasResult ? okNotify : errorNotify, () => resolve(hasResult));

        });

    }

    public silentUpdate(contact: IContact): Promise<ISaveContactResult> {
        return new Promise<ISaveContactResult>(async (resolve) => {

            if (!this.isPersisted(contact)) {
                // not versioned contact, use save instead
                resolve({success: false, error: 'not persisted contact'});
                return;
            }

            const result = await wrap(this.doUpdate(contact, true).toPromise());
            const hasResult: boolean = result.success && this.isPersisted(result.data!);
            resolve({
                data: result.data,
                error: result.error,
                success: hasResult
            });
        });
    }

    public update(contact: IContact, background?: boolean): Promise<boolean> | boolean {

        if (!this.isPersisted(contact)) {
            // not versioned contact, use save instead
            return false;
        }

        const okNotify = {type: 'success', message: 'Contact updated successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to update contact!', title: 'Error!'};

        return new Promise<boolean>(async (resolve) => {

            const result = await wrap(this.doUpdate(contact, background).toPromise());

            const hasResult: boolean = result.success && this.isPersisted(result.data!);

            this.alertService.notify(hasResult ? okNotify : errorNotify, () => resolve(hasResult));

        });
    }

    public delete(contact: IContact, background?: boolean): Promise<boolean> | boolean {

        if (!this.isPersisted(contact)) {
            // not persisted contact, save before delete
            return false;
        }

        const okNotify = {type: 'success', message: 'Contact deleted successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to delete contact!', title: 'Error!'};

        return new Promise<boolean>(async (resolve) => {

            const result = await wrap(this.doDelete(contact, background).toPromise());

            const hasResult = result.success && result.data!.version_uuid === contact.version_uuid;

            this.alertService.notify(hasResult ? okNotify : errorNotify, () => resolve(hasResult));

        });
    }

    public starred(contact: IContact, value?: boolean, background?: boolean): Promise<boolean> | boolean {

        if (!this.isPersisted(contact)) {
            // save contact before
            return false;
        }

        contact.labels = (contact.labels || []).filter((l) => l !== STARRED_LABEL);
        if (value || false) {
            contact.labels.push(STARRED_LABEL);
        }

        return new Promise<boolean>(async (resolve) => {
            const result = await wrap(
                this.doUpdate(contact, background).map((res) => this.isPersisted(res)).toPromise()
            );

            resolve(result.success ? result.data : false);
        });
    }

    protected doSave(contact: IContact, background?: boolean): Observable<IContact> {
        return this.http.post(merge_url_fragments(this.baseUrl, 'contacts'), contact,
            {headers: create_headers(background), observe: 'response', responseType: 'text'})
            .map((res) => json_decode<IContact>(res.body || ''));
    }

    protected doUpdate(contact: IContact, background?: boolean): Observable<IContact> {
        return this.http.put(merge_url_fragments(this.baseUrl, 'contacts'), contact,
            {headers: create_headers(background), observe: 'response', responseType: 'text'})
            .map((res) => json_decode<IContact>(res.body || ''));
    }

    protected doDelete(contact: IContact, background?: boolean): Observable<IDeletedVersion> {
        return this.http.delete(merge_url_fragments(this.baseUrl, 'contacts', contact.version_uuid!),
            {headers: create_headers(background), observe: 'response', responseType: 'text'})
            .map((res) => json_decode<IDeletedVersion>(res.body || ''));

    }

    protected isPersisted(contact: IContact | null): boolean {
        return contact !== null && contact.id !== '' &&
            contact.version_uuid !== '' && contact.version_uuid !== '';
    }

    protected doGetAll(background?: boolean): Observable<IContact[]> {
        return this.http.get(merge_url_fragments(this.baseUrl, 'contacts'),
            {observe: 'response', responseType: 'text', headers: create_headers(background)})
            .map((res: HttpResponse<string>) => {
                const result = json_decode<IContact[]>(res.body || '');
                this.cache = result || [];
                return this.cache;
            });
    }

}
