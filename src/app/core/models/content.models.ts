export interface Project {
  name: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  highlights?: string[];
  private?: boolean;
  draft?: boolean;
}

export type SkillLevel = 'core' | 'pro' | 'familiar' | 'legacy';

export interface SkillGroup {
  name: string;
  items: SkillItem[];
}

export interface SkillItem {
  name: string;
  level: SkillLevel;
  note?: string;
}

export interface SocialLink {
  label: string;
  url: string;
}
