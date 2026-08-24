import { createSignal, For, Show } from "solid-js";
import "../css/art.css";

const slides = [
  { src: "/art/boykisserArt.png", alt: "Boykisser art of me and bd" },
    { src: "/art/bunnyGuyArt.png", alt: "Art from bunny guy in art of me and bg" },
];

export default function Art() {
  const [active, setActive] = createSignal(0);

  const next = () => setActive((i) => Math.min(i + 1, slides.length - 1));
   const prev = () => setActive((i) => Math.max(i - 1, 0));

  return (
    <>
      <h1 id="header" class="govuk-heading-l">
        Some art that got made for me!
      </h1>

      <div class="carousel-container">
        <div id="default-carousel" class="carousel">
          <div class="carousel-inner">
            <For each={slides}>
              {(slide, i) => (
                <div
                  class="carousel-item"
                  classList={{ active: active() === i() }}
                >
                  <img src={slide.src} class="carousel-image" alt={slide.alt} />
                </div>
              )}
            </For>
          </div>

          <div class="carousel-indicators">
            <For each={slides}>
              {(_, i) => (
                <button
                  type="button"
                  class="indicator-dot"
                  classList={{ active: active() === i() }}
                  onClick={() => setActive(i())}
                  aria-label={`Go to slide ${i() + 1}`}
                />
              )}
            </For>
          </div>

           <Show when={active() > 0}>
          <button type="button" class="carousel-control carousel-control-prev" onClick={prev} aria-label="Previous slide">
            <svg class="control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            </button>
          </Show>
          <Show when={active() < slides.length - 1}>

          <button type="button" class="carousel-control carousel-control-next" onClick={next} aria-label="Next slide">
            <svg class="control-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            </button>
          </Show>
        </div>
      </div>
    </>
  );
}