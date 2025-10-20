import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CardComponent } from '../../shared/components/card/card.component';
import { SectionComponent } from '../../shared/components/section/section.component';

interface ValueItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SectionComponent, CardComponent, NgFor],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  readonly values: ValueItem[] = [
    {
      title: 'Transparentna współpraca',
      description: 'Komunikuję się jasno i otwarcie. Sprawnie łączę perspektywę produktową z techniczną.'
    },
    {
      title: 'Dbałość o szczegóły',
      description: 'Projektuję architekturę komponentów pod skalowalność i testowalność. Dbam o dostępność i wydajność.'
    },
    {
      title: 'Dowozzę',
      description: 'Bazuję na zwinnych iteracjach, szybkim feedbacku i automatyzacji – od CI/CD po testy.'
    }
  ];

  readonly highlights = [
    {
      label: '95+',
      note: 'Lighthouse (Performance, A11y, Best practices, SEO)'
    },
    {
      label: '5+',
      note: 'Lat doświadczenia komercyjnego'
    },
    {
      label: '12',
      note: 'Zrealizowanych projektów jako lead / senior'
    }
  ];
}
