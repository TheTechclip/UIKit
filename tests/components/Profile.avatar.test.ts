import { describe, expect, it } from "vitest";
import { getProfileAvatarIconProps } from "../../packages/components/Profile/Profile.avatar";

describe("getProfileAvatarIconProps", () => {
  it("returns icon props for avatar", () => {
    const result = getProfileAvatarIconProps({
      avatar: "avatar.jpg",
      size: 40,
    });
    expect(result).toBeDefined();
    expect(result.image).toBe("avatar.jpg");
  });

  it("returns fallback icon when no avatar", () => {
    const result = getProfileAvatarIconProps({ size: 40 });
    expect(result.image).toBeUndefined();
    expect(result.icon).toBe("iPerson");
  });
});
