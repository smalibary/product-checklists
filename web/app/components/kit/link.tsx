import type { AnchorHTMLAttributes, ReactNode } from "react";
import NextLink from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  // Opens in a new tab: marked with an icon and announced.
  external?: boolean;
  // A link to another part of this site's own address space (or an outside page) in the same tab:
  // shown with the outside-link icon when "outside" is set, and always a plain anchor when "hard" is.
  outside?: boolean;
  hard?: boolean;
  // A file: its type and size are said in the link text.
  file?: { type: string; size: string };
  // Stands alone (a menu, a list): a larger tap area on phones.
  standalone?: boolean;
  children: ReactNode;
};

// The one link of the site. Underlined (never colour alone), a different look once visited,
// same tab unless there is a strong reason. For actions, use Button.
export function Link({ href, external, outside, hard, file, standalone, className, children, rel, ...rest }: Props) {
  const cls = ["kit-link", className].filter(Boolean).join(" ");
  const inner = (
    <>
      {children}
      {file && <span className="kit-link-file"> ({file.type}, {file.size})</span>}
      {outside && !external && <ArrowSquareOut className="kit-link-out" size={14} aria-hidden="true" />}
      {external && (
        <>
          <ArrowSquareOut className="kit-link-out" size={14} aria-hidden="true" />
          <span className="sr"> (opens in a new tab)</span>
        </>
      )}
    </>
  );
  if (external) {
    return (
      <a {...rest} className={cls} data-standalone={standalone || undefined} href={href} target="_blank" rel={rel ? `${rel} noopener noreferrer` : "noopener noreferrer"}>
        {inner}
      </a>
    );
  }
  if (!hard && href.startsWith("/")) {
    return (
      <NextLink {...rest} rel={rel} className={cls} data-standalone={standalone || undefined} href={href}>
        {inner}
      </NextLink>
    );
  }
  return (
    <a {...rest} rel={rel} className={cls} data-standalone={standalone || undefined} href={href}>
      {inner}
    </a>
  );
}
