import { jest } from '@jest/globals';

import { Project } from '../../core/models/content.models';
import {
  getProjectIdentity,
  getProjectTransitionName,
  runWithViewTransition,
} from './project-transition.utils';

describe('project transition utilities', () => {
  const project: Project = {
    name: 'Portfolio',
    description: 'Portfolio project',
    tags: ['Angular'],
    demoUrl: 'https://example.com/demo',
    repoUrl: 'https://example.com/repository',
  };

  it('should use a stable project identity', () => {
    expect(getProjectIdentity(project)).toBe(project.repoUrl);
    expect(getProjectIdentity({ ...project, repoUrl: undefined })).toBe(project.demoUrl);
    expect(getProjectIdentity({ ...project, repoUrl: undefined, demoUrl: undefined })).toBe(
      project.name,
    );
  });

  it('should create deterministic CSS-safe transition names', () => {
    const first = getProjectTransitionName(project);
    const second = getProjectTransitionName({ ...project });

    expect(first).toBe(second);
    expect(first).toMatch(/^project-card-[a-z0-9]+$/);
    expect(getProjectTransitionName({ ...project, repoUrl: 'https://example.com/other' })).not.toBe(
      first,
    );
  });

  it('should update immediately when View Transitions are unavailable', async () => {
    const update = jest.fn(async () => undefined);
    const documentRef = {
      defaultView: {
        matchMedia: jest.fn(() => ({ matches: false })),
      },
    } as unknown as Document;

    runWithViewTransition(documentRef, update);

    expect(update).toHaveBeenCalledTimes(1);
  });

  it('should respect reduced-motion preferences', () => {
    const update = jest.fn(async () => undefined);
    const startViewTransition = jest.fn();
    const documentRef = {
      defaultView: {
        matchMedia: jest.fn(() => ({ matches: true })),
      },
      startViewTransition,
    } as unknown as Document;

    runWithViewTransition(documentRef, update);

    expect(update).toHaveBeenCalledTimes(1);
    expect(startViewTransition).not.toHaveBeenCalled();
  });

  it('should perform the update inside a supported View Transition', async () => {
    const update = jest.fn(async () => undefined);
    let transitionUpdate: (() => Promise<void>) | undefined;
    const startViewTransition = jest.fn((callback: () => Promise<void>) => {
      transitionUpdate = callback;
      return { finished: Promise.resolve() };
    });
    const documentRef = {
      defaultView: {
        matchMedia: jest.fn(() => ({ matches: false })),
      },
      startViewTransition,
    } as unknown as Document;

    runWithViewTransition(documentRef, update);

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(update).not.toHaveBeenCalled();
    expect(transitionUpdate).toBeDefined();

    await transitionUpdate?.();

    expect(update).toHaveBeenCalledTimes(1);
  });
});
