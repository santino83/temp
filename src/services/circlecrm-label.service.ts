import {Inject, Injectable} from '@angular/core';
import {CONTACTS_CONFIG, IDeletedVersion, ILabel, ILabelEntity} from '../circlecrm-auth.types';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AlertService, create_headers, json_decode, merge_url_fragments, wrap} from '@circlecrm/circlecrm-core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CirclecrmLabelService {

    protected baseUrl: string;

    private cache: ILabelEntity[] = [];
    private names: { [key: string]: string } = {};

    public constructor(@Inject(CONTACTS_CONFIG) configToken: any,
                       protected http: HttpClient,
                       protected alertService: AlertService) {
        this.baseUrl = configToken as string;
    }

    public refresh(background?: boolean): Promise<ILabelEntity[]> {
        this.cache = [];
        this.names = {};
        return this.doGetEntities(background).toPromise();
    }

    public async getNameByRel(rel: string, background?: boolean): Promise<string> {

        if (!this.cache || this.cache.length <= 0) {
            await wrap(this.refresh(background));
        }

        return Promise.resolve(this.names[rel] || '');
    }

    public getLabelEntities(background?: boolean): Promise<ILabelEntity[]> | ILabelEntity[] {

        if (this.cache && this.cache.length > 0) {
            return this.cache;
        }

        return this.doGetEntities(background).toPromise();
    }

    public getLabels(background?: boolean): Promise<ILabel[]> {
        return this.http.get(merge_url_fragments(this.baseUrl, 'labels'),
            {observe: 'response', responseType: 'text', headers: create_headers(background)})
            .map((res: HttpResponse<string>) => json_decode<ILabel[]>(res.body || ''))
            .toPromise();
    }

    public save(label: ILabel, background?: boolean): Promise<boolean> | boolean {

        if (this.isPersisted(label) || label.is_system) {
            // label already versioned or system label, use update or false
            return false;
        }

        const okNotify = {type: 'success', message: 'Labek created successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to create labek!', title: 'Error!'};

        return new Promise<boolean>(async (resolve) => {

            const result = await wrap(this.doSave(label, background).toPromise());

            const hasResult: boolean = result.success && this.isPersisted(result.data!);

            this.alertService.notify(hasResult ? okNotify : errorNotify, () => resolve(hasResult));

        });

    }

    public update(label: ILabel, background?: boolean): Promise<boolean> | boolean {

        if (!this.isPersisted(label) || label.is_system) {
            // not versioned label or system label
            return false;
        }

        const okNotify = {type: 'success', message: 'Label updated successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to update label!', title: 'Error!'};

        return new Promise<boolean>(async (resolve) => {

            const result = await wrap(this.doUpdate(label, background).toPromise());

            const hasResult: boolean = result.success && this.isPersisted(result.data!);

            this.alertService.notify(hasResult ? okNotify : errorNotify, () => resolve(hasResult));
        });
    }

    public delete(label: ILabel, background?: boolean): Promise<boolean> | boolean {

        if (!this.isPersisted(label) || label.is_system) {
            // not persisted label or system label, save before delete or nothing
            return false;
        }

        const okNotify = {type: 'success', message: 'Label deleted successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to delete label!', title: 'Error!'};

        return new Promise<boolean>(async (resolve) => {

            const result = await wrap(this.doDelete(label, background).toPromise());

            const hasResult = result.success && result.data!.version_uuid === label.version_uuid;

            this.alertService.notify(hasResult ? okNotify : errorNotify, () => resolve(hasResult));

        });
    }

    protected doSave(label: ILabel, background?: boolean): Observable<ILabel> {
        return this.http.post(merge_url_fragments(this.baseUrl, 'labels'), label,
            {headers: create_headers(background), observe: 'response', responseType: 'text'})
            .map((res) => json_decode<ILabel>(res.body || ''));
    }

    protected doUpdate(label: ILabel, background?: boolean): Observable<ILabel> {
        return this.http.put(merge_url_fragments(this.baseUrl, 'labels'), label,
            {headers: create_headers(background), observe: 'response', responseType: 'text'})
            .map((res) => json_decode<ILabel>(res.body || ''));
    }

    protected doDelete(label: ILabel, background?: boolean): Observable<IDeletedVersion> {
        return this.http.delete(merge_url_fragments(this.baseUrl, 'labels', label.version_uuid!),
            {headers: create_headers(background), observe: 'response', responseType: 'text'})
            .map((res) => json_decode<IDeletedVersion>(res.body || ''));

    }

    protected isPersisted(label: ILabel | null): boolean {
        return label !== null && label.id !== '' && label.version_uuid !== '';
    }

    protected doGetEntities(background?: boolean): Observable<ILabelEntity[]> {
        return this.http.get(merge_url_fragments(this.baseUrl, 'entities'),
            {observe: 'response', responseType: 'text', headers: create_headers(background)})
            .map((res: HttpResponse<string>) => {
                    const result = json_decode<ILabelEntity[]>(res.body || '');
                    this.updateCache(result || []);
                    return result;
                }
            );
    }

    protected updateCache(entities: ILabelEntity[]): void {
        this.cache = entities;
        this.names = {};
        this.cache.forEach((le) => le.labels.forEach((l) => this.names[l.rel] = l.name));
    }

}
