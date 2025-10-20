import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';

import { ContentService } from '../../services/content.service';
import { ThemeService } from '../../services/theme.service';
import { DrawerDirective } from '../../../shared/directives/drawer.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgFor, NgIf, DrawerDirective],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private themeService = inject(ThemeService);
  private content = inject(ContentService);

  readonly theme = this.themeService.theme;
  readonly links$ = this.content.getSocialLinks().pipe(
    map((links) => links.filter((link) => link.url.startsWith('http')))
  );

  readonly modeLabel = computed(() => (this.theme() === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'));

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
