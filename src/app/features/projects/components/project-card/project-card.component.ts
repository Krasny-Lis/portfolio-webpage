import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

import { Project } from '../../../../core/models/content.models';
import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [ChipComponent, NgFor, NgIf],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  @Input() ownerView = false;
  private translations = inject(TranslationService);
  readonly t = this.translations.translations;
}
