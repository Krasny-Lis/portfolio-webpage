import { ChangeDetectorRef, DestroyRef, Pipe, PipeTransform, effect, inject } from '@angular/core';

import { SkillLevel } from '../../core/models/content.models';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'skillLevel',
  standalone: true,
  pure: false
})
export class SkillLevelPipe implements PipeTransform {
  private translations = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    const cleanup = effect(() => {
      this.translations.language();
      this.cdr.markForCheck();
    });
    this.destroyRef.onDestroy(() => cleanup.destroy());
  }

  transform(level: SkillLevel): string {
    return this.translations.translations().skills.levels[level] ?? level;
  }
}
