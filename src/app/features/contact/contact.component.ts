import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SectionComponent } from '../../shared/components/section/section.component';
import { ContactFacade } from '../../core/state/contact/contact.facade';

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

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    consent: [false, Validators.requiredTrue]
  });
  readonly copyFeedback = signal<string | null>(null);

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
          this.copyFeedback.set('Adres skopiowany 🎉');
          setTimeout(() => this.copyFeedback.set(null), 2000);
        })
        .catch(() => {
          this.copyFeedback.set('Nie udało się skopiować.');
        });
    }
  }

  ngOnDestroy(): void {
    this.facade.reset();
  }
}
