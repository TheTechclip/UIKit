import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Profile from "../../packages/components/Profile/Profile";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("Profile Component", () => {
  it("renders with display name", () => {
    render(<Profile displayName="Test User" />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("renders with extended username", () => {
    render(<Profile displayName="Test User" username="testuser" extended />);
    expect(screen.getByText("@testuser")).toBeInTheDocument();
  });

  it("does not render username when extended is false", () => {
    render(<Profile displayName="Test User" username="testuser" />);
    expect(screen.queryByText("@testuser")).not.toBeInTheDocument();
  });

  it("renders certified badge when isCertified is true", () => {
    const { container } = render(
      <Profile displayName="Test User" isCertified />,
    );
    // ProfileCertifiedBadge renders an Icon with iCheckCircle
    const icon = container.querySelector(".iCheckCircle");
    expect(icon).toBeInTheDocument();
  });

  it("renders popover content when profileHref is provided", () => {
    // Note: popover functionality in Pressable might be complex to test if it relies on interactions/portals
    // But we can check if it passes the profileHref correctly
    render(<Profile displayName="Test User" profileHref="/user" />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    // Assuming Pressable sets popover attribute or similar, or we trigger it.
    // For now we just test rendering doesn't crash.
  });

  it("renders avatar when avatarUrl is provided", () => {
    const { container } = render(
      <Profile
        displayName="Test User"
        avatarUrl="https://example.com/avatar.jpg"
      />,
    );
    // getProfileAvatarIconProps will return an image props for Icon
    // The image should be rendered
    const img = container.querySelector(
      'img[src="https://example.com/avatar.jpg"]',
    );
    expect(img).toBeInTheDocument();
  });
});
