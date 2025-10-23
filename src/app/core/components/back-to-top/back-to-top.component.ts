import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DestroyRef } from '@angular/core';

import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [NgIf],
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent {
  readonly visible = signal(false);
  private destroyRef = inject(DestroyRef);
  private translations = inject(TranslationService);
  readonly t = this.translations.translations;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    const requestFrame =
      typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame.bind(window)
        : undefined;
    const cancelFrame =
      typeof window.cancelAnimationFrame === 'function'
        ? window.cancelAnimationFrame.bind(window)
        : undefined;
    const usingAnimationFrame = Boolean(requestFrame);
    let frameHandle: number | null = null;
    let lastKnownScrollY = window.scrollY;

    const updateVisibility: FrameRequestCallback = () => {
      frameHandle = null;
      this.visible.set(lastKnownScrollY > 400);
    };

    const scheduleUpdate = () => {
      if (frameHandle !== null) {
        return;
      }

      if (requestFrame) {
        frameHandle = requestFrame(updateVisibility);
      } else {
        frameHandle = window.setTimeout(() => updateVisibility(0), 16);
      }
    };

    const listener = () => {
      lastKnownScrollY = window.scrollY;
      scheduleUpdate();
    };

    updateVisibility(0);
    window.addEventListener('scroll', listener, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', listener);
      if (frameHandle !== null) {
        if (usingAnimationFrame && cancelFrame) {
          cancelFrame(frameHandle);
        } else if (!usingAnimationFrame) {
          window.clearTimeout(frameHandle);
        }
      }
    });
  }

  scrollTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
