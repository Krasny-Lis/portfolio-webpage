import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export type ToastVariant = 'default' | 'success' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `{{ message }}`,
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  @Input() message = '';
  @Input() variant: ToastVariant = 'default';

  @HostBinding('class.toast')
  protected hostClass = true;

  @HostBinding('class.toast--error')
  protected get errorClass(): boolean {
    return this.variant === 'error';
  }

  @HostBinding('class.toast--success')
  protected get successClass(): boolean {
    return this.variant === 'success';
  }

  @HostBinding('attr.role')
  protected get role(): 'alert' | 'status' {
    return this.variant === 'error' ? 'alert' : 'status';
  }

  @HostBinding('attr.aria-live')
  protected get ariaLive(): 'assertive' | 'polite' {
    return this.variant === 'error' ? 'assertive' : 'polite';
  }
}
