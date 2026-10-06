import {
  type Component,
  createMemo,
  type ParentComponent,
  type JSXElement,
  createSignal,
  Show,
  onMount,
  onCleanup,
  ComponentProps,
} from "solid-js";
import { A as Anchor } from "@solidjs/router";

const P: ParentComponent = (props) => (
  <p class="govuk-body">{props.children}</p>
);

const Ol: ParentComponent = (props) => (
  <ol class="govuk-list govuk-list--number">{props.children}</ol>
);
const Ul: ParentComponent = (props) => (
  <ul class="govuk-list govuk-list--bullet">{props.children}</ul>
);

const Li: ParentComponent = (props) => <li>{props.children}</li>;

export const Blockquote: ParentComponent = (props) => {
  let ref!: HTMLDivElement;

  onMount(() => {
    ref.querySelectorAll<HTMLParagraphElement>("p.govuk-body").forEach((p) => {
      p.style.fontStyle = "italic";
      p.style.paddingLeft = "0.75rem";
      if (!p.textContent?.trim().startsWith(">")) {
        p.textContent = `> ${p.textContent ?? ""}`;
      }
    });
  });

  return <div ref={ref}>{props.children}</div>;
};

const Pre: ParentComponent<{
  lang: string;
  displayLang: string;
  lines?: string;
  file?: string;
  children: JSXElement;
}> = (props) => {
  const [copied, setCopied] = createSignal(false);
  const [open, setOpen] = createSignal<boolean>(false);
  let ref!: HTMLDivElement;

  const onCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(ref.innerText);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const toggle = (e: MouseEvent) => {
    e.preventDefault();
    setOpen(!open());
  };

  return (
    <div class="govuk-tabs" data-module="govuk-tabs">
      <h2 class="govuk-tabs__title">Contents</h2>
      <ul class="govuk-tabs__list">
        <li
          class={`govuk-tabs__list-item ${open() ? "govuk-tabs__list-item--selected" : ""}`}
          style={{
            ...(open()
              ? {}
              : {
                  border: "1px solid #b1b4b6",
                  "border-bottom": "none",
                }),
          }}
        >
          <Anchor
            class="govuk-tabs__tab"
            style={{
              "text-decoration": "none",
            }}
            href="#"
            onClick={toggle}
          >
            {props.displayLang || props.lang || "Unknown"}
          </Anchor>
        </li>
      </ul>
      <div
        class="govuk-tabs__panel "
        style={{ display: open() ? "block" : "none" }}
      >
        <pre
          class={`language-${props.lang}`}
          data-line={props.lines}
          style={{
            position: "relative",
            margin: 0,
            "overflow-x": "auto",
            "padding-top": "3rem",
          }}
        >
          <button
            type="button"
            class="govuk-button"
            data-module="govuk-button"
            style={{
              position: "absolute",
              top: "0.4rem",
              right: "0.5rem",
              margin: 0,
            }}
            onClick={onCopy}
          >
            {copied() ? "Copied!" : "Copy code"}
          </button>
          <div ref={ref}>{props.children}</div>
        </pre>
      </div>
    </div>
  );
};

const headingLink = (children: JSXElement) =>
  children?.toString().toLowerCase().replaceAll(" ", "-").replaceAll(",", "");

const HeadlineLink: Component<{ link: string; class: string }> = (props) => {
  return <Anchor href={props.link} class="govuk-link"></Anchor>;
};

const H2: ParentComponent = (props) => (
  <h2 id={headingLink(props.children)} class="govuk-heading-m">
    {props.children}
    <HeadlineLink class="w-5 h-5" link={`#${headingLink(props.children)}`} />
  </h2>
);

const H3: ParentComponent = (props) => (
  <h3 id={headingLink(props.children)} class="govuk-heading-s">
    {props.children}
    <HeadlineLink class="w-4 h-4" link={`#${headingLink(props.children)}`} />
  </h3>
);

const H4: ParentComponent = (props) => (
  <h4 id={headingLink(props.children)} class="govuk-heading-s">
    {props.children}
    <HeadlineLink class="w-3 h-3" link={`#${headingLink(props.children)}`} />
  </h4>
);

