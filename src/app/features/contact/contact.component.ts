import { NgIf, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { SectionComponent } from '../../shared/components/section/section.component';
import { ContactFacade, ContactStatus } from '../../core/state/contact/contact.facade';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SectionComponent, ReactiveFormsModule, NgIf, MatSnackBarModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  readonly facade = inject(ContactFacade);
  private translations = inject(TranslationService);
  private snackBar = inject(MatSnackBar);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private lastStatus: ContactStatus | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });
  readonly t = this.translations.translations;
  readonly copyFeedbackState = signal<'success' | 'error' | null>(null);
  readonly copyFeedbackMessage = computed(() => {
    const state = this.copyFeedbackState();
    if (state === 'success') {
      return this.t().contact.copySuccess;
    }
    if (state === 'error') {
      return this.t().contact.copyError;
    }
    return null;
  });

  constructor() {
    effect(() => {
      const status = this.facade.status();
      if (status === 'success') {
        this.form.reset({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }
      if (status === 'error' && this.lastStatus !== 'error' && this.isBrowser) {
        const message = this.facade.errorMessage();
        if (message) {
          this.snackBar.open(message, undefined, {
            duration: 4000,
            panelClass: ['snackbar-error'],
          });
        }
      }
      this.lastStatus = status;
    });
  }

  submit(): void {
    if (this.form.invalid || this.facade.status() === 'pending') {
      this.form.markAllAsTouched();
      if (this.form.invalid && this.isBrowser) {
        this.snackBar.open(this.t().contact.invalidForm, undefined, {
          duration: 4000,
          panelClass: ['snackbar-error'],
        });
      }
      return;
    }

    this.facade.send(this.form.getRawValue());
  }

  copyEmail(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText('sliwa.lis.krzysztof@gmail.com')
        .then(() => {
          this.copyFeedbackState.set('success');
          setTimeout(() => this.copyFeedbackState.set(null), 2000);
        })
        .catch(() => {
          this.copyFeedbackState.set('error');
          setTimeout(() => this.copyFeedbackState.set(null), 2000);
        });
    }
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }
}
