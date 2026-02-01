import { For, createSignal, createMemo } from "solid-js";
import { tags } from "~/data/tags";
import { FaSolidMagnifyingGlass } from "solid-icons/fa";

const capitalize = (s: string) =>
  s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "";

const Tags = () => {
  const [searchInput, setSearchInput] = createSignal("");
  const filteredTags = createMemo(() => {
    const q = searchInput().toLowerCase();
    if (!q) return Object.values(tags);

    return Object.values(tags).filter(
      (tag) => tag.id.toLowerCase().includes(q) || String(tag.posts.length).includes(q)
    );
  });

  return (
    <div class="govuk-width-container govuk-!-text-break-word">
      <h1 class="govuk-heading-m">All tags:</h1>
      <div class="govuk-form-group">
        <div class="govuk-input__wrapper">
          <input
            class="govuk-input"
            type="text"
            spellcheck="false"
            value={searchInput()}
            placeholder="Projects"
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
            <FaSolidMagnifyingGlass color="white" />
          </div>
        </div>
      </div>
      <ul class="govuk-task-list">
        <For each={filteredTags()}>
          {(tag) => (
            <li class="govuk-task-list__item govuk-task-list__item--with-link">
              <div class="govuk-task-list__name-and-hint">
                <a
                  class="govuk-link govuk-task-list__link"
                  href={`/tags/${tag.id}`}
                  aria-describedby="company-details-1-status"
                >
                  {capitalize(tag.id)}
                </a>
                <div class="govuk-task-list__hint">
                  {tag.posts.length} Post{tag.posts.length === 1 ? "" : "s"}
                </div>
              </div>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default Tags;
