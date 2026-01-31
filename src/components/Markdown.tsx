import {
  type Component,
  createMemo,
  type ParentComponent,
  type JSXElement,
  createSignal,
  Show,
  onMount,
} from "solid-js";

const P: ParentComponent = (props) => (
  <p class="govuk-body">{props.children}</p>
);

const Ol: ParentComponent = (props) => (
  <ol class="list-decimal [&>li]:ml-3h">{props.children}</ol>
);
const Ul: ParentComponent = (props) => (
  <ul class="list-square [&>li]:ml-2h">{props.children}</ul>
);

const Li: ParentComponent = (props) => <li class="">{props.children}</li>;

export const Blockquote: ParentComponent = (props) => {
  let ref!: HTMLDivElement;

  onMount(() => {
    ref.querySelectorAll<HTMLParagraphElement>("p.govuk-body").forEach((p) => {
      p.classList.remove("govuk-body");
      p.classList.add("govuk-body-s");
      p.classList.add("govuk-body-s");
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
  let ref!: HTMLPreElement;
  let divRef!: HTMLDivElement;


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
        <li class={`govuk-tabs__list-item ${open() ? "govuk-tabs__list-item--selected" : ""}`}>
          <a class="govuk-tabs__tab" style={{
			"text-decoration": "none"
		  }} href="#" onClick={toggle}>
            {props.displayLang}
          </a>
        </li>
      </ul>
      <div class="govuk-tabs__panel" ref={divRef} style={{ display: open() ? "block" : "none" }}>
        <button type="button" onClick={onCopy}>
          {copied() ? "Copied!" : "Copy code"}
        </button>
        <pre
          ref={ref}
          class={`language-${props.lang}`}
          data-line={props.lines}
          style={{
            display: "block",
            margin: 0,
            "overflow-x": "auto",
          }}
        >
          {props.children}
        </pre>
      </div>
    </div>
  );
};

const headingLink = (children: JSXElement) =>
  children?.toString().toLowerCase().replaceAll(" ", "-").replaceAll(",", "");

const HeadlineLink: Component<{ link: string; class: string }> = (props) => {
  return <a href={props.link} class="relative top-[1px]"></a>;
};

const H2: ParentComponent = (props) => (
  <h2
    id={headingLink(props.children)}
    class="text-2xl leading-2 font-bold mt-2v mb-1v flex items-center gap-1h scroll-mt-2v"
  >
    {props.children}
    <HeadlineLink class="w-5 h-5" link={`#${headingLink(props.children)}`} />
  </h2>
);

const H3: ParentComponent = (props) => (
  <h3
    id={headingLink(props.children)}
    class="text-xl leading-2 font-bold mt-2v mb-1v flex items-center gap-1h scroll-mt-2v"
  >
    {props.children}
    <HeadlineLink class="w-4 h-4" link={`#${headingLink(props.children)}`} />
  </h3>
);

const H4: ParentComponent = (props) => (
  <h4
    id={headingLink(props.children)}
    class="text-lg leading-1 font-bold mt-2v mb-1v flex items-center gap-1h scroll-mt-2v"
  >
    {props.children}
    <HeadlineLink class="w-3 h-3" link={`#${headingLink(props.children)}`} />
  </h4>
);

const A: ParentComponent<{ href: string }> = (props) => {
  const isLocal = createMemo(() =>
    ["/", "./", "#"].some((s) => props.href.startsWith(s)),
  );

  return (
    <a
      href={props.href}
      target={isLocal() ? "" : "_blank"}
      class="underline underline-offset-2"
    >
      {props.children}
    </a>
  );
};

function gridCellDimensions() {
  const element = document.createElement("div");
  element.style.position = "fixed";
  element.style.height = "var(--line-height)";
  element.style.width = "1ch";
  document.body.appendChild(element);
  const rect = element.getBoundingClientRect();
  document.body.removeChild(element);
  return { width: rect.width, height: rect.height };
}

export const PostImage: Component<{
  src: string;
  alt: string;
  attr?: JSXElement;
  class?: string;
}> = (props) => {
  let ref!: HTMLImageElement;

  onMount(() => {
    const cell = gridCellDimensions();
    function setHeightFromRatio() {
      const ratio = ref.naturalWidth / ref.naturalHeight;
      const rect = ref.getBoundingClientRect();
      const realHeight = rect.width / ratio;
      const diff = cell.height - (realHeight % cell.height);
      ref.style.setProperty("padding-bottom", `${diff}px`);
    }

    if (ref.complete) {
      setHeightFromRatio();
    } else {
      ref.addEventListener("load", () => {
        setHeightFromRatio();
      });
    }
  });

  return (
    <div>
      <img
        ref={ref}
        src={props.src}
        alt={props.alt}
        class="w-full"
        classList={{ [props.class || ""]: !!props.class }}
      />
      {props.attr}
    </div>
  );
};

export const Aside: ParentComponent = (props) => {
  let ref!: HTMLDivElement;

  onMount(() => {
    ref.querySelectorAll("p.govuk-body").forEach((p) => {
      p.classList.remove("govuk-body");
      p.classList.add("govuk-body-s");
      p.classList.add("govuk-!-margin-bottom-0");
    });
  });

  return (
    <div ref={ref} class="govuk-inset-text">
      {props.children}
    </div>
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
  h2: H2,
  h3: H3,
  h4: H4,
};
