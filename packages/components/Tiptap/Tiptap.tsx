"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  EditorContent,
  type Editor as TiptapEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Pressable from "../../frameworks/Pressable/Pressable";
import View from "../../frameworks/View/View";
import Text from "../Text/Text";
import { generateMarkdown } from "./Tiptap.markdown";
import styles from "./Tiptap.module.scss";
import type { TiptapProps, TiptapToolbarItem } from "./Tiptap.types";

const DEFAULT_TOOLBAR: TiptapToolbarItem[] = [
  "bold",
  "italic",
  "strike",
  "code",
  "divider",
  "h1",
  "h2",
  "h3",
  "divider",
  "bulletList",
  "orderedList",
  "blockquote",
  "codeBlock",
  "divider",
  "link",
  "image",
  "divider",
  "undo",
  "redo",
];

const ICON_MAP: Partial<Record<TiptapToolbarItem, string>> = {
  bold: "B",
  italic: "I",
  strike: "S",
  code: "</>",
  h1: "H1",
  h2: "H2",
  h3: "H3",
  bulletList: "•",
  orderedList: "1.",
  blockquote: "❝",
  codeBlock: "{ }",
  link: "🔗",
  image: "🖼",
  undo: "↶",
  redo: "↷",
};

function isActive(editor: TiptapEditor, item: TiptapToolbarItem): boolean {
  switch (item) {
    case "bold":
      return editor.isActive("bold");
    case "italic":
      return editor.isActive("italic");
    case "strike":
      return editor.isActive("strike");
    case "code":
      return editor.isActive("code");
    case "h1":
      return editor.isActive("heading", { level: 1 });
    case "h2":
      return editor.isActive("heading", { level: 2 });
    case "h3":
      return editor.isActive("heading", { level: 3 });
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    case "blockquote":
      return editor.isActive("blockquote");
    case "codeBlock":
      return editor.isActive("codeBlock");
    case "link":
      return editor.isActive("link");
    default:
      return false;
  }
}

function runAction(editor: TiptapEditor, item: TiptapToolbarItem) {
  switch (item) {
    case "bold":
      editor.chain().focus().toggleBold().run();
      break;
    case "italic":
      editor.chain().focus().toggleItalic().run();
      break;
    case "strike":
      editor.chain().focus().toggleStrike().run();
      break;
    case "code":
      editor.chain().focus().toggleCode().run();
      break;
    case "h1":
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      break;
    case "h2":
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      break;
    case "h3":
      editor.chain().focus().toggleHeading({ level: 3 }).run();
      break;
    case "bulletList":
      editor.chain().focus().toggleBulletList().run();
      break;
    case "orderedList":
      editor.chain().focus().toggleOrderedList().run();
      break;
    case "blockquote":
      editor.chain().focus().toggleBlockquote().run();
      break;
    case "codeBlock":
      editor.chain().focus().toggleCodeBlock().run();
      break;
    case "link": {
      const previous = editor.getAttributes("link").href as string | undefined;
      const url = window.prompt("링크 URL", previous ?? "https://");
      if (url === null) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      break;
    }
    case "image": {
      const url = window.prompt("이미지 URL");
      if (url) editor.chain().focus().setImage({ src: url }).run();
      break;
    }
    case "undo":
      editor.chain().focus().undo().run();
      break;
    case "redo":
      editor.chain().focus().redo().run();
      break;
    default:
      break;
  }
}

const resolvedHeight = (v?: number | string) =>
  typeof v === "number" ? `${v}rem` : v;

export default function Tiptap({
  value,
  defaultValue,
  onChange,
  onUpdate,
  placeholder,
  readOnly,
  autoFocus,
  minHeight = 16,
  maxHeight,
  toolbar = DEFAULT_TOOLBAR,
  themePreset = "UISecondary",
  background,
  border,
  radius = "Regular",
  className,
  style,
  "data-color-mode": dataColorMode,
}: TiptapProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const content = isControlled ? value : internal;

  const editor = useEditor({
    editable: !readOnly,
    autofocus: autoFocus,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const md = generateMarkdown(editor);
      if (!isControlled) setInternal(md);
      onChange?.(md);
      onUpdate?.(editor);
    },
  });

  useEffect(() => {
    if (isControlled && editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor, isControlled]);

  useEffect(() => {
    if (editor) editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  const toolbarItems = useMemo(
    () => (toolbar === false ? [] : toolbar),
    [toolbar],
  );

  return (
    <View
      data-color-mode={dataColorMode}
      column
      gap={0}
      themePreset={themePreset}
      background={background}
      border={border}
      radius={radius}
      className={clsx(styles.Tiptap, className)}
      style={style}
    >
      {toolbarItems.length > 0 && editor && (
        <View
          className={styles.Toolbar}
          gap={4}
          padding=".4rem .6rem"
          alignItems="center"
          wrap="wrap"
          data-color-mode={dataColorMode}
        >
          {toolbarItems.map((item, index) => {
            if (item === "divider") {
              return (
                <View
                  // biome-ignore lint/suspicious/noArrayIndexKey: toolbar is a static, ordered config array
                  key={`tb-divider-${index}`}
                  className={styles.Divider}
                  style={{ width: ".1rem", alignSelf: "stretch" }}
                />
              );
            }
            return (
              <Pressable
                // biome-ignore lint/suspicious/noArrayIndexKey: toolbar is a static, ordered config array
                key={`tb-${item}-${index}`}
                data-color-mode={dataColorMode}
                themePreset="UISecondary"
                themeInteractive
                selected={isActive(editor, item)}
                radius="Light"
                padding=".4rem .6rem"
                alignItems="center"
                justifyContent="center"
                aria-label={item}
                title={item}
                onClick={() => runAction(editor, item)}
                className={styles.ToolbarButton}
              >
                <Text
                  type="Caption1"
                  style={{
                    fontFamily: "var(--font-code, monospace)",
                    fontWeight: 600,
                    minWidth: "1.6rem",
                    textAlign: "center",
                  }}
                >
                  {ICON_MAP[item]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
      <View
        className={styles.EditorWrap}
        data-color-mode={dataColorMode}
        style={{
          minHeight: resolvedHeight(minHeight),
          maxHeight: resolvedHeight(maxHeight),
          overflowY: maxHeight ? "auto" : undefined,
        }}
      >
        <EditorContent editor={editor} className={styles.EditorContent} />
      </View>
    </View>
  );
}
