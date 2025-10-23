import '@angular/compiler';
import { ElementRef } from '@angular/core';
import { jest } from '@jest/globals';

import { DrawerDirective } from './drawer.directive';

describe('DrawerDirective', () => {
  let host: HTMLDivElement;
  let toggle: HTMLButtonElement;
  let firstLink: HTMLAnchorElement;
  let secondButton: HTMLButtonElement;
  let directive: DrawerDirective;
  let rafSpy: jest.SpyInstance<number, [FrameRequestCallback]>;
  let cancelRafSpy: jest.SpyInstance<void, [number]>;

  beforeEach(() => {
    jest.useFakeTimers();

    host = document.createElement('div');
    host.id = 'drawer';
    document.body.appendChild(host);

    toggle = document.createElement('button');
    toggle.id = 'toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', 'drawer');
    document.body.appendChild(toggle);

    firstLink = document.createElement('a');
    firstLink.href = '#first';
    firstLink.id = 'first-link';
    firstLink.textContent = 'First link';
    host.appendChild(firstLink);

    secondButton = document.createElement('button');
    secondButton.type = 'button';
    secondButton.id = 'second-button';
    secondButton.textContent = 'Second button';
    host.appendChild(secondButton);

    directive = new DrawerDirective(new ElementRef(host), document);

    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback): number =>
        window.setTimeout(() => callback(0), 16),
      );

    cancelRafSpy = jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation((handle: number): void => {
        window.clearTimeout(handle);
      });
  });

  afterEach(() => {
    directive.open = false;
    host.remove();
    toggle.remove();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should focus the first focusable element when opened and restore focus on close', () => {
    toggle.focus();

    directive.open = true;
    jest.runAllTimers();

    expect(document.activeElement).toBe(firstLink);

    directive.open = false;

    expect(document.activeElement).toBe(toggle);
  });

  it('should trap focus when pressing Tab and Shift+Tab', () => {
    directive.open = true;
    jest.runAllTimers();

    secondButton.focus();
    const forwardTab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });

    directive.handleKeydown(forwardTab);

    expect(forwardTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(firstLink);

    firstLink.focus();
    const backwardTab = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });

    directive.handleKeydown(backwardTab);

    expect(backwardTab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(secondButton);
  });

  it('should close on Escape and return focus to the toggle', () => {
    directive.open = true;
    jest.runAllTimers();

    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });

    directive.handleKeydown(escapeEvent);

    expect(escapeEvent.defaultPrevented).toBe(true);
    expect(directive.open).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('should expose dialog ARIA attributes when open', () => {
    expect(directive.role).toBeNull();
    expect(directive.ariaModal).toBeNull();
    expect(directive.ariaHidden).toBe('true');

    directive.open = true;
    jest.runAllTimers();

    expect(directive.role).toBe('dialog');
    expect(directive.ariaModal).toBe('true');
    expect(directive.ariaHidden).toBe('false');
  });

  it('should not refocus contents if closed before the next animation frame', () => {
    toggle.focus();

    directive.open = true;
    directive.open = false;
    jest.runAllTimers();

    expect(document.activeElement).toBe(toggle);
    expect(rafSpy).toHaveBeenCalled();
    expect(cancelRafSpy).toHaveBeenCalled();
  });
});
