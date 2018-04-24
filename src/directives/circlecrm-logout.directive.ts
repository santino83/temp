import {Directive, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CirclecrmAuthenticationService} from "../services/index";

@Directive({
  selector: '[dirCircleCRMLogout]'
})
export class CirclecrmLogoutDirective implements OnChanges, OnInit {

  @Input() public iconClass = 'icon-logout';
  @Input() public text = '';

  public constructor(private el: ElementRef,
                     private authService: CirclecrmAuthenticationService) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.injectHtml();
  }

  public ngOnInit(): void {
    this.injectHtml();
  }

  @HostListener('click')
  public onClick() {
    this.authService.logout();
  }

  private injectHtml(): void {
    this.el.nativeElement.innerHTML = '<em class="' + this.iconClass + '"></em>' + this.text;
  }

}
