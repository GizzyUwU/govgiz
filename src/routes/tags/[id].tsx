import type { RouteSectionProps } from "@solidjs/router";
import { type Component, Show, For } from "solid-js";
import { posts } from "~/data/posts";
import dayjs from "dayjs";
import { tags } from "~/data/tags";

const TagId: Component<RouteSectionProps<{ params: { id: string } }>> = (
  props,
) => {
  const tag = () => (props.params.id ? tags[props.params.id] : undefined);
  return (
      <Show when={tag()} fallback={<div>No posts with that tag</div>}>
          <h2 class="govuk-heading-m">Tag: {tag()?.id}</h2>
          <ul class="govuk-list govuk-list--bullet">
            <For each={tag()?.posts.map((i) => posts[i]) ?? []}>
              {(post) => (
                <li class="govuk-body-s">
                  <a class="govuk-link" href={`/blog/${post.slug}`}>
                    {post.title}
                  </a>{" "}
                  -{" "}
                  <span class="text-xs leading-1 text-slate-600 dark:text-slate-400">
                    {dayjs(post.date).format("MMMM YYYY")}
                  </span>
                </li>
              )}
            </For>
          </ul>
      </Show>
  );
};

export default TagId;
