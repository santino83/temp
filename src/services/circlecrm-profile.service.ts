import {Inject, Injectable} from '@angular/core';
import {CONTACTS_CONFIG, IProfile} from '../types/circlecrm-contact.types';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AlertService, create_headers, json_decode, merge_url_fragments, wrap} from '@circlecrm/circlecrm-core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CirclecrmProfileService {

    private static doFilter = (profiles: IProfile[], owner: string) => {
        if (!profiles || profiles.length <= 0) {
            return null;
        }
        const founds = profiles.filter((p) => p.owner === owner);
        return founds && founds.length > 0 ? founds[0] : null;
    }

    public onLoad: Subject<IProfile> = new Subject<IProfile>();

    public onUpdate: Subject<IProfile> = new Subject<IProfile>();

    protected baseUrl: string;

    private cache: IProfile[] = [];

    public constructor(@Inject(CONTACTS_CONFIG) configToken: any,
                       protected http: HttpClient,
                       protected alertService: AlertService) {
        this.baseUrl = configToken as string;
    }

    public getByOwner(owner: string, background?: boolean): Promise<IProfile | null> | IProfile | null {
        return CirclecrmProfileService.doFilter(this.cache, owner) || this.doGet(owner, background).toPromise();
    }

    public getColleagues(background?: boolean): Promise<IProfile[]> | IProfile[] {
        return this.http.get(merge_url_fragments(this.baseUrl, 'colleagues'),
            {observe: 'response', responseType: 'text', headers: create_headers(background)})
            .map((res: HttpResponse<string>) => {
                const result = json_decode<IProfile[]>(res.body || '');
                this.updateCache(result || []);
                return result || [];
            }).toPromise();
    }

    public silentUpdate(profile: IProfile): Promise<boolean> | boolean {
        if (!this.isPersisted(profile)) {
            // not versioned profile
            return false;
        }

        return new Promise<boolean>(async (resolve) => {
            const result = await wrap(this.doUpdate(profile, true).toPromise());
            const hasResult: boolean = result.success && this.isPersisted(result.data!);
            resolve(hasResult);
        });
    }

    public update(profile: IProfile, background?: boolean): Promise<boolean> | boolean {

        if (!this.isPersisted(profile)) {
            // not versioned profile
            return false;
        }

        const okNotify = {type: 'success', message: 'Profile updated successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to update profile!', title: 'Error!'};

        return new Promise<boolean>(async (resolve) => {

            const result = await wrap(this.doUpdate(profile, background).toPromise());

            const hasResult: boolean = result.success && this.isPersisted(result.data!);

            this.alertService.notify(hasResult ? okNotify : errorNotify, () => resolve(hasResult));

        });
    }

    protected doUpdate(profile: IProfile, background?: boolean): Observable<IProfile> {
        return this.http.put(merge_url_fragments(this.baseUrl, 'profile'), profile,
            {headers: create_headers(background), observe: 'response', responseType: 'text'})
            .map((res) => {
                const result = json_decode<IProfile>(res.body || '');
                if (result !== null) {
                    this.updateCache(result);
                    this.onUpdate.next(result);
                }
                return result;
            });
    }

    protected isPersisted(profile: IProfile | null): boolean {
        return profile !== null && profile.id !== '' && profile.version_uuid !== '';
    }

    protected doGet(owner: string, background?: boolean): Observable<IProfile> {
        return this.http.get(merge_url_fragments(this.baseUrl, 'profile', encodeURI(owner)),
            {observe: 'response', responseType: 'text', headers: create_headers(background)})
            .map((res: HttpResponse<string>) => {
                    const result = json_decode<IProfile>(res.body || '');
                    if (result !== null) {
                        this.updateCache(result);
                        this.onLoad.next(result);
                    }
                    return result;
                }
            );
    }

    protected updateCache(entry: IProfile | IProfile[] | null): void {

        if (entry === null) {
            return;
        }

        const toCacheProfiles: IProfile[] = ('includes' in entry ? entry : [entry]) as IProfile[];

        if (!this.cache) {
            this.cache = [];
        }

        toCacheProfiles.forEach((toCacheProfile) => {
            const index = this.cache.findIndex((profile) => profile.owner === toCacheProfile.owner);
            if (index >= 0) {
                this.cache[index] = toCacheProfile;
            } else {
                // no found
                this.cache.push(toCacheProfile);
            }
        });

    }

}
