import type { RouteSectionProps } from "@solidjs/router";
import { For, Show, lazy, Suspense, createSignal, onMount } from "solid-js";
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

const Giscus = lazy(() =>
  import("@giscus/solid").then((mod) => ({ default: mod.default })),
);

const loadPost = (slug: string) =>
  lazy(() =>
    import(`~/routes/blog/posts/${slug}.mdx`).catch(
      () => import(`~/routes/blog/posts/${slug}.md`),
    ),
  );

const Blog = (props: RouteSectionProps<{ params: { id: string } }>) => {
  const meta = () => posts.find((p) => p.slug === props.params.id) as Post;
  const PostContent = loadPost(meta()?.slug || "");
  const [isClient, setIsClient] = createSignal(false);

  onMount(() => setIsClient(true));

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
        {dayjs(meta().date).format("DD MMMM YYYY")}
        {" - "}
        <Show when={meta().tags}>
          <For each={meta().tags}>
            {(tag, index) => (
              <>
                <a href={`/tags/${tag}`} class="govuk-link">
                  {tag}
                </a>
                {index() === meta().tags!.length - 1 ? "" : ", "}
              </>
            )}
          </For>
        </Show>
        <Show when={meta().tag}>
          <For each={meta().tag}>
            {(tag, index) => (
              <>
                <a href={`/tags/${tag}`} class="govuk-link">
                  {tag}
                </a>
                {index() === meta().tag!.length - 1 ? "" : ", "}
              </>
            )}
          </For>
        </Show>
      </p>
      <div class="govuk-visibility-hidden govuk-!-margin-top-2"></div>
      <Suspense
        fallback={
          <div
            style={{
              width: "100%",
              height: "100%",
              "background-color": "black",
            }}
          ></div>
        }
      >
        <MDXProvider components={markdownComponents}>
          <PostContent />
        </MDXProvider>
      </Suspense>
      <Show when={isClient()}>
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
      </Show>
    </>
  );
};
export default Blog;
