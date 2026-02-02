import { onMount, onCleanup, createResource, Show, For } from "solid-js";
import { FaSolidArrowRight } from "solid-icons/fa";
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
    return { error: "Failed to fetch hackatime stats" };
  }
};

const fetchGithub = async (): Promise<{
  public_repos?: number;
  followers?: number;
  error?: string;
}> => {
  try {
    const res = await fetch("https://api.github.com/users/gizzyuwu");
    return res.json();
  } catch (error) {
    return { error: "Failed to fetch github" };
  }
};

const fetchStarsFrom100 = async (): Promise<number> => {
  try {
    const res = await fetch(
      "https://api.github.com/users/gizzyuwu/repos?per_page=100",
    );

    const data = (await res.json()) as Record<string, any>[];
    return data.reduce(
      (acc: number, repo: any) => acc + repo.stargazers_count,
      0,
    );
  } catch (error) {
    return 0;
  }
};

export default function Home() {
  const [stats] = createResource(fetchStats);
  const [github] = createResource(fetchGithub);
  const [stars] = createResource(fetchStarsFrom100);

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

    const birthdayEl = document.querySelector("#birthday-count") as HTMLElement;
    let previousBirthday = "";

    let typedBirthday: Typed | null = null;
    const birth = new Date("2010-02-15");

    const updateBirthday = () => {
      const today = new Date();
      let years = today.getFullYear() - birth.getFullYear();
      if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
          today.getDate() < birth.getDate())
      ) {
        years--;
      }

      let output: string = "";
      const ageEl = document.querySelector("#age") as HTMLElement;
      ageEl.textContent = `${years} years so far`

      if (today.getMonth() === birth.getMonth()) {
        ageEl.textContent = `${years} years so far, and I'm gonna have survived`

        const birthdayThisYear = new Date(
          today.getFullYear(),
          birth.getMonth(),
          birth.getDate(),
        );
        const msLeft = birthdayThisYear.getTime() - today.getTime();

        if (msLeft > 0) {
          const days = Math.floor(msLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((msLeft / (1000 * 60)) % 60);

          output = `${years + 1} in ${days}d ${hours}h and ${minutes}m.`;
        }
      }

      let firstChangedIndex = 0;
      while (
        firstChangedIndex < output.length &&
        previousBirthday[firstChangedIndex] === output[firstChangedIndex]
      ) {
        firstChangedIndex++;
      }

      if (firstChangedIndex < output.length) {
        const unchanged = output.slice(0, firstChangedIndex);
        const changed = output.slice(firstChangedIndex);

        if (typedBirthday) typedBirthday.destroy();
        birthdayEl.textContent = unchanged;
        typedBirthday = new Typed(birthdayEl, {
          strings: [unchanged + changed],
          typeSpeed: 50,
          backSpeed: 50,
          onComplete: (self) => self.cursor.remove(),
        });
      }

      previousBirthday = output;
    };

    updateBirthday();
    const birthdayInterval = setInterval(updateBirthday, 1000);
    onCleanup(() => clearInterval(birthdayInterval));
  });

  return (
    <main class="govuk-main-wrapper">
      <h1 id="header" class="govuk-heading-l">
        Hey! I'm Gizzy
      </h1>
      <p class="govuk-body govuk-!-margin-bottom-0">
        I've survived  <span id="age"></span> <span id="birthday-count"></span>
      </p>
      <p class="govuk-body">
        I'm a <span id="typed-list"></span>based in the United Kingdom!
      </p>
      <Show when={stats()}>
        <div class="govuk-inset-text govuk-!-margin-bottom-2">
          <p class="govuk-body-s">
            <span id="typed-time"></span> -{" "}
            {stats().data?.human_readable_total
              ? stats().data.human_readable_total.replace(/\s*\d+s/, "")
              : "0m"}{" "}
            spent writing code -{" "}
            <Show when={!github()?.error}>
              {github()?.followers} followers and {stars()} stars on github!
            </Show>
          </p>
        </div>
      </Show>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
      <div class="govuk-grid-column-one-thrd-from-desktop govuk-!-margin-bottom-0">
        <h2 class="govuk-heading-m">Page Navigation</h2>
        <ul class="govuk-list govuk-grid-row">
          <li
            class="govuk-grid-column-one-third"
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.6rem",
            }}
          >
            <FaSolidArrowRight size="16" />
            <a class="govuk-link" href="/details">
              Details
            </a>
          </li>
          <li
            class="govuk-grid-column-one-third"
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.6rem",
            }}
          >
            <FaSolidArrowRight size="16" />
            <a class="govuk-link" href="/tags/projects">
              Projects
            </a>
          </li>

          <li
            class="govuk-grid-column-one-third"
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.6rem",
            }}
          >
            <FaSolidArrowRight size="16" />
            <a class="govuk-link" href="/blog">
              Blog Posts
            </a>
          </li>

          <li
            class="govuk-grid-column-one-third"
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.6rem",
            }}
          >
            <FaSolidArrowRight size="16" />
            <a class="govuk-link" href="/88x31">
              88x31
            </a>
          </li>
        </ul>
      </div>
      <Show
        when={
          posts &&
          posts?.filter((post) => post.tags?.includes("projects")).length > 0
        }
      >
        <h2 class="govuk-heading-m">Latest Projects</h2>
        <ul class="govuk-task-list">
          <For
            each={posts
              .filter(
                (post) =>
                  post.tags?.includes("projects") ||
                  post.tag?.includes("projects"),
              )
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .slice(0, 3)}
          >
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
      </Show>
    </main>
  );
}
