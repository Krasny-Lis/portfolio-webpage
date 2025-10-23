import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ShellComponent } from './core/layout/shell.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<app-shell></app-shell>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private seo = inject(SeoService);

  constructor() {
    this.seo.init();

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Lisu - Angular Developer',
      url: 'https://lisu.dev',
      jobTitle: 'Frontend Engineer',
      knowsAbout: ['Angular', 'Signals', 'NgRx', 'SSR', 'RxJS'],
    });
  }
}
