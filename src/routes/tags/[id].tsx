import type { RouteSectionProps } from "@solidjs/router";
import { type Component, Show, For, createMemo, createSignal } from "solid-js";
import { posts } from "~/data/posts";
import type { Post } from "~/types";
import dayjs from "dayjs";
import { tags } from "~/data/tags";
import Fa7SolidMagnifyingGlass from "~icons/fa7-solid/magnifying-glass";
import { A } from "@solidjs/router";

type SortKey = "updated-desc" | "created-desc" | "updated-asc" | "created-asc";
type Entry = { post: Post; created: number; updated: number; haystack: string };

const toTime = (v: unknown): number => {
  const t = new Date(v as string | Date).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const formatDate = (value: Date): string =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const TagId: Component<RouteSectionProps<{ params: { id: string } }>> = (
  props,
) => {
  const tag = () => (props.params.id ? tags[props.params.id] : undefined);
  const [searchInput, setSearchInput] = createSignal("");
  const [sortKey, setSortKey] = createSignal<SortKey>("updated-desc");

  // Rebuilt only when the tag changes
  const entries = createMemo<Entry[]>(() =>
    (tag()?.posts ?? []).map((i) => {
      const post = posts[i];
      return {
        post,
        created: toTime(post.createdAt ?? post.date),
        updated: toTime(post.updatedAt ?? post.createdAt ?? post.date),
        haystack: [
          post.slug,
          post.title,
          post.description,
          post.date ? formatDate(post.date) : "",
        ]
          .join("\n")
          .toLowerCase(),
      };
    }),
  );

  // Re-sorts only when the tag or sort option changes, not on keystrokes
  const sortedPosts = createMemo(() => {
    const [field, direction] = sortKey().split("-") as [
      "created" | "updated",
      "asc" | "desc",
    ];
    const m = direction === "asc" ? 1 : -1;
    return [...entries()].sort((a, b) => m * (a[field] - b[field]));
  });

  // Filtering a pre-sorted list keeps its order
  const filteredPosts = createMemo(() => {
    const q = searchInput().trim().toLowerCase();
    const list = sortedPosts();
    return q ? list.filter((e) => e.haystack.includes(q)) : list;
  });

  return (
    <Show
      when={tag()}
      fallback={<p class="govuk-body">No posts with that tag</p>}
    >
      <h2 class="govuk-heading-m govuk-!-margin-bottom-4">Tag: {tag()?.id}</h2>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          gap: "15px",
          "margin-bottom": "30px",
        }}
      >
        <div class="govuk-form-group govuk-!-margin-bottom-0">
          <label class="govuk-label" for="tagSearch">
            Search
          </label>
          <div class="govuk-input__wrapper" style={{ "max-width": "100%" }}>
            <input
              class="govuk-input"
              type="text"
              id="tagSearch"
              name="tagSearch"
              aria-label="Search posts"
              spellcheck="false"
              value={searchInput()}
              placeholder="Search posts"
              onInput={(e) => setSearchInput(e.currentTarget.value)}
            />
            <div
              class="govuk-input__suffix"
              style={{ cursor: "pointer", "background-color": "#080" }}
              onClick={() => setSearchInput(searchInput().toLowerCase().trim())}
            >
              <Fa7SolidMagnifyingGlass color="white" />
            </div>
          </div>
        </div>
        <div class="govuk-form-group govuk-!-margin-bottom-0">
          <label class="govuk-label" for="sort">
            Sort by
          </label>
          <select
            class="govuk-select"
            style={{
              background: "white !important",
              "max-width": "100%",
            }}
            id="sort"
            name="sort"
            value={sortKey()}
            onChange={(e) => setSortKey(e.currentTarget.value as SortKey)}
          >
            <option value="updated-desc">Recently updated</option>
            <option value="created-desc">Recently published</option>
            <option value="updated-asc">Oldest updated</option>
            <option value="created-asc">Oldest published</option>
          </select>
        </div>
      </div>
      <Show when={filteredPosts().length === 0}>
        <p class="govuk-body">
          {searchInput().trim()
            ? "No posts with that name!"
            : "No posts have been made with this tag yet."}
        </p>
      </Show>
      <ul class="govuk-task-list">
        <For each={filteredPosts()}>
          {({ post }) => (
            <li
              class="govuk-task-list__item govuk-task-list__item--with-link"
              style={{ "padding-top": "0" }}
            >
              <Show when={post.featuredImage}>
                <div
                  style={{
                    top: 0,
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    "max-height": "100px",
                    "justify-content": "center",
                    "align-items": "center",
                    background: post.featuredImageBGColor || "transparent",
                  }}
                >
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageDesc || ""}
                    style={{
                      "object-fit": "cover",
                      "object-position": "center",
                      "max-width": "100%",
                      width: "100%",
                      "max-height": "100px",
                      height: "100px",
                      display: "block",
                    }}
                  />
                </div>
              </Show>
              <div class="govuk-!-margin-top-2" />
              <A
                data-track="redirect_blog"
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
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
};

export default TagId;
