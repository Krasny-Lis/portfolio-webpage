import { Project } from '../../core/models/content.models';

export const AVAILABLE_TAGS = ['Angular', 'React', 'Material'] as const;
const NORMALIZED_AVAILABLE_TAGS = AVAILABLE_TAGS.map((tag) => tag.toLowerCase());

export function normalizeTagLabel(tag: string): string | null {
  const lowerCased = tag.toLowerCase();
  const index = NORMALIZED_AVAILABLE_TAGS.indexOf(lowerCased);
  return index === -1 ? null : AVAILABLE_TAGS[index];
}
