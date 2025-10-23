import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';

import { ContentService } from '../../services/content.service';
import { ThemeService } from '../../services/theme.service';
import { DrawerDirective } from '../../../shared/directives/drawer.directive';
import { TranslationService } from '../../services/translation.service';
import { Language } from '../../services/translation.data';
import { trackByLabel } from '../../../shared/utils/track-by';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgFor, NgIf, DrawerDirective],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
  private content = inject(ContentService);
  private translations = inject(TranslationService);
  protected readonly trackByLabel = trackByLabel;

  readonly theme = this.themeService.theme;
  readonly links$ = this.content
    .getSocialLinks()
    .pipe(map((links) => links.filter((link) => link.url.startsWith('http'))));
  readonly t = this.translations.translations;
  readonly language = this.translations.language;
  readonly availableLanguages: Language[] = ['en', 'pl'];
  readonly languageIndex = computed(() =>
    Math.max(0, this.availableLanguages.indexOf(this.language())),
  );

  readonly modeLabel = computed(() =>
    this.theme() === 'dark' ? this.t().navbar.themeToggle.light : this.t().navbar.themeToggle.dark,
  );

  toggleTheme(): void {
    this.themeService.toggle();
  }

  setLanguage(lang: Language): void {
    if (this.language() === lang) {
      this.translations.toggleLanguage();
      return;
    }

    this.translations.setLanguage(lang);
  }
}
