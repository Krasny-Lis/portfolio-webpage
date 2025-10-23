import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, HostBinding, HostListener, Inject } from '@angular/core';

const FOCUSABLE_SELECTORS =
  'a[href],a[routerLink],[routerLink],area[href],button:not([disabled]),input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

@Directive({
  selector: '[appDrawer]',
  standalone: true,
  exportAs: 'drawer',
})
export class DrawerDirective {
  private _open = false;
  private toggleElement: HTMLElement | null = null;
  private previouslyFocusedElement: HTMLElement | null = null;
  private focusAnimationFrameId: number | null = null;

  @HostBinding('class.open') get isOpen(): boolean {
    return this._open;
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    const next = !!value;

    if (next === this._open) {
      return;
    }

    this._open = next;

    if (next) {
      this.activateDrawer();
    } else {
      this.deactivateDrawer();
    }
  }

  @HostBinding('attr.aria-hidden') get ariaHidden(): string {
    return this._open ? 'false' : 'true';
  }

  @HostBinding('attr.role') get role(): string | null {
    return this._open ? 'dialog' : null;
  }

  @HostBinding('attr.aria-modal') get ariaModal(): string | null {
    return this._open ? 'true' : null;
  }

  @HostBinding('attr.tabindex') readonly tabindex = '-1';

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.el.nativeElement.setAttribute('data-drawer', 'true');
  }
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this._open) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.open = false;
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = this.getFocusableElements();

    if (!focusableElements.length) {
      event.preventDefault();
      this.el.nativeElement.focus();
      return;
    }

    const activeElement = this.document.activeElement as HTMLElement | null;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;

    if (event.shiftKey) {
      if (currentIndex <= 0) {
        event.preventDefault();
        lastElement.focus();
      }
      return;
    }

    if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private activateDrawer(): void {
    this.previouslyFocusedElement = this.document.activeElement as HTMLElement | null;
    this.toggleElement = this.findToggleElement() ?? this.toggleElement;
    this.scheduleFocus();
  }

  private deactivateDrawer(): void {
    this.cancelScheduledFocus();
    const target = this.toggleElement ?? this.previouslyFocusedElement;

    if (target && typeof target.focus === 'function') {
      target.focus();
    }

    this.previouslyFocusedElement = null;
  }

  private focusFirstElement(): void {
    const focusableElements = this.getFocusableElements();
    const firstLink = focusableElements.find((element) =>
      element.matches('a[href], a[routerLink]'),
    );

    if (firstLink) {
      firstLink.focus();
      return;
    }

    if (focusableElements.length) {
      focusableElements[0].focus();
      return;
    }

    this.el.nativeElement.focus();
  }

  private getFocusableElements(): HTMLElement[] {
    const elements = Array.from(
      this.el.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
    );

    return elements.filter((element) => !element.hasAttribute('disabled'));
  }

  private findToggleElement(): HTMLElement | null {
    const id = this.el.nativeElement.id;

    if (!id) {
      return null;
    }

    return this.document.querySelector<HTMLElement>(`[aria-controls="${id}"]`);
  }
  private scheduleFocus(): void {
    const view = this.document.defaultView ?? (typeof window !== 'undefined' ? window : null);

    if (this.focusAnimationFrameId !== null && view?.cancelAnimationFrame) {
      view.cancelAnimationFrame(this.focusAnimationFrameId);
      this.focusAnimationFrameId = null;
    }

    if (view?.requestAnimationFrame) {
      this.focusAnimationFrameId = view.requestAnimationFrame(() => {
        this.focusAnimationFrameId = null;

        if (!this._open) {
          return;
        }

        this.focusFirstElement();
      });
      return;
    }

    if (this._open) {
      this.focusFirstElement();
    }
  }

  private cancelScheduledFocus(): void {
    const view = this.document.defaultView ?? (typeof window !== 'undefined' ? window : null);

    if (this.focusAnimationFrameId !== null && view?.cancelAnimationFrame) {
      view.cancelAnimationFrame(this.focusAnimationFrameId);
    }

    this.focusAnimationFrameId = null;
  }
}
