import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ICcEntitiesList, IHateoasEntity, IServiceAction, ServiceActionType} from '../types/circlecrm-auth-other.types';
import {
    AlertResultType,
    AlertService,
    create_headers,
    IAlertAskAction,
    json_decode,
    merge_url_fragments
} from '@circlecrm/circlecrm-core';
import {Observable} from 'rxjs/Observable';
import {EventEmitter} from '@angular/core';
import {IAuthenticationModuleConfig} from "../types/circlecrm-auth.types";

export abstract class CirclecrmAbstractService<T extends IHateoasEntity> {

    public onAction: EventEmitter<IServiceAction<T>> = new EventEmitter<IServiceAction<T>>();

    protected entities: T[] = [];

    protected constructor(protected config: IAuthenticationModuleConfig,
                          protected remoteEndpoint: string,
                          protected http: HttpClient,
                          protected alertService: AlertService) {
        // register to actions
        this.onAction.subscribe((action: IServiceAction<T>) => {
            switch (action.type) {
                case ServiceActionType.LOADED:
                    this.onLoaded(action);
                    break;
                case ServiceActionType.FIND:
                    this.onFind(action);
                    break;
                case ServiceActionType.DELETED:
                    this.onDeleted(action);
                    break;
                case ServiceActionType.UPDATED:
                case ServiceActionType.CREATED:
                    this.reloadAction(true);
                    break;
                case ServiceActionType.DELETE:
                    this.onDelete(action);
                    break;
                case ServiceActionType.LIST:
                    this.onList(action);
                    break;
                case ServiceActionType.RELOAD:
                    this.onReload(action);
                    break;
            }
        });
    }

    public getLastValue(): T[] {
        return this.entities;
    }

    public reloadAction(background?: boolean): void {
        this.onAction.next({background: background || false, type: ServiceActionType.RELOAD});
    }

    public deleteAction(entity: T, background?: boolean): void {
        this.onAction.next({background: background || false, payload: [entity], type: ServiceActionType.DELETE});
    }

    public listAction(background?: boolean, refresh?: boolean): void {
        this.onAction.next({
            background: background || false,
            extras: {refresh: refresh || false},
            type: ServiceActionType.LIST
        });
    }

    public findAction(id: string, background?: boolean): void {
        this.onAction.next({background: background || false, type: ServiceActionType.FIND, extras: {id}});
    }

    public editAction(entity: T, extras?: { [key: string]: any }): void {
        this.onAction.next({type: ServiceActionType.EDIT, payload: [entity], extras});
    }

    public viewAction(entity: T, extras?: { [key: string]: any }): void {
        this.onAction.next({type: ServiceActionType.VIEW, payload: [entity], extras});
    }

    public addAction(extras?: { [key: string]: any }): void {
        this.onAction.next({type: ServiceActionType.ADD, extras});
    }

    public createdAction(entity: T): void {
        this.onAction.next({type: ServiceActionType.CREATED, payload: [entity]});
    }

    public updatedAction(entity: T, status: boolean): void {
        this.onAction.next({type: ServiceActionType.UPDATED, payload: [entity], extras: {status}});
    }

    protected reloadedAction(payload: T[], status: boolean): void {
        this.onAction.next({extras: {status}, payload, type: ServiceActionType.LOADED});
    }

    protected deletedAction(entity: T | null, status: boolean): void {
        this.onAction.next({
            extras: {status},
            payload: entity ? [entity] : [],
            type: ServiceActionType.DELETED
        });
    }

    protected foundedAction(payload: T[], status: boolean): void {
        this.onAction.next({type: ServiceActionType.FOUNDED, payload, extras: {status}});
    }

    protected onReload(action: IServiceAction<T>): void {
        this.doGetAll(action.background || false)
            .toPromise()
            .then((entries) => {
                this.reloadedAction(entries, true);
            })
            .catch((error) => this.reloadedAction([], false));
    }

