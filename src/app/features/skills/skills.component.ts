import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CardComponent } from '../../shared/components/card/card.component';
import { SectionComponent } from '../../shared/components/section/section.component';
import { SkillLevelPipe } from '../../shared/pipes/skill-level.pipe';
import { ContentService } from '../../core/services/content.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [SectionComponent, CardComponent, NgFor, NgIf, AsyncPipe, SkillLevelPipe],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsComponent {
  private content = inject(ContentService);
  private translations = inject(TranslationService);
  readonly skills$ = this.content.getSkills();
  readonly t = this.translations.translations;
}
