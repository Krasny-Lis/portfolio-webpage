import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CardComponent } from '../../shared/components/card/card.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SectionComponent, CardComponent, NgFor],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  private translations = inject(TranslationService);
  readonly t = this.translations.translations;
}
