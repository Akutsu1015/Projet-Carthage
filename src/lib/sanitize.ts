import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize untrusted HTML before passing to dangerouslySetInnerHTML.
 *
 * Exercise content is currently author-controlled (hardcoded in part files),
 * but sanitizing is defense-in-depth in case user-submitted content is added later,
 * and protects against accidental XSS from broken HTML in translations.
 */
const ALLOWED_TAGS = [
  "a", "b", "br", "code", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
  "hr", "i", "img", "kbd", "li", "ol", "p", "pre", "small", "span", "strong",
  "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "u", "ul",
];

const ALLOWED_ATTR = ["class", "id", "href", "src", "alt", "title", "target", "rel", "style"];

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  });
}

/** Shortcut to build a `dangerouslySetInnerHTML` prop value with sanitization. */
export function safeHtml(html: string | undefined | null) {
  return { __html: sanitizeHtml(html) };
}
