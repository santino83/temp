import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ContactType, IPhoto} from '../types/circlecrm-contact.types';

@Directive({
    selector: '[dirCircleCRMPhotoProfile]'
})
export class CirclecrmPhotoProfileDirective implements OnChanges {

    @Input() public photo: IPhoto | null = null;
    @Input() public type: ContactType = ContactType.PERSON;
    @Input() public defaultImage = 'assets/images/nophoto.jpg';

    public constructor(private el: ElementRef) {
    }

    public ngOnChanges(changes: SimpleChanges): void {

        const index = this.defaultImage.lastIndexOf('.');

        let src = this.defaultImage.substring(0, index) + '_' +
            (this.type === ContactType.PERSON ? 'person' : 'company') +
            this.defaultImage.substring(index);

        if (this.hasPhoto()) {
            src = 'data:' + this.photo!.mime_type + ';base64,' + this.photo!.content;
        }

        (this.el.nativeElement as HTMLImageElement).src = src;

    }

    private hasPhoto(): boolean {
        return null !== this.photo && this.photo.content !== '' && this.photo.mime_type !== '';
    }

}
