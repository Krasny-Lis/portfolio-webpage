import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDrawer]',
  standalone: true,
  exportAs: 'drawer'
})
export class DrawerDirective {
  @HostBinding('class.open') open = false;
  @HostBinding('attr.aria-hidden') get ariaHidden(): string {
    return this.open ? 'false' : 'true';
  }

  constructor(private el: ElementRef<HTMLElement>) {
    this.el.nativeElement.setAttribute('data-drawer', 'true');
  }
}
