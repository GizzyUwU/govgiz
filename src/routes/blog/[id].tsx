import type { RouteSectionProps } from "@solidjs/router";
import {
  For,
  Show,
  lazy,
  Suspense,
  createSignal,
  createMemo,
  onMount,
} from "solid-js";
import { Link, Meta, Title } from "@solidjs/meta";
// @ts-expect-error
import { MDXProvider } from "solid-mdx";
import { posts } from "~/data/posts";
import { markdownComponents, PostImage } from "~/components/Markdown";
import type { Post } from "~/types";
import { Dynamic } from "solid-js/web";
import dayjs from "dayjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs";
import { A, useNavigate } from "@solidjs/router";

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
  const nav = useNavigate();
  const meta = createMemo(() => posts.find((p) => p.slug === props.params.id));
  const [isClient, setIsClient] = createSignal(false);
  onMount(() => {
    if (!meta() || Object.keys(meta()!).length === 0) {
      return nav("/404");
    }
    setIsClient(true);
  });

  return (
    <Show when={meta()}>
      <>
        {(() => {
          const postMeta = meta()!;
          const PostContent = loadPost(postMeta.slug);

          return (
            <>
              <Title>Gizzy - {meta()?.title}</Title>
              <Meta name="og:title" content={meta()!.title} />
              <Meta
                name="og:url"
                content={"https://gizzy.gay/blog/" + meta()!.slug}
              />
              <Link
                rel="canonical"
                href={"https://gizzy.gay/blog/" + meta()!.slug}
              />
              <Meta name="description" content={meta()!.description} />
              <Meta name="og:description" content={meta()!.description} />
              <Meta
                name="application/ld+json"
                content={JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  headline: meta()!.title,
                  image: meta()!.featuredImage,
                  author: {
                    "@type": "Person",
                    name: "Gizzy",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Gov.Giz",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://gizzy.gay/logo.svg",
                    },
                  },
                  datePublished: meta()!.date,
                  dateModified: meta()!.date,
                  description: meta()!.description,
                  mainEntityOfPage: "https://gizzy.gay/blog/" + meta()!.slug,
                })}
              />
              <Show when={meta()!.featuredImage}>
                <PostImage
                  class="govuk-!-margin-top-2"
                  src={meta()?.featuredImage || ""}
                  alt={meta()?.featuredImageDesc || ""}
                  bgColor={meta()?.featuredImageBGColor}
                />
              </Show>
              <br />
              <h1 class="govuk-heading-l govuk-!-margin-bottom-0">
                {meta()!.title}
              </h1>
              <p class="govuk-body-s govuk-!-margin-top-2">
                {dayjs(meta()!.date).format("DD MMMM YYYY")}
                {" - "}
                <Show when={meta()!.tags}>
                  <For each={meta()!.tags}>
                    {(tag, index) => (
                      <>
                        <A href={`/tags/${tag}`} class="govuk-link">
                          {tag}
                        </A>
                        {index() === meta()!.tags!.length - 1 ? "" : ", "}
                      </>
                    )}
                  </For>
                </Show>
                <Show when={meta()!.tag}>
                  <For each={meta()!.tag}>
                    {(tag, index) => (
                      <>
                        <A href={`/tags/${tag}`} class="govuk-link">
                          {tag}
                        </A>
                        {index() === meta()!.tag!.length - 1 ? "" : ", "}
                      </>
                    )}
                  </For>
                </Show>
              </p>
              <div class="govuk-!-margin-top-2"></div>
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
                  <Suspense fallback={<div style={{ background: "black" }} />}>
                    <Dynamic component={PostContent} />
                  </Suspense>
                </MDXProvider>
              </Suspense>
              <Show
                when={posts.filter((p) => p.slug !== meta()!.slug).length > 0}
              >
                <h2 class="govuk-heading-m">Other posts!</h2>
                <ul class="govuk-task-list">
                  {posts
                    .filter((p) => p.slug !== meta()!.slug)
                    .slice(0, 3)
                    .map((p) => (
                      <li class="govuk-task-list__item govuk-task-list__item--with-link">
                        <div class="govuk-task-list__name-and-hint">
                          <A
                            href={`/blog/${p.slug}`}
                            class="govuk-link  govuk-task-list__link"
                          >
                            {p.title}
                          </A>
                          <div class="govuk-task-list__hint">
                            {p.description}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </Show>
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
                  theme="preferred_color_scheme"
                  lang="en"
                  loading="lazy"
                />
              </Show>
            </>
          );
        })()}
      </>
    </Show>
  );
};
export default Blog;
