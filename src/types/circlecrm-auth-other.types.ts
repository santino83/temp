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
