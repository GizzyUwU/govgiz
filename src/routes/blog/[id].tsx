import type { RouteSectionProps } from "@solidjs/router";
import { For, Show, lazy, Suspense } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
// @ts-expect-error
import { MDXProvider } from "solid-mdx";
import { posts } from "~/data/posts";
import { markdownComponents, PostImage } from "~/components/Markdown";
import type { Post } from "~/types";
import dayjs from "dayjs";
import Giscus from "@giscus/solid";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs";

const loadPost = (slug: string) =>
  lazy(() =>
    import(`~/routes/blog/posts/${slug}.mdx`).catch(() =>
      import(`~/routes/blog/posts/${slug}.md`)
    )
  );
  
const Blog = (props: RouteSectionProps<{ params: { id: string } }>) => {
  const meta = () => posts.find((p) => p.slug === props.params.id) as Post;
  const PostContent = loadPost(meta()?.slug || "");

  return (
    <>
      <Title>Gizzy - {meta()?.title}</Title>
      <Meta name="og:title" content={meta().title} />
      <Meta name="description" content={meta().description} />
      <Meta name="og:description" content={meta().description} />
      <Show when={meta().featuredImage}>
        <PostImage
          class="govuk-!-margin-top-2"
          src={meta().featuredImage || ""}
          alt={meta().featuredImageDesc || ""}
          bgColor={meta()?.featuredImageBGColor}
        />
      </Show>
      <br />
      <h1 class="govuk-heading-l govuk-!-margin-bottom-0">{meta().title}</h1>
      <p class="govuk-body-s govuk-!-margin-top-2">
        {dayjs(meta().date).format("D MMMM YYYY")}
        {" - "}
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
      <Suspense fallback={<p>Loading post...</p>}>
        <MDXProvider components={markdownComponents}>
          <PostContent />
        </MDXProvider>
      </Suspense>
      <Giscus
        id="comments"
        repo="gizzyuwu/govgiz"
        repoId="R_kgDORD3Y5w"
        category="General"
        categoryId="DIC_kwDORD3Y584C1sjr"
        mapping="pathname"
        strict="1"
        reactions-enabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="catppuccin_latte"
        lang="en"
        loading="lazy"
      />
    </>
  );
};
export default Blog;
