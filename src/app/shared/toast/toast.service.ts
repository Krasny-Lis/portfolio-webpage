import { Injectable, NgZone, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { ToastComponent, ToastVariant } from './toast.component';

export interface ToastConfig {
  duration?: number;
  variant?: ToastVariant;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private overlay = inject(Overlay);
  private zone = inject(NgZone);

  private activeRef: OverlayRef | null = null;
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  show(message: string, config: ToastConfig = {}): void {
    const { duration = 4000, variant = 'default' } = config;

    this.disposeActive();

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global().centerHorizontally().bottom('32px'),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: ['app-toast-panel'],
    });

    const portal = new ComponentPortal(ToastComponent);
    const componentRef = overlayRef.attach(portal);
    componentRef.instance.message = message;
    componentRef.instance.variant = variant;
    componentRef.changeDetectorRef.detectChanges();

    this.activeRef = overlayRef;

    overlayRef.detachments().subscribe(() => {
      if (this.activeRef === overlayRef) {
        this.clearHideTimeout();
        this.activeRef = null;
      }
    });

    if (duration > 0) {
      this.zone.runOutsideAngular(() => {
        this.hideTimeoutId = setTimeout(() => {
          this.zone.run(() => {
            if (this.activeRef === overlayRef) {
              overlayRef.dispose();
            }
          });
        }, duration);
      });
    }
  }

  dismiss(): void {
    this.disposeActive();
  }

  private disposeActive(): void {
    this.clearHideTimeout();
    if (this.activeRef) {
      this.activeRef.dispose();
      this.activeRef = null;
    }
  }

  private clearHideTimeout(): void {
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }
}
