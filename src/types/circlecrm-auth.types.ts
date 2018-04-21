import {InjectionToken} from '@angular/core';

export interface IDecodedToken {
    iat: number;
    nbf: number;
    exp: number;
    data: string;
}

export interface ISsoUnit {
    created?: Date;
    id?: string;
    name?: string;
    ref?: string;
    updated?: Date;
}

export interface ISsoService {
    created?: Date;
    description?: string;
    id?: string;
    name?: string;
    tag?: string;
    updated?: Date;
    uri?: string;
}

export interface ISsoGroup {
    created?: Date;
    id?: string;
    name?: string;
    ref?: string;
    updated?: Date;
}

export interface ISsoCompany {
    created?: Date;
    favico?: string;
    id?: string;
    logo?: string;
    name?: string;
    updated?: Date;
    vat?: string;
}

export interface ISsoRole {
    created?: Date;
    id?: string;
    name?: string;
    ref?: string;
    updated?: Date;
}

export interface ISsoCapability {
    created?: Date;
    id?: string;
    ref?: string;
    name?: string;
    access?: string;
    accessRef?: string;
    updated?: Date;
}

export interface ISsoEntity {
    deleteRef?: string;
    ref?: string;
    created?: Date;
    delete?: string;
    update?: string;
    updated?: Date;
    createRef?: string;
    view?: string;
    assignRef?: string;
    create?: string;
    updateRef?: string;
    name?: string;
    viewRef?: string;
    assign?: string;
    id?: string;
}

export interface ISsoAttributes {
    company?: ISsoCompany;
    companyId?: string;
    created?: Date;
    email?: string;
    firstname?: string;
    group?: ISsoGroup[];
    id?: string;
    isActive?: boolean;
    lastname?: string;
    service?: ISsoService[];
    token?: string;
    unit?: ISsoUnit;
    unitId?: string;
    updated?: Date;
    entity?: ISsoEntity[];
    capability?: ISsoCapability[];
}

export interface ISsoUser {
    attributes?: ISsoAttributes;
    role?: ISsoRole[];
    username?: string;
}

export interface ISsoToken {
    user: ISsoUser;
    createdAt: number;
    notBefore: number;
    expiresAt: number;
}

export interface IAuthenticationModuleConfig {
    remoteBaseURL: string;
    redirectURL: string;
    logoutURL?: string;
    apiLoginPath?: string;
    loginPath?: string;
    remoteVAuthURL?: string;
    actsOnUrl?: RegExp[];
}

export const AUTHMODULE_CONFIG: InjectionToken<IAuthenticationModuleConfig> =
    new InjectionToken<IAuthenticationModuleConfig>('AUTHMODULE_CONFIG');

export const CIRCLECRM_URI_NS = /http(s)?\:\/\/(.*)\.circlecrm\.it.*/;
