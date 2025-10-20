import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag-filter',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagFilterComponent {
  @Input() tags: string[] = [];
  @Input() active: string[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  onToggle(tag: string): void {
    this.toggle.emit(tag);
  }
}
