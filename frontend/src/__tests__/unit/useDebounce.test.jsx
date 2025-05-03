import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../hooks/useDebounce";
import { vi } from "vitest";

describe("useDebounce", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should debounce the value", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    // Update the value
    rerender({ value: "updated", delay: 500 });

    // Shouldn't update immediately
    expect(result.current).toBe("initial");

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now should be updated
    expect(result.current).toBe("updated");
  });

  it("should clear timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");
    const { unmount } = renderHook(() => useDebounce("test", 500));

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
