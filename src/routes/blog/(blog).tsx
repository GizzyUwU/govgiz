import { For, createSignal, createMemo, Show } from "solid-js";
import { posts } from "~/data/posts";
import { Title } from "@solidjs/meta";
import { FaSolidMagnifyingGlass } from "solid-icons/fa";
import { A } from "@solidjs/router";

export default function Blogs() {
  const [searchInput, setSearchInput] = createSignal("");
  const filteredPosts = createMemo(() => {
    const q = searchInput().toLowerCase();
    if (!q)
      return posts.filter((post) => {
        if (post.tag?.includes("projects") || post.tags?.includes("projects"))
          return;
        return post;
      });

    return posts.filter((post) => {
      if (post.tag?.includes("projects") || post.tags?.includes("projects"))
        return;

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
    <>
      <Title>All posts</Title>
      <div class="govuk-width-container">
        <h1 class="govuk-heading-l">All Blog Posts</h1>
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
              <FaSolidMagnifyingGlass color="white" />
            </div>
          </div>
        </div>
        <Show when={filteredPosts().length == 0}>
          <p class="govuk-body">No blog posts have been made yet.</p>
        </Show>
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
                </div>
              </li>
            )}
          </For>
        </ul>
      </div>
    </>
  );
}
