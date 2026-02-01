import { onMount, onCleanup, createResource, Show, For } from "solid-js";
import { posts } from "~/data/posts";
import Typed from "typed.js";

const fetchStats = async () => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const res = await fetch(
      `https://hackatime.hackclub.com/api/v1/users/gizzy/stats?start_date=${today}`,
    );

    return res.json();
  } catch (error) {
    return { error: "Failed to fetch" };
  }
};

export default function Home() {
  const [stats] = createResource(fetchStats);
  onMount(() => {
    new Typed("#typed-list", {
      strings: ["programmer", "developer", "nerd", "maker"],
      typeSpeed: 50,
      backSpeed: 70,
      loop: true,
    });

    const container = document.querySelector("#typed-time") as HTMLElement;
    let previousTime = new Date().toLocaleTimeString("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
    });

    container.innerHTML = `${previousTime.slice(0, -2)}<span id="changing">${previousTime.slice(-2)}</span>`;
    const changingEl = document.querySelector("#changing") as HTMLElement;

    let typed: Typed | null = null;

    const updateTime = () => {
      const currentTime = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
      });

      const prevSeconds = previousTime.slice(-2);
      const newSeconds = currentTime.slice(-2);

      let firstChangedIndex = 0;
      while (
        firstChangedIndex < 2 &&
        prevSeconds[firstChangedIndex] === newSeconds[firstChangedIndex]
      ) {
        firstChangedIndex++;
      }

      if (firstChangedIndex < 2) {
        const unchanged = newSeconds.slice(0, firstChangedIndex);
        const changed = newSeconds.slice(firstChangedIndex);

        if (typed) typed.destroy();
        changingEl.textContent = unchanged;
        typed = new Typed(changingEl, {
          strings: [unchanged + changed],
          typeSpeed: 50,
          backSpeed: 50,
          onComplete: (self) => {
            self.cursor.remove();
          },
        });
      }

      previousTime = currentTime;
    };

    const interval = setInterval(updateTime, 1000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <main class="govuk-main-wrapper">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 id="header" class="govuk-heading-l">
            Hey! I'm Gizzy
          </h1>
          <p class="govuk-body">
            I'm{" "}
            <span>
              {(() => {
                const birth = new Date("2010-02-15");
                const today = new Date();
                let years = today.getFullYear() - birth.getFullYear();
                if (
                  today.getMonth() < birth.getMonth() ||
                  (today.getMonth() === birth.getMonth() &&
                    today.getDate() < birth.getDate())
                ) {
                  years--;
                }
                return years;
              })()}{" "}
              years old
            </span>{" "}
            and a <span id="typed-list"></span>based in the United Kingdom!
          </p>
          <Show when={stats()}>
            <div class="govuk-inset-text">
              <span id="typed-time"></span> -{" "}
              {stats().data?.human_readable_total
                ? stats().data.human_readable_total.replace(/\s*\d+s/, "")
                : "0m"}{" "}
              coded today!
            </div>
          </Show>
          <h2 class="govuk-heading-m">Projects</h2>
          <ul class="govuk-task-list">
            <For each={posts.filter((post) => post.tags.includes("projects"))}>
              {(post) => (
                <li class="govuk-task-list__item govuk-task-list__item--with-link">
                  <div class="govuk-task-list__name-and-hint">
                    <a
                      class="govuk-link govuk-task-list__link"
                      href={`/blog/${post.slug}`}
                      aria-describedby="company-details-1-status"
                    >
                      {post.title}
                    </a>
                    <div class="govuk-task-list__hint">{post.description}</div>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </main>
  );
}
