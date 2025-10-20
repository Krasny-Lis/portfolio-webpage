import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';

import { environment } from '../../../../environments/environment';

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

  readonly status = signal<ContactStatus>('idle');
  readonly errorMessage = signal<string | null>(null);

  send(payload: ContactFormPayload) {
    this.status.set('pending');
    this.errorMessage.set(null);

    this.http
      .post(environment.contactEndpoint, payload)
      .pipe(
        catchError((err) => {
          this.errorMessage.set('Coś poszło nie tak. Spróbuj ponownie.');
          console.error('Contact send failed', err);
          return of(null);
        }),
        finalize(() => {
          if (this.errorMessage()) {
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
    this.errorMessage.set(null);
  }
}
