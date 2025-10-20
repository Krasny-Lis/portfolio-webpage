import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SectionComponent } from '../../shared/components/section/section.component';
import { ContactFacade } from '../../core/state/contact/contact.facade';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SectionComponent, ReactiveFormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  readonly facade = inject(ContactFacade);
  private translations = inject(TranslationService);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, Validators.requiredTrue]
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
      if (this.facade.status() === 'success') {
        this.form.reset();
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.facade.status() === 'pending') {
      this.form.markAllAsTouched();
      return;
    }

    this.facade.send(this.form.getRawValue());
  }

  copyEmail(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText('hello@lisu.dev')
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
