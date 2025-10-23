import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { TranslationService } from './translation.service';
import { SeoPageKey } from './translation.data';

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
  private translations = inject(TranslationService);
  private initialized = false;
  private currentRoute: ActivatedRoute | null = null;

  init(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.findPrimaryRoute(this.router.routerState.root);
        this.currentRoute = route;
        this.applySeo(route);
      });

    effect(() => {
      this.translations.language();
      const route = this.currentRoute ?? this.findPrimaryRoute(this.router.routerState.root);
      this.applySeo(route);
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
    const script = existing ?? this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd, null, 2);
    if (!existing) {
      head.appendChild(script);
    }
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
      this.update(seo);
    }
  }
}