    protected onDelete(action: IServiceAction<T>): void {

        const entity: T | null = action.payload ? action.payload[0] : null;

        if (entity === null || !this.preDelete(entity)) {
            this.deletedAction(entity, false);
            return;
        }

        const askAction: IAlertAskAction = {
            afterCallback: (result: AlertResultType) => {
                this.deletedAction(entity, result === AlertResultType.OK);
            },
            onConfirm: () => {
                return new Promise<AlertResultType>(async (resolve) => {
                    const doDelete = await this.doDelete(entity.id || '', action.background || false);
                    resolve(doDelete ? AlertResultType.OK : AlertResultType.ERROR);
                });
            }
        };

        this.alertService.ask(askAction);
    }

    protected onDeleted(action: IServiceAction<T>): void {
        if (action.extras!.status || false) {
            this.reloadAction(true);
        }
    }

    protected onList(action: IServiceAction<T>): void {
        const refresh = action.extras!.refresh || false;
        if (this.entities.length > 0 && !refresh) {
            this.reloadedAction(this.entities, true);
        }

        this.onReload(action);
    }

    protected onLoaded(action: IServiceAction<T>): void {
        this.entities = action.payload!;
    }

    protected onFind(action: IServiceAction<T>): void {

        const id: string = action.extras!.id;

        if (this.entities) {
            const filtered = this.entities.filter((e) => e.id === id);
            if (filtered.length > 0) {
                this.foundedAction(filtered, true);
            }
        }

        this.getRequest<T>(action.background || false, this.remoteEndpoint, id)
            .toPromise()
            .then((founded) => this.foundedAction([founded], true))
            .catch((error) => this.foundedAction([], false));
    }

    protected preDelete(entity: T): boolean {
        return true;
    }

    protected doDelete(id: string, background?: boolean): Promise<boolean> {
        const url = merge_url_fragments(this.config.remoteVAuthURL!, this.remoteEndpoint, id);
        const headers = create_headers(background);

        return this.http.delete(url, {headers, observe: 'response'})
            .map((res) => {
                return res.ok;
            })
            .catch((error) => {
                return Observable.throw(error);
            }).toPromise();
    }

    protected doGetAll(background?: boolean): Observable<T[]> {
        return this.getRequest<ICcEntitiesList<T>>(background || false, this.remoteEndpoint)
            .map((res: ICcEntitiesList<T>) => res.entries);
    }

    protected getRequest<A>(background: boolean, ...urlFragments: string[]): Observable<A> {
        const url = this.getUrl(...urlFragments);
        const headers = this.getHeaders(background);
        return this.http.get(url, {observe: 'response', responseType: 'text', headers})
            .map((res: HttpResponse<string>) => {
                return json_decode<A>(res.body || '');
            });
    }

    protected doCreate(url: string, body: any, headers: HttpHeaders): Promise<boolean> {

        const okNotify = {type: 'success', message: 'Entity created successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to create entity!', title: 'Error!'};

        return new Promise<boolean>(async (resolve, reject) => {

            const result: T | null = await this.http.post<T>(url, body, {headers}).toPromise();
            const hasResult: boolean = result !== null && result.id !== '';

            const callback = (resultType: AlertResultType) => {
                resolve(hasResult);
                if (hasResult) {
                    this.createdAction(result);
                }
            };

            this.alertService.notify(hasResult ? okNotify : errorNotify, callback);

        });
    }

    protected doUpdate(url: string, body: any, headers: HttpHeaders): Promise<boolean> {

        const okNotify = {type: 'success', message: 'Entity updated successfully!', title: 'Success!'};
        const errorNotify = {type: 'error', message: 'Unable to update entity!', title: 'Error!'};

        return new Promise<boolean>(async (resolve, reject) => {

            const result: T | null = await this.http.put<T>(url, body, {headers}).toPromise();
            const hasResult: boolean = result !== null && result.id !== '';

            const callback = (resultType: AlertResultType) => {
                resolve(hasResult);
                this.updatedAction(result, hasResult);
            };

            this.alertService.notify(hasResult ? okNotify : errorNotify, callback);

        });
    }

    protected getUrl(...urlFragments: string[]): string {
        return merge_url_fragments(this.config.remoteVAuthURL!, ...urlFragments);
    }

    protected getHeaders(background?: boolean): HttpHeaders {
        return create_headers(background);
    }

    protected appendLink(id: string, endpoint: string, headers: HttpHeaders): HttpHeaders {
        return headers.append('Link', this.getUrl(endpoint, id));
    }

}
