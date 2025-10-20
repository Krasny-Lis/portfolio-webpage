import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface SeoMetadata {
  title: string;
  description: string;
  ogImage?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private document = inject(DOCUMENT);

  init(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        // no-op placeholder, metadata provided via route data
      });
  }

  update(metadata: SeoMetadata): void {
    const { title, description, ogImage } = metadata;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    if (ogImage) {
      this.meta.updateTag({ property: 'og:image', content: ogImage });
    }
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  setStructuredData(jsonLd: Record<string, unknown>): void {
    const head = this.document.head;
    const existing = head.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
    const script = existing ?? (this.document.createElement('script') as HTMLScriptElement);
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd, null, 2);
    if (!existing) {
      head.appendChild(script);
    }
  }
}
