import { Component, For, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import { posts } from "~/data/posts";

const capitalize = (s: string) =>
  s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "";

const getPostTitle = (slug: string) =>
  posts.find((p) => p.slug === slug)?.title;

export const Breadcrumb: Component = () => {
  const location = useLocation();
  const segments = () => location.pathname.split("/").filter(Boolean);
  const paths = () =>
    segments().map((seg, i) => "/" + segments().slice(0, i + 1).join("/"));

  const labelForSegment = (seg: string, index: number) => {
    if (segments()[index - 1] === "blog") {
      const title = getPostTitle(seg);
      if (title) return title;
    }

    return capitalize(
      decodeURIComponent(seg.replace(/-/g, " "))
    );
  };


  return (
    <Show when={segments().length > 0}>
      <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol class="govuk-breadcrumbs__list">
          <li class="govuk-breadcrumbs__list-item">
            <a class="govuk-breadcrumbs__link" href="/">Home</a>
          </li>

          <For each={segments()}>
            {(seg, i) => (
              <li class="govuk-breadcrumbs__list-item">
                <a class="govuk-breadcrumbs__link" href={paths()[i()]}>
                  {labelForSegment(seg, i())}
                </a>
              </li>
            )}
          </For>
        </ol>
      </nav>
    </Show>
  );
};
