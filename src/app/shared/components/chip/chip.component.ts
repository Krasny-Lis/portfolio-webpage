import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  template: `
    <span class="chip" [class.chip--active]="active" role="status">{{ label }}</span>
  `,
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
  @Input({ required: true }) label!: string;
  @Input() active = false;
}
