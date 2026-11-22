import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom lacks these browser layout/media APIs; behavior is tested in Playwright.
vi.stubGlobal("matchMedia", (query: string) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {} }));
vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });

afterEach(cleanup);
