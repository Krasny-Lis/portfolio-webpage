import { SkillLevel } from '../models/content.models';

export type Language = 'en' | 'pl';

interface NavLink {
  path: string;
  label: string;
}

interface ValueItem {
  title: string;
  description: string;
}

interface HighlightItem {
  label: string;
  note: string;
}

interface SeoEntry {
  title: string;
  description: string;
}

export interface AppTranslations {
  languageNames: Record<Language, string>;
  navbar: {
    ariaLabel: string;
    menuLabel: string;
    links: NavLink[];
    themeToggle: {
      light: string;
      dark: string;
    };
    languageSwitcher: {
      label: string;
      options: Record<Language, string>;
    };
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    hero: string;
    ctaProjects: string;
    ctaContact: string;
    tags: string[];
    socialIntro: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    values: ValueItem[];
    highlights: HighlightItem[];
  };
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    levels: Record<SkillLevel, string>;
  };
  projects: {
    eyebrow: string;
    title: string;
    description: string;
    filterLabel: string;
    filterAll: string;
    showMore: string;
    empty: string;
    badges: {
      draft: string;
      private: string;
    };
    links: {
      demo: string;
      repo: string;
    };
    hintPrivate: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    nameLabel: string;
    nameError: string;
    emailLabel: string;
    emailError: string;
    subjectLabel: string;
    subjectError: string;
    messageLabel: string;
    messageError: string;
    consentLabel: string;
    consentError: string;
    submit: string;
    success: string;
    error: string;
    invalidForm: string;
    otherChannels: string;
    copy: string;
    copySuccess: string;
    copyError: string;
  };
  footer: {
    linksLabel: string;
    copyright: string;
  };
  backToTop: string;
  seo: Record<'home' | 'about' | 'skills' | 'projects' | 'contact', SeoEntry>;
}

export type SeoPageKey = keyof AppTranslations['seo'];

