import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skillLevel',
  standalone: true
})
export class SkillLevelPipe implements PipeTransform {
  transform(level: 'core' | 'pro' | 'familiar'): string {
    switch (level) {
      case 'core':
        return 'Core';
      case 'pro':
        return 'Pro';
      case 'familiar':
        return 'Familiar';
      default:
        return level;
    }
  }
}
