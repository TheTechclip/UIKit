# Profile Component Documentation

## Purpose

A component that summarizes and renders a user's profile information (name, avatar, identifier, badge, affiliation role, etc.). In addition to fallback image (default icon) handling based on avatar presence, it also includes an advanced feature that displays expanded profile info in a popover layer on click.

## Usage Logic

- **Inline rendering (`ProfileInlineContent`)**: Shows the most basic profile form exposed externally. Renders the avatar photo, name (`displayName`), sub-text (`username`), and certification mark (Certified).
- **Popover rendering (`ProfilePopoverContent`)**: When `profileHref` or the `popover` prop is passed, a detailed info popover is shown on click/hover. This may include extended actions such as join date, detailed Role list, and user report (`canReport`).
- **Shared logic (`Profile.shared.ts`)**: Provides the `getProfileAvatarIconProps` utility function, which, when an actual profile image URL (`avatarUrl`) exists, generates that image, and otherwise generates the default person icon (`iPerson`) with appropriate size and padding.

## Type Signatures

```tsx
// Profile.types.ts
export type ProfileRole = {
  label: string;
  color?: ThemePaint;
  icon?: string;
  iconFill?: boolean;
};

export type ProfileSizeOptions = {
  avatar?: number; // avatar size
  textType?: TextProps["type"];
  textSize?: UIKitSizeValue;
  badge?: number; // badge (certification) size
  gap?: UIKitSizeValue;
  fallbackPadding?: UIKitSizeValue; // padding when using default icon
};

export interface ProfileProps {
  displayName: string;
  username?: string;
  avatarUrl?: string | null;
  avatarLoading?: "eager" | "lazy";
  bio?: string;
  isCertified?: boolean; // presence of official certification mark
  certifiedAt?: string;
  roles?: ProfileRole[]; // user's multiple roles list
  joinedAtText?: string;

  profileHref?: string | null; // URL to navigate to on popover click
  canReport?: boolean; // whether report feature is enabled
  onReport?: () => void;

  extended?: boolean; // enable inline display of supplementary info like username
  size?: ProfileSizeOptions;
  popover?: React.ReactNode; // inject custom popover content
}
```

## Example Code

```tsx
import { Profile } from "@musecat/uikit";

export function UserHeader() {
  return (
    <Profile
      displayName="Kim Coding"
      username="kim_code"
      avatarUrl="https://example.com/avatar.png"
      isCertified={true}
      bio="Frontend developer."
      joinedAtText="Joined 2023"
      roles={[{ label: "Admin", color: "Blue3" }]}
      profileHref="/users/kim_code"
      canReport={true}
      onReport={() => console.log("Report user")}
      extended={true} // expose username (@kim_code) even inline
    />
  );
}
```
