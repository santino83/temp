import {NgModule} from '@angular/core';
import {CirclecrmCoreModule} from '@circlecrm/circlecrm-core';
import {CirclecrmProfileInfoComponent} from "../components/index";
import {CirclecrmLogoutDirective, CirclecrmPhotoProfileDirective} from "../directives/index";
import {InfiniteScrollModule} from "ngx-infinite-scroll";

@NgModule({
    declarations: [
        CirclecrmProfileInfoComponent,
        CirclecrmPhotoProfileDirective,
        CirclecrmLogoutDirective
    ],
    exports: [
        CirclecrmPhotoProfileDirective,
        CirclecrmProfileInfoComponent,
        CirclecrmLogoutDirective,
        InfiniteScrollModule
    ],
    imports: [
        CirclecrmCoreModule,
        InfiniteScrollModule
    ]
})
export class CirclecrmContactsCommonModule {

}
