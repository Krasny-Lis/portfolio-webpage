import { Routes } from '@angular/router';

import { SeoPageKey } from './core/services/translation.data';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    data: { seoKey: 'home' satisfies SeoPageKey, animation: 0 }
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
    data: { seoKey: 'about' satisfies SeoPageKey, animation: 1 }
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/skills/skills.component').then((m) => m.SkillsComponent),
    data: { seoKey: 'skills' satisfies SeoPageKey, animation: 2 }
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
    data: { seoKey: 'projects' satisfies SeoPageKey, animation: 3 }
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
    data: { seoKey: 'contact' satisfies SeoPageKey, animation: 4 }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
