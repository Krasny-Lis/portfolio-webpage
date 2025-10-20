import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

import { Project } from '../../../../core/models/content.models';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [ProjectCardComponent, NgFor, NgIf, SlicePipe],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent {
  private _projects: Project[] = [];
  readonly visibleCount = signal(6);

  @Input() ownerView = false;

  @Input()
  set projects(projects: Project[]) {
    this._projects = projects;
    this.visibleCount.set(6);
  }

  get projects(): Project[] {
    return this._projects;
  }

  showMore(): void {
    this.visibleCount.update((value) => Math.min(value + 6, this._projects.length));
  }
}