export const TRANSLATIONS: Record<Language, AppTranslations> = {
  en: {
    languageNames: {
      en: 'English',
      pl: 'Polish',
    },
    navbar: {
      ariaLabel: 'Primary navigation',
      menuLabel: 'Menu',
      links: [
        { path: '/about', label: 'About' },
        { path: '/skills', label: 'Skills' },
        { path: '/projects', label: 'Projects' },
        { path: '/contact', label: 'Contact' },
      ],
      themeToggle: {
        light: 'Switch to light mode',
        dark: 'Switch to dark mode',
      },
      languageSwitcher: {
        label: 'Language',
        options: {
          en: 'English',
          pl: 'Polski',
        },
      },
    },
    home: {
      eyebrow: 'Hello',
      title: 'Krzysztof Śliwa - Angular Developer',
      description: 'I build fast, accessible Angular apps and help teams ship reliable products.',
      hero: 'Signals, SSR, NgRx, testing. Everything so users feel at home and the business sleeps well.',
      ctaProjects: 'See projects',
      ctaContact: 'Get in touch',
      tags: ['Angular 19', 'SSR', 'NgRx', 'Signals', 'A11y'],
      socialIntro: 'Find me also on:',
    },
    about: {
      eyebrow: 'Who I am',
      title: 'Angular Developer focused on quality',
      description:
        'I build accessible, testable Angular apps with Signals, NgRx and SSR - fast, stable and easy to change.',
      values: [
        {
          title: 'Transparent collaboration',
          description:
            'Clear, open communication. I connect product and engineering perspectives effortlessly.',
        },
        {
          title: 'Architecture that scales',
          description:
            'Components built for testability and accessibility. Less debt, fewer regressions, calmer changes.',
        },
        {
          title: 'Predictable releases',
          description: 'Agile iterations, fast feedback and automation - from CI/CD to testing.',
        },
      ],
      highlights: [
        { label: '5+', note: 'Years of commercial experience' },
        { label: '5+', note: 'Releases delivered end-to-end' },
        { label: '40+', note: 'Songs learned' },
      ],
    },
    skills: {
      eyebrow: 'Stack',
      title: 'Skills',
      description: 'Frontend expertise blended with an engineering approach to quality.',
      levels: {
        core: 'Core',
        pro: 'Pro',
        familiar: 'Familiar',
      },
    },
    projects: {
      eyebrow: 'Portfolio',
      title: 'Projects',
      description: 'Selected work - public demos',
      filterLabel: 'Project filter',
      filterAll: 'All',
      showMore: 'Show more projects',
      empty: 'No projects match the selected filters.',
      badges: {
        draft: 'In progress',
        private: 'Private',
      },
      links: {
        demo: 'Demo',
        repo: 'GitHub',
      },
      hintPrivate: 'Repository hidden (NDA)',
    },
    contact: {
      eyebrow: 'Contact',
      title: "Let's talk",
      nameLabel: 'Name',
      nameError: 'Please enter your name.',
      emailLabel: 'Email',
      emailError: 'Provide a valid email address.',
      subjectLabel: 'Subject',
      subjectError: 'Please enter a subject.',
      messageLabel: 'Message',
      messageError: 'Message should be at least 10 characters long.',
      consentLabel: 'I agree to be contacted according to the privacy policy.',
      consentError: 'Consent is required.',
      submit: 'Send',
      success: "Thanks! I'll get back to you soon.",
      error: 'Something went wrong. Please try again.',
      invalidForm: 'Please correct the errors in the form before submitting.',
      otherChannels: 'Other channels',
      copy: 'Copy',
      copySuccess: 'Address copied 🎉',
      copyError: 'Unable to copy address.',
    },
    footer: {
      linksLabel: 'Social links',
      copyright: 'Krzysztof Śliwa - Angular Developer',
    },
    backToTop: 'Back to top',
    seo: {
      home: {
        title: 'Krzysztof Śliwa - Angular Developer',
        description: 'Angular developer portfolio: projects, skills, contact. SSR, Signals, NgRx.',
      },
      about: {
        title: 'About - Krzysztof Śliwa',
        description: 'Learn about the values and experience of a quality-driven Angular developer.',
      },
      skills: {
        title: 'Angular skills - Signals, SSR, NgRx',
        description:
          'Frontend competencies: Angular 19, RxJS, testing, tooling. Ready to power your project.',
      },
      projects: {
        title: 'Angular projects - portfolio',
        description:
          'Selected Angular projects: public demos, NDA case studies, performance audits.',
      },
      contact: {
        title: 'Contact - Angular collaboration',
        description:
          'Send a message or schedule a consultation. Validated form with delivery confirmation.',
      },
    },
  },
  pl: {
    languageNames: {
      en: 'English',
      pl: 'Polski',
    },
    navbar: {
      ariaLabel: 'Nawigacja główna',
      menuLabel: 'Menu',
      links: [
        { path: '/about', label: 'O mnie' },
        { path: '/skills', label: 'Umiejętności' },
        { path: '/projects', label: 'Projekty' },
        { path: '/contact', label: 'Kontakt' },
      ],
      themeToggle: {
        light: 'Przełącz na jasny tryb',
        dark: 'Przełącz na ciemny tryb',
      },
      languageSwitcher: {
        label: 'Język',
        options: {
          en: 'English',
          pl: 'Polski',
        },
      },
    },
    home: {
      eyebrow: 'Cześć',
      title: 'Krzysztof Śliwa - Angular Developer',
      description:
        'Buduję dostępne i testowalne aplikacje w Angularze (Signals, NgRx, SSR) - szybkie, stabilne i łatwe w zmianie.',
      hero: 'Signals, SSR, NgRx, testy. Wszystko po to, by użytkownicy czuli się jak w domu, a biznes miał spokój.',
      ctaProjects: 'Zobacz projekty',
      ctaContact: 'Skontaktuj się',
      tags: ['Angular 19', 'SSR', 'NgRx', 'Signals', 'A11y'],
      socialIntro: 'Znajdziesz mnie też:',
    },
    about: {
      eyebrow: 'Kim jestem',
      title: 'Angular Developer skupiony na jakości',
      description:
        'Buduję dostępne i testowalne aplikacje w Angularze (Signals, NgRx, SSR) - szybkie, stabilne i łatwe w zmianie.',
      values: [
        {
          title: 'Przejrzysta współpraca',
          description:
            'Komunikuję się jasno i otwarcie. Sprawnie łączę perspektywę produktową z techniczną.',
        },
        {
          title: 'Skalowalna architektura',
          description:
            'Projektuję komponenty pod testowalność i dostępność. Mniej długu, mniej regresji, więcej spokoju przy zmianach.',
        },
        {
          title: 'Przewidywalne releasy',
          description:
            'Bazuję na zwinnych iteracjach, szybkim feedbacku i automatyzacji - od CI/CD po testy.',
        },
      ],
      highlights: [
        { label: '5+', note: 'Lat doświadczenia komercyjnego' },
        { label: '5+', note: 'Zrealizowanych projektów' },
        { label: '40+', note: 'Nauczonych utworów' },
      ],
    },
    skills: {
      eyebrow: 'Stack',
      title: 'Umiejętności',
      description: 'Łączę kompetencje frontendowe z inżynierskim podejściem do jakości.',
      levels: {
        core: 'Core',
        pro: 'Pro',
        familiar: 'Familiar',
      },
    },
    projects: {
      eyebrow: 'Portfolio',
      title: 'Projekty',
      description: 'Wybrane realizacje - publiczne dema',
      filterLabel: 'Filtr projektów',
      filterAll: 'Wszystkie',
      showMore: 'Pokaż więcej projektów',
      empty: 'Brak projektów spełniających kryteria.',
      badges: {
        draft: 'W budowie',
        private: 'Prywatny',
      },
      links: {
        demo: 'Demo',
        repo: 'GitHub',
      },
      hintPrivate: 'Repozytorium ukryte (NDA)',
    },
    contact: {
      eyebrow: 'Kontakt',
      title: 'Porozmawiajmy',
      nameLabel: 'Imię',
      nameError: 'Podaj swoje imię.',
      emailLabel: 'E-mail',
      emailError: 'Podaj poprawny adres.',
      subjectLabel: 'Temat',
      subjectError: 'Podaj temat wiadomości.',
      messageLabel: 'Wiadomość',
      messageError: 'Wiadomość powinna mieć min. 10 znaków.',
      consentLabel: 'Zgadzam się na kontakt zgodnie z polityką prywatności.',
      consentError: 'Wymagana zgoda.',
      submit: 'Wyślij',
      success: 'Dziękuję! Wrócę z odpowiedzią.',
      error: 'Coś poszło nie tak. Spróbuj ponownie.',
      invalidForm: 'Popraw błędy w formularzu przed wysłaniem.',
      otherChannels: 'Inne kanały',
      copy: 'Kopiuj',
      copySuccess: 'Adres skopiowany 🎉',
      copyError: 'Nie udało się skopiować.',
    },
    footer: {
      linksLabel: 'Linki społecznościowe',
      copyright: 'Krzysztof Śliwa - Angular Developer',
    },
    backToTop: 'Powrót na górę',
    seo: {
      home: {
        title: 'Krzysztof Śliwa - Angular Developer',
        description:
          'Portfolio Angular Developera: projekty, umiejętności, kontakt. SSR, Signals, NgRx.',
      },
      about: {
        title: 'O mnie - Krzysztof Śliwa',
        description:
          'Poznaj wartości i doświadczenie Angular Developera skoncentrowanego na jakości.',
      },
      skills: {
        title: 'Umiejętności Angular - Signals, SSR, NgRx',
        description:
          'Kompetencje frontendowe: Angular 19, RxJS, testy, narzędzia. Gotowe do działania w Twoim projekcie.',
      },
      projects: {
        title: 'Projekty Angular - portfolio',
        description:
          'Wybrane projekty Angularowe: publiczne demo, case’y pod NDA, audyty wydajności.',
      },
      contact: {
        title: 'Kontakt - współpraca Angular',
        description:
          'Napisz wiadomość lub umów konsultację. Formularz z walidacją i potwierdzeniem wysyłki.',
      },
    },
  },
};
