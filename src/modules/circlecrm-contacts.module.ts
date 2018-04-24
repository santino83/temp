import {ModuleWithProviders, NgModule} from '@angular/core';
import {CIRCLECRM_CONTACTS_BASE_URL, CONTACTS_CONFIG} from '../types/index';
import {HttpClientModule} from '@angular/common/http';
import {CirclecrmContactsCommonModule} from "./circlecrm-contacts-common.module";
import {
    CirclecrmContactService,
    CirclecrmCountryService,
    CirclecrmLabelService,
    CirclecrmLocaleService,
    CirclecrmProfileService,
    CirclecrmTimezoneService
} from "../services/index";

@NgModule({
    exports: [
        CirclecrmContactsCommonModule
    ],
    imports: [
        HttpClientModule,
        CirclecrmContactsCommonModule
    ]
})
export class CirclecrmContactsModule {

    public static forRoot(remoteUrl?: string): ModuleWithProviders {
        return {
            ngModule: CirclecrmContactsModule,
            providers: [
                {
                    provide: CONTACTS_CONFIG,
                    useValue: remoteUrl || CIRCLECRM_CONTACTS_BASE_URL
                },
                CirclecrmContactService,
                CirclecrmCountryService,
                CirclecrmLabelService,
                CirclecrmLocaleService,
                CirclecrmProfileService,
                CirclecrmTimezoneService
            ]
        };
    }

}
