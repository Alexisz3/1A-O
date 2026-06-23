import { useIOSZoomGuard } from './useIOSZoomGuard';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

function ZoomGuardHarness({ enabled = true }) {
  const ref = useIOSZoomGuard(enabled);
  return <div ref={ref}>Protected media</div>;
}

function touchEvent(type, touchCount) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const touches = Array.from({ length: touchCount }, () => ({}));
  Object.defineProperty(event, type === 'touchend' ? 'changedTouches' : 'touches', {
    value: touches,
  });
  return event;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('useIOSZoomGuard', () => {
  it('registers non-passive capture listeners and removes them on unmount', () => {
    const addSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    const removeSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
    const { unmount } = render(<ZoomGuardHarness />);
    const options = { passive: false, capture: true };
    const eventNames = [
      'gesturestart',
      'gesturechange',
      'gestureend',
      'touchmove',
      'touchend',
      'dblclick',
    ];

    for (const eventName of eventNames) {
      expect(addSpy).toHaveBeenCalledWith(eventName, expect.any(Function), options);
    }

    unmount();

    for (const eventName of eventNames) {
      expect(removeSpy).toHaveBeenCalledWith(eventName, expect.any(Function), options);
    }
  });

  it('blocks two-finger movement but leaves one-finger vertical movement available', () => {
    const { container } = render(<ZoomGuardHarness />);
    const target = container.firstElementChild;
    const multiTouch = touchEvent('touchmove', 2);
    const singleTouch = touchEvent('touchmove', 1);

    target.dispatchEvent(multiTouch);
    target.dispatchEvent(singleTouch);

    expect(multiTouch.defaultPrevented).toBe(true);
    expect(singleTouch.defaultPrevented).toBe(false);
  });

  it('blocks the second touchend in a rapid double tap', () => {
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const { container } = render(<ZoomGuardHarness />);
    const target = container.firstElementChild;
    const firstTap = touchEvent('touchend', 1);
    target.dispatchEvent(firstTap);

    nowSpy.mockReturnValue(1_200);
    const secondTap = touchEvent('touchend', 1);
    target.dispatchEvent(secondTap);

    expect(firstTap.defaultPrevented).toBe(false);
    expect(secondTap.defaultPrevented).toBe(true);
  });

  it('does not duplicate listeners across enable and disable cycles', () => {
    const addSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
    const removeSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
    const { rerender, unmount } = render(<ZoomGuardHarness enabled={false} />);

    rerender(<ZoomGuardHarness enabled />);
    rerender(<ZoomGuardHarness enabled />);
    expect(addSpy.mock.calls.filter(([name]) => name === 'gesturestart')).toHaveLength(1);

    rerender(<ZoomGuardHarness enabled={false} />);
    expect(removeSpy.mock.calls.filter(([name]) => name === 'gesturestart')).toHaveLength(1);

    rerender(<ZoomGuardHarness enabled />);
    expect(addSpy.mock.calls.filter(([name]) => name === 'gesturestart')).toHaveLength(2);

    unmount();
    expect(removeSpy.mock.calls.filter(([name]) => name === 'gesturestart')).toHaveLength(2);
  });
});
