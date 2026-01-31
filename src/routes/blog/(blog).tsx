import { For } from "solid-js";
import { posts } from "~/data/posts";
import { markdownComponents } from "~/components/Markdown";
import { Title } from "@solidjs/meta";

export default function Blogs() {
  return (
    <>
      <Title>All posts</Title>
      <div class="govuk-width-container">
        <h1 class="govuk-heading-l">All Blog Posts</h1>
        <ul class="govuk-list govuk-list--bullet">
          <For each={posts}>
            {(post) => (
              <li class="govuk-body-s">
                <a class="govuk-link" href={`/blog/${post.slug}`}>
                  {post.title}
                </a>
              </li>
            )}
          </For>
        </ul>
      </div>
    </>
  );
}
