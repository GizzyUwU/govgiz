import type { RouteSectionProps } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
// @ts-expect-error
import { MDXProvider } from "solid-mdx";
import { posts } from "~/data/posts";
import { markdownComponents, PostImage } from "~/components/Markdown";
import type { Post } from "~/types";
import dayjs from "dayjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs";

const Blog = (props: RouteSectionProps<unknown>) => {
  const meta = () =>
    posts.find((p) => props.location.pathname.endsWith(p.slug)) as Post;
  console.log(meta());
  const index = () => posts.indexOf(meta());

  const prevMeta = () =>
    index() === posts.length - 1 ? undefined : posts[index() + 1];
  const nextMeta = () => (index() === 0 ? undefined : posts[index() - 1]);

  return (
    <div class="govuk-width-container govuk-!-text-break-word">
      <Title>Gizzy - {meta()?.title}</Title>
      <Meta name="og:title" content={meta().title} />
      <Meta name="description" content={meta().description} />
      <Meta name="og:description" content={meta().description} />
      <Show when={meta().featuredImage}>
        <PostImage
          class="govuk-!-margin-top-2"
          src={meta().featuredImage || ""}
          alt={meta().featuredImageDesc || ""}
        />
      </Show>
      <br />
      <a
        onClick={() => {
          history.back();
        }}
        class="govuk-back-link"
        style={{
          cursor: "pointer",
        }}
      >
        Back
      </a>
      <h1 class="govuk-heading-l govuk-!-margin-bottom-0">{meta().title}</h1>
      <p class="govuk-body-s govuk-!-margin-top-2">
        {dayjs(meta().date).format("D MM YYYY")}
        {" — "}
        <For each={meta().tags}>
          {(tag, index) => (
            <>
              <a href={`/tags/${tag}`} class="govuk-link">
                {tag}
              </a>
              {index() === meta().tags.length - 1 ? "" : ", "}
            </>
          )}
        </For>
      </p>
      <div class="govuk-visibility-hidden govuk-!-margin-top-2"></div>
      <MDXProvider components={markdownComponents}>
        {props.children}
      </MDXProvider>
    </div>
  );
};
export default Blog;
