import {ICcGroup, ICcUnit, ICcUser, IHateoasLink} from '../circlecrm-auth.types';

export function get_unit_id(entity: ICcUser | ICcGroup): string | null {
    if (entity._links && ('unit' in entity._links)) {
        return (entity._links.unit as IHateoasLink).ref_id || '';
    }

    return null;
}

export function get_groups_id(entity: ICcUser): string[] {
    if (entity._links && ('group' in entity._links)) {
        return (entity._links.group as IHateoasLink[]).map((link) => link.ref_id!);
    }

    return [];
}

export function get_roles_id(entity: ICcUser): string[] {
    if (entity._links && ('role' in entity._links)) {
        return (entity._links.role as IHateoasLink[]).map((link) => link.ref_id!);
    }

    return [];
}

export function get_parent_unit_id(entity: ICcUnit): string | null {
    if (entity._links && ('parent' in entity._links)) {
        return (entity._links.parent as IHateoasLink).ref_id || '';
    }

    return null;
}
