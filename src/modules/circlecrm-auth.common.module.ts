import {CirclecrmCheckAccessPipe} from "../pipes/circlecrm-check-access.pipe";
import {CirclecrmFindGroupDirective, CirclecrmFindRoleDirective, CirclecrmFindUnitDirective} from "../directives/index";
import {NgModule} from "@angular/core";
import {
    CirclecrmCompanyWidget,
    CirclecrmGroupsWidget,
    CirclecrmInvitationsWidget,
    CirclecrmRolesWidget,
    CirclecrmUnitsWidget,
    CirclecrmUsersWidget
} from "../widgets/index";
import {CirclecrmCoreModule} from "@circlecrm/circlecrm-core";
import {CirclecrmContactsCommonModule} from "./circlecrm-contacts-common.module";

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
        CirclecrmUnitsWidget,
        CirclecrmUsersWidget
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
        CirclecrmUnitsWidget,
        CirclecrmUsersWidget
    ],
    imports: [
        CirclecrmCoreModule,
        CirclecrmContactsCommonModule
    ]
})
export class CirclecrmAuthCommonModule {

}
