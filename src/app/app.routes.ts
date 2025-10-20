import { Routes } from '@angular/router';

import { SeoPageKey } from './core/services/translation.data';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    data: { seoKey: 'home' satisfies SeoPageKey }
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
    data: { seoKey: 'about' satisfies SeoPageKey }
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/skills/skills.component').then((m) => m.SkillsComponent),
    data: { seoKey: 'skills' satisfies SeoPageKey }
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
    data: { seoKey: 'projects' satisfies SeoPageKey }
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
    data: { seoKey: 'contact' satisfies SeoPageKey }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
