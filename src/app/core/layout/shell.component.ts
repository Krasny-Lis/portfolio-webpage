import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BackToTopComponent } from '../components/back-to-top/back-to-top.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, FooterComponent, BackToTopComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="shell__content" [@routeAnimations]="prepareRoute(outlet)" aria-live="polite">
      <router-outlet #outlet="outlet"></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-back-to-top></app-back-to-top>
  `,
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routeAnimations', [
      transition(':increment', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%'
          })
        ], { optional: true }),
        query(':enter', [style({ transform: 'translateX(100%)', opacity: 0 })], { optional: true }),
        query(':leave', [style({ transform: 'translateX(0)', opacity: 1 })], { optional: true }),
        group([
          query(':leave', [
            animate('550ms cubic-bezier(0.22, 0.61, 0.36, 1)', style({ transform: 'translateX(-20%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('550ms cubic-bezier(0.22, 0.61, 0.36, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ]),
      transition(':decrement', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%'
          })
        ], { optional: true }),
        query(':enter', [style({ transform: 'translateX(-100%)', opacity: 0 })], { optional: true }),
        query(':leave', [style({ transform: 'translateX(0)', opacity: 1 })], { optional: true }),
        group([
          query(':leave', [
            animate('550ms cubic-bezier(0.22, 0.61, 0.36, 1)', style({ transform: 'translateX(20%)', opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            animate('550ms cubic-bezier(0.22, 0.61, 0.36, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class ShellComponent {
  protected prepareRoute(outlet: RouterOutlet): number | null {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'] !== undefined
      ? (outlet.activatedRouteData['animation'] as number)
      : null;
  }
}
