import {InjectionToken} from '@angular/core';

export const CONTACTS_CONFIG: InjectionToken<string> = new InjectionToken<string>('CONTACTS_CONFIG');

export const STARRED_LABEL = 'http://schemas.voiptech.it/cc/2015#contact.starred';

export const CIRCLECRM_CONTACTS_BASE_URL = 'https://contacts.circlecrm.it/api';

export const AUTHMODULE_CONFIG: InjectionToken<IAuthenticationModuleConfig> =
    new InjectionToken<IAuthenticationModuleConfig>('AUTHMODULE_CONFIG');

export const CIRCLECRM_URI_NS = /http(s)?\:\/\/(.*)\.circlecrm\.it.*/;

export const CIRCLECRM_PLATFORM_ADMIN_ROLE = 'CIRCLECRM_PLATFORM_ADMIN';

export const CIRCLECRM_PLATFORM_USER_ROLE = 'CIRCLECRM_PLATFORM_USER';

export interface IHateoasLink {
    href?: string;
    ref_id?: string;
}

export interface IHateoasEntity {
    id?: string;
    _links: { [key: string]: IHateoasLink | IHateoasLink[] };
}

export interface ICcEntitiesList<T extends IHateoasEntity> {
    entries: T[];
    rel: string;
}

export interface ICcCompany extends IHateoasEntity {
    name: string;
    vat: string;
    logo?: string;
    favico?: string;
    created?: Date;
    updated?: Date;
}

export interface ICcUnit extends IHateoasEntity {
    name: string;
    phone?: string;
    fax?: string;
    website?: string;
    email: string;
    ref?: string;
    created?: Date;
    updated?: Date;
}

export interface ICcRole extends IHateoasEntity {
    name: string;
    created: Date;
    updated: Date;
    ref?: string;
    system: boolean;
}

export interface ICcGroup extends IHateoasEntity {
    name: string;
    created?: Date;
    updated?: Date;
    ref?: string;
}

export interface ICcUser extends IHateoasEntity {
    email: string;
    firstname: string;
    lastname: string;
    active: boolean;
    token?: string;
    created?: Date;
    updated?: Date;
    oauth_provider?: string;
    oauth_id?: string;
}

export interface ICcInvitation extends IHateoasEntity {
    email: string;
    firstname?: string;
    lastname?: string;
    valid_until: number;
    created?: Date;
    updated?: Date;
}

export interface IServiceAction<T extends IHateoasEntity> {
    type: ServiceActionType;
    payload?: T[];
    background?: boolean;
    extras?: { [key: string]: any };
}

export interface ISimpleInvitation {
    people: ISimpleInvitationPerson[];
    groups: ICcGroup[];
    roles: ICcRole[];
    validUntil: number;
    unit: string;
}

export interface ISimpleInvitationPerson {
    email: string;
    firstname?: string;
    lastname?: string;
}

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

export interface ISsoApp {
    name: string;
    url: string;
    order: number;
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

export interface IVersionableEntity {
    readonly id?: string;
    readonly version_uuid?: string;
    readonly version_variation_date?: Date;
    readonly version_creation_date?: Date;
    readonly version_revision?: number;
}

export interface IAbstractContact extends IVersionableEntity {
    given_name?: string;
    additional_name?: string;
    family_name: string;
    name_prefix?: string;
    name_suffix?: string;
    note?: string;
    readonly full_name?: string;
    birthday?: string;
    photo?: any;
    owner?: string;
    emails?: IEmail[];
    extended_properties?: IExtendedProperty[];
    ims?: IIm[];
    socials?: ISocial[];
    organizations?: IOrganization[];
    phone_numbers?: IPhoneNumber[];
    postal_addresses?: IPostalAddress[];
}

export interface IPhoto {
    mime_type: string;
    content: string;
}

export interface IEmail {
    primary: boolean;
    address: string;
    label: string;
    display_name?: string;
    full_name?: string;
}

export interface IExtendedProperty {
    name: string;
    value: string;
    realm?: string;
}

export interface IIm {
    primary: boolean;
    address: string;
    protocol: string;
    label: string;
}

export interface ISocial {
    primary: boolean;
    address: string;
    protocol: string;
    label: string;
}

export interface IOrganization {
    primary: boolean;
    name: string;
    label: string;
    department?: string;
    job_description?: string;
    symbol?: string;
    title?: string;
    where?: string;
}

export interface IPhoneNumber {
    primary: boolean;
    uri: string;
    label: string;
    text?: string;
}

export interface IPostalAddress {
    primary: boolean;
    country: boolean;
    label: string;
    usage: string;
    mail_class: string;
    agent?: string;
    housename?: string;
    street?: string;
    pobox?: string;
    neighborhood?: string;
    city?: string;
    subregion?: string;
    region?: string;
    postcode?: string;
}

export interface IContact extends IAbstractContact {
    type: ContactType;
    visibility: ContactVisibility;
    labels?: string[];
}

export interface IProfile extends IAbstractContact {
    preferences: IProfilePreferences;
    company_id: string;
    locations?: ILocation[];
}

export interface ILocation {
    primary: boolean;
    latitude?: string;
    longitude?: string;
    country: string;
    city: string;
    address: string;
}

export interface IProfilePreferences {
    web_language: string;
    contact_language: string;
    timezone: string;
}

export interface ICountry {
    readonly id: string;
    readonly iso_code: string;
    readonly name: string;
}

export interface IDeletedVersion {
    readonly id: string;
    readonly version_uuid: string;
    readonly type: string;
    readonly deleted_at: Date;
    readonly deleted_by: string;
}

export interface ILabel extends IVersionableEntity {
    name: string;
    rel: string;
    type: LabelType;
    owner?: string;
    readonly is_system: boolean;
}

export interface ILabelEntity {
    entity: string;
    labels: ILabel[];
}

export interface ILocale {
    readonly id: string;
    readonly iso_code: string;
    readonly name: string;
}

export interface ITimezone {
    readonly id: string;
    readonly iso_code: string;
    readonly name: string;
}

export interface ISaveContactResult {
    data?: IContact;
    success: boolean;
    error?: any;
}

export interface ISaveProfileResult {
    data?: IProfile;
    success: boolean;
    error?: any;
}

export enum LabelType {
    SYSTEM,
    USER
}

export enum ContactType {
    COMPANY,
    PERSON
}

export enum ContactVisibility {
    PUBLIC,
    PRIVATE,
    BUSINESS_UNIT,
    GROUP,
    ROLE
}

export enum ServiceActionType {
    FIND,
    LIST,
    CREATE,
    UPDATE,
    DELETE,
    ADD,
    EDIT,
    VIEW,
    FOUNDED,
    LOADED,
    CREATED,
    UPDATED,
    DELETED,
    RELOAD
}
