import {
  Component,
  createResource,
  For,
  Show,
  onMount,
  createSignal,
} from "solid-js";

export const Buttons: Component = () => {
  const [buttons, setButtons] = createSignal<any[]>([]);
  const [failedImgs, setFailedImgs] = createSignal(new Set<string>());

  const fetchButtons = async () => {
    const res = await fetch("/buttons.json");
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  onMount(async () => {
    setButtons(await fetchButtons());
  });

  const markFailed = (image: string) => {
    setFailedImgs((prev) => {
      const next = new Set(prev);
      next.add(image);
      return next;
    });
  };

  return (
    <Show when={buttons().length > 0}>
      <ul class="govuk-footer__inline-list">
        <For each={buttons()}>
          {(button) => (
            <Show when={!failedImgs().has(button.image)}>
              <li class="govuk-footer__inline-list-item">
                <a class="govuk-footer__link" href={button.site}>
                  <img
                    alt={button.name}
                    src={
                      button.ignoreCDN
                        ? button.image
                        : "https://wsrv.nl/?url=" +
                          encodeURIComponent(button.image) +
                          "&output=webp"
                    }
                    onError={() => markFailed(button.image)}
                    style={{
                      "max-height": "31px",
                      "max-width": "88px",
                      height: "31px",
                      width: "88px",
                    }}
                    loading="lazy"
                  />
                </a>
              </li>
            </Show>
          )}
        </For>
      </ul>
    </Show>
  );
};
