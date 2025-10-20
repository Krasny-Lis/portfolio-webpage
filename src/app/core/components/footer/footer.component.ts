import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../../services/content.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  private content = inject(ContentService);
  private translations = inject(TranslationService);
  readonly year = new Date().getFullYear();
  readonly links$ = this.content.getSocialLinks();
  readonly t = this.translations.translations;
}
