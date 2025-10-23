import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  template: `
    <span
      class="chip"
      [class.chip--active]="active"
      [attr.role]="interactive ? 'button' : null"
      [attr.aria-pressed]="interactive ? active : null"
      [attr.tabindex]="interactive ? '0' : null"
      (click)="onToggle()"
      (keydown)="onKeydown($event)"
    >
      {{ label }}
    </span>
  `,
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input({ required: true }) label!: string;
  @Input() active = false;
  @Input() interactive = false;
  @Output() activeChange = new EventEmitter<boolean>();

  onToggle(): void {
    if (!this.interactive) {
      return;
    }

    this.active = !this.active;
    this.activeChange.emit(this.active);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.interactive) {
      return;
    }

    const key = event.key;

    if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
      event.preventDefault();
      this.onToggle();
    }
  }
}
