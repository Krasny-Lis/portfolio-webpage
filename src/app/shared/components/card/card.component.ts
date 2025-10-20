import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgIf],
  template: `
    <article class="card" [class.card--clickable]="clickable">
      <header *ngIf="title" class="card__header">
        <h3>{{ title }}</h3>
        <p *ngIf="subtitle" class="card__subtitle">{{ subtitle }}</p>
      </header>
      <ng-content></ng-content>
    </article>
  `,
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() clickable = false;
}
