"use client";

import Divider from "@/packages/Components/Divider/Divider";
import Icon from "@/packages/Components/Icon/Icon";
import { getProfileAvatarIconProps } from "@/packages/Components/Profile/Profile.shared";
import type {
  ProfileProps,
  ProfileRole,
  ProfileSizeOptions,
} from "@/packages/Components/Profile/Profile.types";
import Text from "@/packages/Components/Text/Text";
import Pressable from "@/packages/Frameworks/Pressable/Pressable";
import View from "@/packages/Frameworks/View/View";

type ResolvedProfileSize = Required<
  Pick<ProfileSizeOptions, "avatar" | "textType" | "badge" | "gap">
> &
  Pick<ProfileSizeOptions, "textSize"> & {
    fallbackPadding: number | string;
  };

function resolveProfileSize(size?: ProfileSizeOptions): ResolvedProfileSize {
  const avatar = size?.avatar ?? 20;

  return {
    avatar,
    textType: size?.textType ?? "Subheadline",
    textSize: size?.textSize,
    badge: size?.badge ?? 16,
    gap: size?.gap ?? 4,
    fallbackPadding: size?.fallbackPadding ?? 6,
  };
}

function ProfileCertifiedBadge({
  certifiedAt,
  role,
  size,
}: {
  certifiedAt?: string;
  role?: ProfileRole;
  size: number;
}) {
  return (
    <Icon
      icon="iCheckCircle"
      iconFill
      size={size}
      color={role?.color ?? (certifiedAt ? "Blue3" : undefined)}
    />
  );
}