const A: ParentComponent<{ href: string }> = (props) => {
  const isLocal = createMemo(() =>
    ["/", "./", "#"].some((s) => props.href.startsWith(s)),
  );

  return (
    <Anchor
      href={props.href}
      target={isLocal() ? "" : "_blank"}
      class="govuk-link"
    >
      {props.children}
    </Anchor>
  );
};

function gridCellDimensions() {
  const fallback = 24;
  try {
    const cs = getComputedStyle(document.body);
    const lh = parseFloat(cs.lineHeight);
    if (lh && isFinite(lh) && lh > 0) return { width: 8, height: lh };
  } catch {}
  try {
    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.visibility = "hidden";
    element.style.pointerEvents = "none";
    element.style.height = "1lh";
    element.style.width = "1ch";
    document.body.appendChild(element);
    const rect = element.getBoundingClientRect();
    document.body.removeChild(element);
    if (rect.height && rect.height > 4 && rect.height < 100) {
      return { width: rect.width, height: rect.height };
    }
  } catch {}
  try {
    const element = document.createElement("div");
    element.style.position = "fixed";
    element.style.visibility = "hidden";
    element.style.height = "var(--line-height, 24px)";
    element.style.width = "1ch";
    document.body.appendChild(element);
    const rect = element.getBoundingClientRect();
    document.body.removeChild(element);
    if (rect.height && rect.height > 4) return { width: rect.width, height: rect.height };
  } catch {}
  return { width: 8, height: fallback };
}

export const PostImage: Component<{
  src: string;
  alt: string;
  attr?: JSXElement;
  featuredImage?: boolean;
  class?: string;
  bgColor?: string;
}> = (props) => {
  const isEmoji = () => props.src.includes("emoji.slack-edge.com");
  if (isEmoji()) {
    return (
      <img
        {...props}
        style={{
          "vertical-align": "middle",
          "max-height": props.featuredImage ? "300px" : undefined,
          "object-fit": "contain",
        }}
        loading="eager"
        // @ts-ignore
        decoding="async"
        draggable={false}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: props.bgColor || "transparent",
      }}
    >
      <img
        src={props.src}
        alt={props.alt}
        style={{
          "max-width": "100%",
          width: "100%",
          height: "auto",
          display: "block",
        }}
        classList={{ [props.class || ""]: !!props.class }}
        loading="eager"
        // @ts-ignore
        fetchPriority={props.featuredImage ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onError={(e) => {
          const t = e.currentTarget as HTMLImageElement;
          if ((t as any).dataset.retried) return;
          (t as any).dataset.retried = "1";
          if (t.src.includes("wsrv.nl")) {
            try {
              const u = new URL(t.src);
              const direct = u.searchParams.get("url");
              if (direct) {
                t.src = decodeURIComponent(direct);
                return;
              }
            } catch {}
          }
          const sep = t.src.includes("?") ? "&" : "?";
          t.src = `${t.src}${sep}retry=1`;
        }}
      />
      {props.attr}
    </div>
  );
};

export const Aside: ParentComponent = (props) => {
  let ref!: HTMLDivElement;

  onMount(() => {
    ref.querySelectorAll("p.govuk-body").forEach((p) => {
      p.classList.add("govuk-!-margin-bottom-0");
    });
  });

  return (
    <div ref={ref} class="govuk-inset-text">
      {props.children}
    </div>
  );
};

export const Input: ParentComponent<ComponentProps<"input">> = (props) => {
  if (props.type === "checkbox") {
    return (
      <div
        style={{
          background: "black",
          display: "inline-block",
          "vertical-align": "middle",
        }}
      >
        <input
          type="checkbox"
          name="mdx"
          {...props}
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            position: "relative",
            display: "inline-block",
            "vertical-align": "middle",
          }}
        />
      </div>
    );
  }

  return <input style={{ background: "black", color: "black" }} {...props} />;
};

export const IMG: ParentComponent<ComponentProps<"img">> = (props) => {
  return (
    <img
      {...props}
      style={{
        "vertical-align": "middle",
      }}
    />
  );
};

export const markdownComponents = {
  a: A,
  p: P,
  li: Li,
  ol: Ol,
  ul: Ul,
  blockquote: Blockquote,
  pre: Pre,
  h1: H2,
  h2: H2,
  h3: H3,
  h4: H4,
  input: Input,
  img: PostImage,
};
