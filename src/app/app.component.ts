import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { ShellComponent } from './core/layout/shell.component';
import { SeoService } from './core/services/seo.service';
import { TranslationService } from './core/services/translation.service';
import { SeoPageKey } from './core/services/translation.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<app-shell></app-shell>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private translations = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private currentRoute: ActivatedRoute | null = null;

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        const route = this.findPrimaryRoute(this.activatedRoute);
        this.currentRoute = route;
        this.applySeo(route);
      });

    effect(() => {
      this.translations.language();
      const route = this.currentRoute ?? this.findPrimaryRoute(this.activatedRoute);
      this.applySeo(route);
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Lisu - Angular Developer',
      url: 'https://lisu.dev',
      jobTitle: 'Frontend Engineer',
      knowsAbout: ['Angular', 'Signals', 'NgRx', 'SSR', 'RxJS'],
    });
  }

  private findPrimaryRoute(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }

  private applySeo(route: ActivatedRoute): void {
    const data = route.snapshot.data as { seoKey?: SeoPageKey };
    if (!data?.seoKey) {
      return;
    }
    const seo = this.translations.translations().seo[data.seoKey];
    if (seo) {
      this.seo.update(seo);
    }
  }
}
