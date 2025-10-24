import { DOCUMENT } from '@angular/common';
import { Inject, Optional, Signal, computed, inject, Injectable, signal } from '@angular/core';

import { TranslationService } from '../../services/translation.service';

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactStatus = 'idle' | 'pending' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  private document: Document | null;
  private translationService: TranslationService;

  readonly status = signal<ContactStatus>('idle');
  private hasError = signal(false);
  readonly errorMessage: Signal<string | null>;

  constructor(
    @Optional() @Inject(DOCUMENT) document: Document | null,
    @Optional() translationService: TranslationService | null,
  ) {
    this.document = document ?? inject(DOCUMENT, { optional: true }) ?? null;
    this.translationService = translationService ?? inject(TranslationService);
    this.errorMessage = computed(() =>
      this.hasError() ? this.translationService.translations().contact.error : null,
    );
  }

  send(payload: ContactFormPayload): void {
    this.status.set('pending');
    this.hasError.set(false);

    try {
      const mailto = this.createMailtoLink(payload);
      const defaultView = this.document?.defaultView ?? null;
      const globalWindow =
        typeof globalThis !== 'undefined'
          ? ((globalThis as typeof globalThis & { window?: Window }).window ??
            (globalThis as unknown as Window | null))
          : null;

      const candidates = [defaultView, globalWindow].filter(Boolean) as Window[];
      const targetWindow = candidates.find((candidate) => typeof candidate.open === 'function');

      if (!targetWindow) {
        throw new Error('MAILTO_UNAVAILABLE');
      }

      const opener =
        typeof targetWindow.open === 'function' ? targetWindow.open(mailto, '_self') : null;

      if (!opener) {
        throw new Error('MAILTO_UNAVAILABLE');
      }

      this.status.set('success');
    } catch (err) {
      this.hasError.set(true);
      console.error('Contact send failed', err);
      this.status.set('error');
    }
  }

  reset(): void {
    this.status.set('idle');
    this.hasError.set(false);
  }

  private createMailtoLink(payload: ContactFormPayload): string {
    const subject = encodeURIComponent(payload.subject.trim());
    const name = payload.name.trim();
    const email = payload.email.trim();
    const message = payload.message.trim();
    const bodyLines = [`From: ${name} <${email}>`, '', message];
    const body = encodeURIComponent(bodyLines.join('\n'));

    return `mailto:sliwa.lis.krzysztof@gmail.com?subject=${subject}&body=${body}`;
  }
}
