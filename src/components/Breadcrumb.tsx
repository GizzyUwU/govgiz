import { Component, For, Show } from "solid-js";
import { useLocation } from "@solidjs/router";

const capitalize = (s: string) =>
  s.length > 0 ? s[0].toUpperCase() + s.slice(1) : "";

export const Breadcrumb: Component = () => {
  const location = useLocation(); // reactive location

  const segments = () => location.pathname.split("/").filter(Boolean);
  const paths = () =>
    segments().map((seg, i) => "/" + segments().slice(0, i + 1).join("/"));

  return (
    <Show when={segments().length > 0}>
      <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol class="govuk-breadcrumbs__list">
          <li class="govuk-breadcrumbs__list-item">
            <a class="govuk-breadcrumbs__link" href="/">Home</a>
          </li>

          <For each={segments().slice(0, -1)}>
            {(seg, i) => (
              <li class="govuk-breadcrumbs__list-item">
                <a class="govuk-breadcrumbs__link" href={paths()[i()]}>
                  {capitalize(decodeURIComponent(seg.replace(/-/g, " ")))}
                </a>
              </li>
            )}
          </For>
        </ol>
      </nav>
    </Show>
  );
};
