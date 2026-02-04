import { Component, createResource, For, Show, onMount, createSignal } from "solid-js";

export const Buttons: Component = () => {
    const [buttons, setButtons] = createSignal<any[]>([]);

    const fetchButtons = async () => {
        const res = await fetch("/buttons.json");
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    };

    onMount(async () => {
        setButtons(await fetchButtons());
    });
    return (
        <Show when={buttons().length > 0}>
            <ul class="govuk-footer__inline-list">
                <For each={buttons()}>
                    {(button) => (
                        <li class="govuk-footer__inline-list-item">
                            <a class="govuk-footer__link" href="#">
                                <img alt={button.name} src={button.image} style={{
                                    "max-height": "31px",
                                    "max-width": "88px",
                                    "height": "31px",
                                    "width": "88px"
                                }} />
                            </a>
                        </li>
                    )}
                </For>
            </ul>
        </Show >

    )
}