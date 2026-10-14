import { For, createSignal, createMemo, Show } from "solid-js";
import { posts } from "~/data/posts";
import type { Post } from "~/types";
import { Title } from "@solidjs/meta";
import Fa7SolidMagnifyingGlass from "~icons/fa7-solid/magnifying-glass";
import { A } from "@solidjs/router";

type SortKey = "updated-desc" | "created-desc" | "updated-asc" | "created-asc";

const formatDate = (value: Date): string =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

type Entry = { post: Post; created: number; updated: number; haystack: string };

const toTime = (v: unknown): number => {
  const t = new Date(v as string | Date).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const entries: Entry[] = posts
  .filter((p) => !p.tag?.includes("projects") && !p.tags?.includes("projects"))
  .map((post) => ({
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
  }));

const sortedEntries: Record<SortKey, Entry[]> = {
  "updated-desc": [...entries].sort((a, b) => b.updated - a.updated),
  "updated-asc": [...entries].sort((a, b) => a.updated - b.updated),
  "created-desc": [...entries].sort((a, b) => b.created - a.created),
  "created-asc": [...entries].sort((a, b) => a.created - b.created),
};

export default function Blogs() {
  const [searchInput, setSearchInput] = createSignal("");
  const [sortKey, setSortKey] = createSignal<SortKey>("updated-desc");
  const filteredPosts = createMemo(() => {
    const q = searchInput().trim().toLowerCase();
    const list = sortedEntries[sortKey()];
    return q ? list.filter((e) => e.haystack.includes(q)) : list;
  });

  return (
    <>
      <Title>All posts</Title>
      <h1
        class="govuk-heading-l"
        style={{
          "margin-bottom": "-8px",
        }}
      >
        All Blog Posts
      </h1>
      <div
        style={{
          display: "flex",
          "flex-wrap": "wrap",
          "align-items": "flex-end",
          gap: "20px",
        }}
      >
        <div class="govuk-form-group" style={{ flex: "1 1 200px" }}>
          <div class="govuk-input__wrapper">
            <input
              class="govuk-input"
              type="text"
              name="projectSearch"
              aria-label="Search posts"
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
        <div class="govuk-form-group">
          <label class="govuk-label" for="sort">
            Sort by
          </label>
          <select
            class="govuk-select"
            style={{
              background: "white !important",
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
      <Show when={filteredPosts().length == 0}>
        <p class="govuk-body">
          {searchInput().trim()
            ? "No blog posts with that name!"
            : "No blog posts have been made yet."}
        </p>
      </Show>
      <ul class="govuk-task-list">
        <For each={filteredPosts()}>
          {(post) => (
            <li
              class="govuk-task-list__item govuk-task-list__item--with-link"
              style={{
                "padding-top": "0",
              }}
            >
              <div class="govuk-task-list__name-and-hint">
                <Show when={post.post.featuredImage}>
                  <div
                    style={{
                      width: "100%",
                      position: "relative",
                      overflow: "hidden",
                      "max-height": "100px",
                      background:
                        post.post.featuredImageBGColor || "transparent",
                    }}
                  >
                    <img
                      src={post.post.featuredImage}
                      alt={post.post.featuredImageDesc || ""}
                      style={{
                        "max-width": "100%",
                        width: "100%",
                        "max-height": "100px",
                        height: "100px",
                        "object-fit": "cover",
                        "object-position": "center",
                        display: "block",
                      }}
                    />
                  </div>
                </Show>
                <div class="govuk-!-margin-top-2" />
                <A
                  data-track="redirect_blog"
                  class="govuk-link govuk-task-list__link"
                  href={`/blog/${post.post.slug}`}
                  aria-describedby="company-details-1-status"
                >
                  {post.post.title}
                </A>
                <div class="govuk-task-list__hint">{post.post.description}</div>
                <div class="govuk-hint govuk-!-font-size-14 govuk-!-margin-top-1 govuk-!-margin-bottom-0">
                  Published {formatDate(post.post.createdAt ?? post.post.date)}
                  <Show
                    when={
                      new Date(
                        post.post.updatedAt ??
                          post.post.createdAt ??
                          post.post.date,
                      ).getTime() !==
                      new Date(post.post.createdAt ?? post.post.date).getTime()
                    }
                  >
                    {" "}
                    • Updated {formatDate(post.post.updatedAt)}
                  </Show>
                </div>
              </div>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
