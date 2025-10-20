import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { TranslationService } from '../../services/translation.service';

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

export type ContactStatus = 'idle' | 'pending' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  private http = inject(HttpClient);
  private translations = inject(TranslationService);

  readonly status = signal<ContactStatus>('idle');
  private hasError = signal(false);
  readonly errorMessage = computed(() => (this.hasError() ? this.translations.translations().contact.error : null));

  send(payload: ContactFormPayload) {
    this.status.set('pending');
    this.hasError.set(false);

    this.http
      .post(environment.contactEndpoint, payload)
      .pipe(
        catchError((err) => {
          this.hasError.set(true);
          console.error('Contact send failed', err);
          return of(null);
        }),
        finalize(() => {
          if (this.hasError()) {
            this.status.set('error');
          } else {
            this.status.set('success');
          }
        })
      )
      .subscribe();
  }

  reset(): void {
    this.status.set('idle');
    this.hasError.set(false);
  }
}
