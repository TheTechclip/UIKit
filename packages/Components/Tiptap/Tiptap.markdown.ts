import type { Editor } from "@tiptap/react";

export function generateMarkdown(editor: Editor): string {
  const root = editor.getHTML();
  const doc = new DOMParser().parseFromString(root, "text/html");
  const lines: string[] = [];

  const indexInParent = (el: HTMLElement): number => {
    const parent = el.parentElement;
    if (!parent) return 1;
    const items = Array.from(parent.children).filter(
      (c) => c.tagName.toLowerCase() === "li",
    );
    return items.indexOf(el) + 1;
  };

  const inline = (el: HTMLElement): string => {
    let out = "";
    el.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        out += child.textContent ?? "";
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const childEl = child as HTMLElement;
      const tag = childEl.tagName.toLowerCase();
      const text = inline(childEl);
      switch (tag) {
        case "strong":
        case "b":
          out += `**${text}**`;
          break;
        case "em":
        case "i":
          out += `*${text}*`;
          break;
        case "s":
        case "del":
        case "strike":
          out += `~~${text}~~`;
          break;
        case "code":
          out += `\`${text}\``;
          break;
        case "a":
          out += `[${text}](${childEl.getAttribute("href") ?? ""})`;
          break;
        case "img":
          out += `![${childEl.getAttribute("alt") ?? ""}](${
            childEl.getAttribute("src") ?? ""
          })`;
          break;
        case "br":
          out += "\n";
          break;
        default:
          out += text;
          break;
      }
    });
    return out.trim();
  };

  const walk = (node: ChildNode, listDepth: number) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text.trim()) lines.push(text);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case "h1":
        lines.push(`# ${inline(el)}`);
        break;
      case "h2":
        lines.push(`## ${inline(el)}`);
        break;
      case "h3":
        lines.push(`### ${inline(el)}`);
        break;
      case "h4":
        lines.push(`#### ${inline(el)}`);
        break;
      case "h5":
        lines.push(`##### ${inline(el)}`);
        break;
      case "h6":
        lines.push(`###### ${inline(el)}`);
        break;
      case "p":
        lines.push(inline(el));
        break;
      case "blockquote":
        lines.push(`> ${inline(el)}`);
        break;
      case "pre": {
        const code = el.querySelector("code");
        const lang = code?.getAttribute("data-language") ?? "";
        lines.push(
          `\`\`\`${lang}\n${code?.textContent ?? el.textContent ?? ""}\n\`\`\``,
        );
        break;
      }
      case "ul":
        el.childNodes.forEach((child) => {
          walk(child, listDepth + 1);
        });
        break;
      case "ol":
        el.childNodes.forEach((child) => {
          walk(child, listDepth + 1);
        });
        break;
      case "li": {
        const indent = "  ".repeat(Math.max(0, listDepth - 1));
        const ordered = el.parentElement?.tagName.toLowerCase() === "ol";
        const marker = ordered
          ? `${(el as HTMLLIElement).value || indexInParent(el)}.`
          : "-";
        lines.push(`${indent}${marker} ${inline(el)}`);
        break;
      }
      case "hr":
        lines.push("---");
        break;
      case "br":
        lines.push("");
        break;
      default:
        el.childNodes.forEach((child) => {
          walk(child, listDepth);
        });
        break;
    }
  };

  doc.body.childNodes.forEach((child) => {
    walk(child, 0);
  });

  return lines
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
