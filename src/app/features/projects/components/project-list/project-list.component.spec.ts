import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListComponent } from './project-list.component';
import { Project } from '../../../../core/models/content.models';

const buildProjects = (count: number): Project[] =>
  Array.from({ length: count }).map((_, index) => ({
    id: `${index}`,
    name: `Project ${index}`,
    description: 'Demo',
    tags: ['angular']
  }));

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
  });

  it('should show six projects by default', () => {
    component.projects = buildProjects(10);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-project-card');
    expect(cards.length).toBe(6);
  });

  it('should increase visible projects when showMore is called', () => {
    component.projects = buildProjects(8);
    component.showMore();
    expect(component.visibleCount()).toBe(8);
  });
});
