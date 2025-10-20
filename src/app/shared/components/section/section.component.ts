import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-section',
  standalone: true,
  template: `
    <section class="section" [attr.aria-labelledby]="headingId">
      <div class="section__inner">
        <header *ngIf="title" class="section__header">
          <p class="section__eyebrow" *ngIf="eyebrow">{{ eyebrow }}</p>
          <h2 [id]="headingId">{{ title }}</h2>
          <p *ngIf="description" class="section__description">{{ description }}</p>
        </header>
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent {
  private static nextId = 0;

  @Input() title?: string;
  @Input() description?: string;
  @Input() eyebrow?: string;

  headingId = `section-${SectionComponent.nextId++}`;
}
