import '@angular/compiler';
import 'zone.js';

import { jest } from '@jest/globals';
import { EnvironmentInjector, Injector, NgZone, createEnvironmentInjector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  type ToastComponentRefDouble = {
    instance: ToastComponent;
    changeDetectorRef: {
      detectChanges: () => void;
    };
    location: {
      nativeElement: HTMLElement;
    };
  };

  type OverlayRefDouble = OverlayRef & {
    hostElement: HTMLElement;
    overlayElement: HTMLElement;
    detachSubject: Subject<void>;
    componentRef: ToastComponentRefDouble;
  };

  type GlobalPositionStrategyDouble = {
    centerHorizontally: () => GlobalPositionStrategyDouble;
    bottom: () => GlobalPositionStrategyDouble;
  };

  let overlayRefs: OverlayRefDouble[];
  let overlayMock: Overlay;
  let zoneMock: NgZone;
  let service: ToastService;
  let environmentInjector: EnvironmentInjector;

  function createOverlayRefStub(): OverlayRefDouble {
    const detachSubject = new Subject<void>();
    const hostElement = document.createElement('div');
    const componentInstance = new ToastComponent();
    const componentRef: ToastComponentRefDouble = {
      instance: componentInstance,
      changeDetectorRef: {
        detectChanges: jest.fn(() => {
          hostElement.setAttribute('role', Reflect.get(componentInstance, 'role'));
          hostElement.setAttribute('aria-live', Reflect.get(componentInstance, 'ariaLive'));
        }),
      },
      location: { nativeElement: hostElement },
    };

    const overlayRef = {
      attach: jest.fn(() => componentRef),
      detachments: jest.fn(() => detachSubject.asObservable()),
      dispose: jest.fn(() => {
        detachSubject.next();
      }),
      hostElement,
      overlayElement: hostElement,
      detachSubject,
      componentRef,
    } as unknown as OverlayRefDouble;

    return overlayRef;
  }

  beforeEach(() => {
    overlayRefs = [];

    const globalPosition: GlobalPositionStrategyDouble = {
      centerHorizontally: jest.fn(() => globalPosition),
      bottom: jest.fn(() => globalPosition),
    };

    overlayMock = {
      create: jest.fn(() => {
        const ref = createOverlayRefStub();
        overlayRefs.push(ref);
        return ref;
      }),
      position: jest.fn(() => ({
        global: jest.fn(() => globalPosition),
      })),
      scrollStrategies: {
        reposition: jest.fn(() => ({})),
      },
    } as unknown as Overlay;

    zoneMock = {
      runOutsideAngular: jest.fn((fn: () => void) => fn()),
      run: jest.fn((fn: () => void) => fn()),
    } as unknown as NgZone;

    const injector = Injector.create({
      providers: [
        { provide: Overlay, useValue: overlayMock },
        { provide: NgZone, useValue: zoneMock },
      ],
    });

    environmentInjector = createEnvironmentInjector([], injector);
    service = environmentInjector.runInContext(() => new ToastService());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    environmentInjector.destroy();
  });

  it('should dispose the previous overlay when showing a new toast', () => {
    service.show('First');
    const firstRef = overlayRefs[0];

    service.show('Second');

    expect(firstRef.dispose).toHaveBeenCalledTimes(1);
    expect(overlayRefs).toHaveLength(2);
  });

  it('should clear the hide timeout when the overlay detaches', () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    service.show('Toast', { duration: 100 });

    expect(zoneMock.runOutsideAngular).toHaveBeenCalled();
    expect(overlayRefs[0].detachments).toHaveBeenCalled();

    overlayRefs[0].detachSubject.next();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should set variant specific roles on the toast component', () => {
    service.show('Error message', { variant: 'error' });

    const firstHost = overlayRefs[0].hostElement;
    expect(overlayRefs[0].componentRef.instance.variant).toBe('error');
    expect(firstHost.getAttribute('role')).toBe('alert');

    service.show('All good', { variant: 'success' });

    const secondHost = overlayRefs[1].hostElement;
    expect(overlayRefs[1].componentRef.instance.variant).toBe('success');
    expect(secondHost.getAttribute('role')).toBe('status');
  });
});
