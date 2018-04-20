import {CirclecrmCheckAccessPipe} from "../pipes/circlecrm-check-access.pipe";
import {CirclecrmFindGroupDirective, CirclecrmFindRoleDirective, CirclecrmFindUnitDirective} from "../directives/index";
import {NgModule} from "@angular/core";
import {
    CirclecrmCompanyWidget,
    CirclecrmGroupsWidget,
    CirclecrmInvitationsWidget,
    CirclecrmRolesWidget,
    CirclecrmUnitsWidget
} from "../widgets/index";

@NgModule({
    declarations: [
        // pipes
        CirclecrmCheckAccessPipe,
        // directives
        CirclecrmFindRoleDirective,
        CirclecrmFindGroupDirective,
        CirclecrmFindUnitDirective,
        // widgets
        CirclecrmCompanyWidget,
        CirclecrmGroupsWidget,
        CirclecrmInvitationsWidget,
        CirclecrmRolesWidget,
        CirclecrmUnitsWidget
    ],
    exports: [
        // pipes
        CirclecrmCheckAccessPipe,
        // directives
        CirclecrmFindRoleDirective,
        CirclecrmFindGroupDirective,
        CirclecrmFindUnitDirective,
        // widgets
        CirclecrmCompanyWidget,
        CirclecrmGroupsWidget,
        CirclecrmInvitationsWidget,
        CirclecrmRolesWidget,
        CirclecrmUnitsWidget
    ]
})
export class CirclecrmAuthCommonModule {

}
