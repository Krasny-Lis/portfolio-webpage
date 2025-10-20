import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SectionComponent } from '../../shared/components/section/section.component';
import { ContentService } from '../../core/services/content.service';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SectionComponent, RouterLink, NgFor, NgIf, AsyncPipe, ChipComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private content = inject(ContentService);
  private translations = inject(TranslationService);
  readonly social$ = this.content.getSocialLinks();
  readonly t = this.translations.translations;
}
