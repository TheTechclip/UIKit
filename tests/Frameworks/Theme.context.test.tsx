import { act, render, screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import ThemeBootstrapper, { useTheme } from "../../packages/Frameworks/Theme/Theme.boot";

function ThemeConsumer() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  return (
    <>
      <output data-testid="theme">{theme}</output>
      <output data-testid="resolved-theme">{resolvedTheme}</output>
      <button onClick={() => setTheme("dark")}>dark</button>
    </>
  );
}

describe("ThemeBootstrapper", () => {
  const storage = new Map<string, string>();

  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        clear: () => storage.clear(),
        getItem: (key: string) => storage.get(key) ?? null,
        removeItem: (key: string) => storage.delete(key),
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
  });

  beforeEach(() => {
    window.localStorage.clear();
    document.cookie = "theme=; path=/; max-age=0";
    vi.mocked(window.matchMedia).mockImplementation(
      (query) =>
        ({
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );
  });

  test("uses the stored scheme and applies it to the document", () => {
    window.localStorage.setItem("theme", "dark");

    render(
      <ThemeBootstrapper>
        <ThemeConsumer />
      </ThemeBootstrapper>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.colorMode).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  test("updates storage and the server-rendered cookie when the scheme changes", () => {
    render(
      <ThemeBootstrapper initialTheme="light">
        <ThemeConsumer />
      </ThemeBootstrapper>,
    );

    act(() => screen.getByRole("button", { name: "dark" }).click());

    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(document.cookie).toContain("theme=dark");
  });

  test("follows system changes while the system scheme is selected", () => {
    let listener: (() => void) | undefined;
    const mediaQuery = {
      matches: true,
      addEventListener: vi.fn((_: string, callback: () => void) => {
        listener = callback;
      }),
      removeEventListener: vi.fn(),
    };
    vi.mocked(window.matchMedia).mockReturnValue(mediaQuery as unknown as MediaQueryList);

    render(
      <ThemeBootstrapper initialTheme="system">
        <ThemeConsumer />
      </ThemeBootstrapper>,
    );

    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    mediaQuery.matches = false;
    act(() => listener?.());

    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");
  });
});