function ProfileMetaList({
  joinedAtText,
  roles,
}: {
  joinedAtText?: string;
  roles?: ProfileRole[];
}) {
  const items = [];
  if (joinedAtText) {
    items.push({
      key: `joined-${joinedAtText}`,
      icon: "iDateNote",
      text: joinedAtText,
    });
  }

  if (roles) {
    for (const r of roles) {
      items.push({
        key: `role-${r.label}`,
        icon: r.icon ?? "iCheckCircle",
        iconFill: r.iconFill ?? true,
        text: r.label,
        color: r.color,
      });
    }
  }

  if (items.length === 0) return null;

  return (
    <View padding={[8, 12]}>
      <View column gap={4}>
        {items.map((item) => (
          <View key={item.key} alignItems="center" gap={4}>
            <Icon
              icon={item.icon}
              iconFill={item.iconFill}
              color={item.color}
              size={18}
            />
            <Text type="Caption1" verticalTrim>
              {item.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProfilePopoverReportButton({
  href,
  onClick,
  reportLabel,
}: {
  href?: string;
  onClick?: () => void;
  reportLabel?: string;
}) {
  const label = reportLabel || "Report";

  return (
    <Icon
      icon="iWarning"
      box
      size={20}
      boxOptions={{ padding: 4 }}
      themePreset="RedSoft"
      pressable={{
        title: label,
        "aria-label": label,
        href,
        onClick,
      }}
    />
  );
}

function ProfileInlineContent({
  size,
  displayName,
  username,
  extended,
  isCertified,
  certifiedAt,
  primaryRole,
  avatarIconProps,
}: {
  size: ResolvedProfileSize;
  displayName: string;
  username?: string;
  extended?: boolean;
  isCertified?: boolean;
  certifiedAt?: string;
  primaryRole?: ProfileRole;
  avatarIconProps: ReturnType<typeof getProfileAvatarIconProps>;
}) {
  return (
    <View alignItems="center" gap={size.gap}>
      <Icon {...avatarIconProps} />
      <View gap={4} alignItems="center">
        <View gap={4} alignItems="center">
          <Text
            type={size.textType}
            size={size.textSize}
            verticalTrim
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </Text>
          {isCertified || primaryRole ? (
            <ProfileCertifiedBadge
              certifiedAt={certifiedAt}
              role={primaryRole}
              size={size.badge}
            />
          ) : null}
        </View>
        {extended && username ? (
          <Text type="Caption1" verticalTrim opacity={0.6}>
            @{username}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function ProfilePopoverContent({
  profileHref,
  displayName,
  displayUsername,
  displayBio,
  hasAvatar,
  popoverAvatarIconProps,
  isCertified,
  certifiedAt,
  primaryRole,
  canReport,
  reportHref,
  reportLabel,
  onReport,
  joinedAtText,
  roles,
  "data-color-mode": dataColorMode,
}: {
  profileHref?: string | null;
  displayName: string;
  displayUsername?: string;
  displayBio?: string;
  hasAvatar: boolean;
  popoverAvatarIconProps: ReturnType<typeof getProfileAvatarIconProps>;
  isCertified?: boolean;
  certifiedAt?: string;
  primaryRole?: ProfileRole;
  canReport?: boolean;
  reportHref?: string | null;
  reportLabel?: string;
  onReport?: () => void;
  joinedAtText?: string;
  roles?: ProfileRole[];
  "data-color-mode"?: string;
}) {
  const hasHeaderContent = Boolean(
    displayName || displayUsername || displayBio || hasAvatar,
  );

  return (
    <View fullWidth column gap={0} data-color-mode={dataColorMode}>
      {hasHeaderContent ? (
        <View fullWidth style={{ position: "relative" }}>
          <Pressable
            radius="regular"
            fullWidth
            column
            gap={12}
            padding={[8, 12]}
            style={{ minWidth: 0, transition: "var(--transition-surface)" }}
            href={profileHref || undefined}
            data-color-mode={dataColorMode}
          >
            <Icon {...popoverAvatarIconProps} />
            <View gap={12} column>
              <View gap={6} column>
                <View gap={6} alignItems="center">
                  <Text type="Title1" weight={600} verticalTrim>
                    {displayName}
                  </Text>
                  {isCertified || primaryRole ? (
                    <ProfileCertifiedBadge
                      certifiedAt={certifiedAt}
                      role={primaryRole}
                      size={22}
                    />
                  ) : null}
                </View>
                {displayUsername ? (
                  <Text type="Subheadline" verticalTrim opacity={0.6}>
                    @{displayUsername}
                  </Text>
                ) : null}
              </View>
              {displayBio ? (
                <Text type="Footnote" opacity={0.6}>
                  {displayBio}
                </Text>
              ) : null}
            </View>
          </Pressable>
          {canReport ? (
            <View
              style={{
                position: "absolute",
                top: ".4rem",
                right: ".4rem",
                zIndex: 2,
              }}
            >
              <ProfilePopoverReportButton
                href={reportHref || undefined}
                onClick={onReport}
                reportLabel={reportLabel}
              />
            </View>
          ) : null}
        </View>
      ) : null}
      <Divider />
      <ProfileMetaList joinedAtText={joinedAtText} roles={roles} />
    </View>
  );
}

export default function Profile({
  id,
  displayName,
  username,
  avatarUrl,
  avatarLoading,
  bio,
  isCertified,
  certifiedAt,
  roles,
  joinedAtText,
  profileHref,
  canReport,
  reportHref,
  reportLabel,
  onReport,
  extended,
  size,
  popover,
  "data-color-mode": dataColorMode,
}: ProfileProps) {
  const resolvedSize = resolveProfileSize(size);
  const primaryRole = roles?.[0];

  const avatarIconProps = getProfileAvatarIconProps({
    avatar: avatarUrl,
    avatarLoading,
    size: resolvedSize.avatar,
    fallbackPadding: resolvedSize.fallbackPadding,
  });

  const popoverAvatarIconProps = getProfileAvatarIconProps({
    avatar: avatarUrl,
    avatarLoading,
    size: 64,
    fallbackPadding: 12,
  });

  const resolvedPopover = popover
    ? {
        escapeExit: true,
        minWidth: "24rem",
        "data-color-mode": dataColorMode,
        content: popover,
      }
    : profileHref
      ? {
          escapeExit: true,
          minWidth: "24rem",
          "data-color-mode": dataColorMode,
          content: (
            <ProfilePopoverContent
              profileHref={profileHref}
              displayName={displayName}
              displayUsername={username}
              displayBio={bio}
              hasAvatar={Boolean(avatarUrl?.trim())}
              popoverAvatarIconProps={popoverAvatarIconProps}
              isCertified={isCertified}
              certifiedAt={certifiedAt}
              primaryRole={primaryRole}
              canReport={canReport}
              reportHref={reportHref}
              reportLabel={reportLabel}
              onReport={onReport}
              joinedAtText={joinedAtText}
              roles={roles}
              data-color-mode={dataColorMode}
            />
          ),
        }
      : undefined;

  return (
    <Pressable
      padding={[4, 6]}
      style={{ transition: "var(--transition-surface)", margin: "-4px -6px" }}
      data-color-mode={dataColorMode}
      popover={resolvedPopover}
    >
      <ProfileInlineContent
        size={resolvedSize}
        displayName={displayName}
        username={username}
        extended={extended}
        isCertified={isCertified}
        certifiedAt={certifiedAt}
        primaryRole={primaryRole}
        avatarIconProps={avatarIconProps}
      />
    </Pressable>
  );
}
