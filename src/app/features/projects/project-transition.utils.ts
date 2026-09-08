import { Project } from '../../core/models/content.models';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => unknown;
};

export function getProjectIdentity(project: Project): string {
  return project.repoUrl || project.demoUrl || project.name;
}

export function getProjectTransitionName(project: Project): string {
  const identity = getProjectIdentity(project);
  let hash = 2166136261;

  for (let index = 0; index < identity.length; index += 1) {
    hash ^= identity.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `project-card-${(hash >>> 0).toString(36)}`;
}

export function runWithViewTransition(
  documentRef: Document,
  update: () => Promise<void>,
): void {
  const transitionDocument = documentRef as ViewTransitionDocument;
  const prefersReducedMotion =
    documentRef.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;

  if (!transitionDocument.startViewTransition || prefersReducedMotion) {
    void update();
    return;
  }

  transitionDocument.startViewTransition(update);
}
