import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

import { TranslationService } from '../../services/translation.service';

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
}

export type ContactStatus = 'idle' | 'pending' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  private document = inject(DOCUMENT);
  private translations = inject(TranslationService);

  readonly status = signal<ContactStatus>('idle');
  private hasError = signal(false);
  readonly errorMessage = computed(() =>
    this.hasError() ? this.translations.translations().contact.error : null,
  );

  send(payload: ContactFormPayload): void {
    this.status.set('pending');
    this.hasError.set(false);

    try {
      const mailto = this.createMailtoLink(payload);
      const defaultView = this.document?.defaultView;
      if (!defaultView?.location || typeof defaultView.location.assign !== 'function') {
        throw new Error('MAILTO_UNAVAILABLE');
      }

      defaultView.location.assign(mailto);
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
    const message = payload.message;
    const bodyLines = [
      `From: ${name} <${email}>`,
      `Consent granted: ${payload.consent ? 'yes' : 'no'}`,
      '',
      message,
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));

    return `mailto:sliwa.lis.krzysztof@gmail.com?subject=${subject}&body=${body}`;
  }
}
