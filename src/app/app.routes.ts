import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    data: {
      title: 'Lisu – Angular Developer',
      description: 'Portfolio Angular Developera: projekty, umiejętności, kontakt. SSR, Signals, NgRx.'
    }
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
    data: {
      title: 'O mnie – Lisu.dev',
      description: 'Poznaj wartości i doświadczenie Angular Developera skoncentrowanego na jakości.'
    }
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/skills/skills.component').then((m) => m.SkillsComponent),
    data: {
      title: 'Umiejętności Angular – Signals, SSR, NgRx',
      description: 'Kompetencje frontendowe: Angular 19, RxJS, testy, narzędzia. Gotowe do działania w Twoim projekcie.'
    }
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
    data: {
      title: 'Projekty Angular – portfolio',
      description: 'Wybrane projekty Angularowe: publiczne demo, case’y pod NDA, audyty wydajności.'
    }
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
    data: {
      title: 'Kontakt – współpraca Angular',
      description: 'Napisz wiadomość lub umów konsultację. Formularz z walidacją i potwierdzeniem wysyłki.'
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
