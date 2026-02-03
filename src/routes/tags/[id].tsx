import type { RouteSectionProps } from "@solidjs/router";
import { type Component, Show, For, createMemo, createSignal } from "solid-js";
import { posts } from "~/data/posts";
import dayjs from "dayjs";
import { tags } from "~/data/tags";
import Fa7SolidMagnifyingGlass from '~icons/fa7-solid/magnifying-glass';

import { A } from "@solidjs/router";


const TagId: Component<RouteSectionProps<{ params: { id: string } }>> = (
  props,
) => {
  const tag = () => props.params.id ? tags[props.params.id] : undefined;
  const [searchInput, setSearchInput] = createSignal("");
  const filteredPosts = createMemo(() => {
    const q = searchInput().toLowerCase();
    if (!q) return tag()?.posts.map((i) => posts[i]) ?? [];
    const postsOnTag = tag()?.posts.map((i) => posts[i]) ?? [];
    return postsOnTag.filter((post) => {
      let dateString = "";
      if (post.date) {
        const d = new Date(post.date);
        const options: Intl.DateTimeFormatOptions = {
          day: "numeric",
          month: "long",
          year: "numeric",
        };
        dateString = d.toLocaleDateString("en-GB", options).toLowerCase();
      }

      return (
        post.slug.toLowerCase().includes(q) ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        dateString.includes(q)
      );
    });
  });

  return (
    <Show
      when={tag()}
      fallback={<p class="govuk-body">No posts with that tag</p>}
    >
      <h2 class="govuk-heading-m">Tag: {tag()?.id}</h2>
      <div class="govuk-form-group">
        <div class="govuk-input__wrapper">
          <input
            class="govuk-input"
            type="text"
            spellcheck="false"
            value={searchInput()}
            placeholder="Project..."
            onInput={(e) => setSearchInput(e.currentTarget.value)}
          />
          <div
            class="govuk-input__suffix"
            style={{
              cursor: "pointer",
              "background-color": "#080",
            }}
            onClick={() => {
              setSearchInput(searchInput().toLowerCase().trim());
            }}
          >
                          <Fa7SolidMagnifyingGlass color="white" />

          </div>
        </div>
      </div>
      <ul class="govuk-task-list">
        <For each={filteredPosts()}>
          {(post) => (
            <li class="govuk-task-list__item govuk-task-list__item--with-link">
              <div class="govuk-task-list__name-and-hint">
                <A
                  class="govuk-link govuk-task-list__link"
                  href={`/blog/${post.slug}`}
                  aria-describedby="company-details-1-status"
                >
                  {post.title}
                </A>
                <div class="govuk-task-list__hint">{post.description}</div>
                <p class="govuk-task-list__hint govuk-body-s govuk-!-margin-bottom-0">
                  {dayjs(post.date).format("DD MMMM YYYY")}
                </p>
              </div>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
};

export default TagId;
