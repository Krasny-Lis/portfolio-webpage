import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ShellComponent } from './core/layout/shell.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<app-shell></app-shell>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private seo = inject(SeoService);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.findPrimaryRoute(this.activatedRoute);
        const data = route.snapshot.data as { title?: string; description?: string };
        if (data?.title && data?.description) {
          this.seo.update({ title: data.title, description: data.description });
        }
      });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Lisu – Angular Developer',
      url: 'https://lisu.dev',
      jobTitle: 'Frontend Engineer',
      knowsAbout: ['Angular', 'Signals', 'NgRx', 'SSR', 'RxJS']
    });
  }

  private findPrimaryRoute(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}
