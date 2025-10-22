import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { environment } from '../../../environments/environment';
import { Project } from '../../core/models/content.models';
import { ContentService } from '../../core/services/content.service';
import { SectionComponent } from '../../shared/components/section/section.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';
import { TranslationService } from '../../core/services/translation.service';
import { AVAILABLE_TAGS, normalizeTagLabel } from './tag-utils';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SectionComponent, ProjectListComponent, TagFilterComponent, NgIf],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private content = inject(ContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private translations = inject(TranslationService);

  private allProjects = signal<Project[]>([]);
  readonly activeTags = signal<string[]>([]);

  readonly ownerView = environment.ownerView;
  readonly t = this.translations.translations;

  readonly projects$ = this.content
    .getProjects()
    .pipe(map((projects) => projects.filter((project) => this.ownerView || !project.private)));

  readonly filteredProjects = computed(() => {
    const projects = this.allProjects();
    const active = this.activeTags();

    if (!active.length) {
      return projects;
    }

    const normalizedActive = active.map((tag) => tag.toLowerCase());

    return projects.filter((project) => {
      const projectTags = project.tags.map((tag) => tag.toLowerCase());
      return normalizedActive.every((tag) => projectTags.includes(tag));
    });
  });

  readonly availableTags = computed(() => AVAILABLE_TAGS.slice());

  constructor() {
    this.projects$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((projects) => this.allProjects.set(projects));

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const tags = params.get('tags');
      if (!tags) {
        this.activeTags.set([]);
      } else {
        const parsed = tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => normalizeTagLabel(tag))
          .filter((tag): tag is string => Boolean(tag));

        this.activeTags.set(parsed);
      }
    });
  }

  toggleTag(tag: string): void {
    const normalizedTag = normalizeTagLabel(tag);

    if (!normalizedTag) {
      return;
    }

    const current = new Set(this.activeTags());

    if (current.has(normalizedTag)) {
      current.delete(normalizedTag);
    } else {
      current.add(normalizedTag);
    }

    this.updateQuery(Array.from(current));
  }

  clearTags(): void {
    this.updateQuery([]);
  }

  private updateQuery(tags: string[]): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tags: tags.length ? tags.join(',') : null },
      queryParamsHandling: 'merge',
    });
  }
}
