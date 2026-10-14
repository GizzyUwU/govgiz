import { For, createSignal, createMemo, Show } from "solid-js";
import { tags } from "~/data/tags";
import Fa7SolidMagnifyingGlass from "~icons/fa7-solid/magnifying-glass";
import { A } from "@solidjs/router";

type Tag = (typeof tags)[keyof typeof tags];
type SortKey = "posts-desc" | "posts-asc" | "name-asc" | "name-desc";
type Entry = { tag: Tag; count: number; haystack: string };

const capitalize = (s: string) =>
  s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "";

const entries: Entry[] = Object.values(tags).map((tag) => ({
  tag,
  count: tag.posts.length,
  haystack: `${tag.id}\n${tag.posts.length}`.toLowerCase(),
}));

const byName = (a: Entry, b: Entry) => a.tag.id.localeCompare(b.tag.id);

const sortedEntries: Record<SortKey, Entry[]> = {
  "posts-desc": [...entries].sort((a, b) => b.count - a.count || byName(a, b)),
  "posts-asc": [...entries].sort((a, b) => a.count - b.count || byName(a, b)),
  "name-asc": [...entries].sort(byName),
  "name-desc": [...entries].sort((a, b) => byName(b, a)),
};

const Tags = () => {
  const [searchInput, setSearchInput] = createSignal("");
  const [sortKey, setSortKey] = createSignal<SortKey>("posts-desc");

  const filteredTags = createMemo(() => {
    const q = searchInput().trim().toLowerCase();
    const list = sortedEntries[sortKey()];
    return q ? list.filter((e) => e.haystack.includes(q)) : list;
  });

  return (
    <>
      <h1
        class="govuk-heading-m"
        style={{
          "margin-bottom": "-10px",
        }}
      >
        All tags:
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
              name="tagSearch"
              aria-label="Search tags"
              spellcheck="false"
              value={searchInput()}
              placeholder="Projects"
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
            <option value="posts-desc">Most posts</option>
            <option value="posts-asc">Fewest posts</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
          </select>
        </div>
      </div>
      <Show when={filteredTags().length === 0}>
        <p class="govuk-body">
          {searchInput().trim()
            ? "No tags with that name!"
            : "No tags have been used yet."}
        </p>
      </Show>
      <ul class="govuk-task-list">
        <For each={filteredTags()}>
          {({ tag, count }) => (
            <li class="govuk-task-list__item govuk-task-list__item--with-link">
              <div class="govuk-task-list__name-and-hint">
                <A
                  data-track="redirect_tag"
                  class="govuk-link govuk-task-list__link"
                  href={`/tags/${tag.id}`}
                  aria-describedby="company-details-1-status"
                >
                  {capitalize(tag.id)}
                </A>
                <div class="govuk-task-list__hint">
                  {count} Post{count === 1 ? "" : "s"}
                </div>
              </div>
            </li>
          )}
        </For>
      </ul>
    </>
  );
};

export default Tags;
