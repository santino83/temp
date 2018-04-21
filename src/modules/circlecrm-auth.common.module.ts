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
import {CirclecrmCoreModule} from "@circlecrm/circlecrm-core";

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
    ],
    imports: [
        CirclecrmCoreModule
    ]
})
export class CirclecrmAuthCommonModule {

}
