import { Component, For, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { posts } from "~/data/posts";
import { A } from "@solidjs/router";

const capitalize = (s: string) =>
  s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "";

const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const Breadcrumb: Component = () => {
  const location = useLocation();
  const segments = () => location.pathname.split("/").filter(Boolean);

  const getPost = (slug: string) => posts.find((p) => p.slug === slug);

  const breadcrumbItems = () => {
    const segs = segments();
    const items: { label: string; href: string; tags?: string[] }[] = [];

    // always home
    items.push({ label: "Home", href: "/" });

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];

      const href = "/" + segs.slice(0, i + 1).join("/");

      if (segs[i - 1] === "blog") {
        const post = getPost(seg);
        if (post) {
          const tags = post.tags || [];

          if (tags.length) {
            items.push({
              label: "tags",
              href: null,
              tags,
            } as any);
          }

          items.push({
            label: post.title,
            href,
          });

          continue;
        }
      }

      items.push({
        label: capitalize(decodeURIComponent(seg.replace(/-/g, " "))),
        href,
      });
    }

    return items;
  };

  return (
    <Show when={segments().length > 0}>
      <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol class="govuk-breadcrumbs__list">
          <For each={breadcrumbItems()}>
            {(item) => (
              <li class="govuk-breadcrumbs__list-item">
                {item.tags ? (
                  <span>
                    <For each={item.tags}>
                      {(tag, i) => (
                        <>
                          <A
                            class="govuk-breadcrumbs__link"
                            href={`/tags/${tag}`}
                          >
                            {tag}
                          </A>
                          <Show when={item.tags && i() < item.tags.length - 1}>
                            <span class="breadcrumb_tag_sept"> / </span>
                          </Show>
                        </>
                      )}
                    </For>
                  </span>
                ) : (
                  <A class="govuk-breadcrumbs__link" href={item.href}>
                    {item.label}
                  </A>
                )}
              </li>
            )}
          </For>
        </ol>
      </nav>
    </Show>
  );
};
