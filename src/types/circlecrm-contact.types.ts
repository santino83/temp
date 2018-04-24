import {InjectionToken} from '@angular/core';

export const CONTACTS_CONFIG: InjectionToken<string> = new InjectionToken<string>('CONTACTS_CONFIG');

export const STARRED_LABEL = 'http://schemas.voiptech.it/cc/2015#contact.starred';

export const CIRCLECRM_CONTACTS_BASE_URL = 'https://contacts.circlecrm.it/api';

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
  birthday?: Date;
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
