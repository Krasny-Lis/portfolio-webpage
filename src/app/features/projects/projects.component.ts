import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { environment } from '../../../environments/environment';
import { Project } from '../../core/models/content.models';
import { ContentService } from '../../core/services/content.service';
import { SectionComponent } from '../../shared/components/section/section.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SectionComponent, ProjectListComponent, TagFilterComponent, NgIf],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
  private content = inject(ContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private allProjects = signal<Project[]>([]);
  readonly activeTags = signal<string[]>([]);

  readonly ownerView = environment.ownerView;

  readonly projects$ = this.content
    .getProjects()
    .pipe(map((projects) => projects.filter((project) => this.ownerView || !project.private)));

  readonly filteredProjects = computed(() => {
    const projects = this.allProjects();
    const active = this.activeTags();
    if (!active.length) {
      return projects;
    }
    return projects.filter((project) => active.every((tag) => project.tags.includes(tag)));
  });

  readonly availableTags = computed(() => {
    const tags = new Set<string>();
    this.allProjects().forEach((project) => project.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  });

  constructor() {
    this.projects$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((projects) => this.allProjects.set(projects));

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const tags = params.get('tags');
      if (!tags) {
        this.activeTags.set([]);
      } else {
        this.activeTags.set(
          tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        );
      }
    });
  }

  toggleTag(tag: string): void {
    const current = new Set(this.activeTags());
    if (current.has(tag)) {
      current.delete(tag);
    } else {
      current.add(tag);
    }
    this.updateQuery(Array.from(current));
  }

  clearTags(): void {
    this.updateQuery([]);
  }

  private updateQuery(tags: string[]): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tags: tags.length ? tags.join(',') : null },
      queryParamsHandling: 'merge'
    });
  }
}
