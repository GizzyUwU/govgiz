import { Link, MetaProvider, Title } from "@solidjs/meta";
import { createResource, Show } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount, createSignal } from "solid-js";
import { Breadcrumb } from "./components/Breadcrumb";
import { A } from "@solidjs/router";

async function fetchWebring() {
  const res = await fetch("https://webring.hackclub.com/members.json");
  return res.json() as Promise<{ url: string }[]>;
}

export default function App() {
  const [ready, setReady] = createSignal(false);
  const [members] = createResource(fetchWebring)
  const [prevUrl, setPrevUrl] = createSignal("#");
  const [nextUrl, setNextUrl] = createSignal("#");

  onMount(async () => {
    document.body.className +=
      "govuk-template__body js-enabled" +
      ("noModule" in HTMLScriptElement.prototype
        ? " govuk-frontend-supported"
        : "");
    // @ts-ignore
    const govuk = await import("govuk-frontend");
    govuk.initAll();

    const data = members();
    if (!data) return;

    const currentHostname = new URL(document.referrer || document.location.href).hostname.toLowerCase();
    let index = data.findIndex(m => new URL(m.url).hostname.toLowerCase() === currentHostname);
    if (index === -1) index = 0;

    const prevIndex = (index - 1 + data.length) % data.length;
    const nextIndex = (index + 1) % data.length;

    setPrevUrl(data[prevIndex].url);
    setNextUrl(data[nextIndex].url);
    setReady(true);
  });

  return (
    <Router
      root={(props) => (
        <Suspense
          fallback={
            <div
              style={{
                width: "100%",
                height: "100%",
                "background-color": "black",
              }}
            >
              Loading...
            </div>
          }
        >
          <MetaProvider>
            <Title>Gizzy</Title>
            <Link rel="icon" sizes="88x31" href="/88x31.svg" />
            <Link rel="icon" href="/haj.svg" />
            <Link rel="stylesheet" href="/assets/govuk-frontend.min.css" />
            <div
              style={{
                display: ready() ? "block" : "none",
                width: "100%",
              }}
            >
              <header class="govuk-header" data-module="govuk-header">
                <div class="govuk-header__container govuk-width-container">
                  <div class="govuk-header__logo">
                    <A href="/">
                      <img
                        style={{
                          transform: "scale(1.4)",
                          "transform-origin": "left center",
                        }}
                        src="/logo.svg"
                      ></img>
                    </A>
                  </div>
                </div>
              </header>
              <Suspense
                fallback={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      "background-color": "black",
                    }}
                  >
                    Loading...
                  </div>
                }
              >
                <div class="govuk-width-container govuk-!-text-break-word">
                  <Breadcrumb />
                  {props.children}
                </div>
              </Suspense>
              <Show when={members()} fallback={null}>
                <div class="govuk-width-container" style={{
                  display: "flex",
                  "justify-content": "center",
                }}>
                  <div class="govuk-grid-row" style={{
                    display: "flex",
                    position: "relative",
                    bottom: 0
                  }}>
                    <nav class="govuk-pagination" aria-label="Pagination" style={{
                      display: "flex",
                      "align-items": "center",
                    }}>
                      <div class="govuk-pagination__prev">
                        <a class="govuk-link govuk-pagination__link" href={prevUrl()} target="_parent" rel="prev">
                          <svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" viewBox="0 0 15 13">
                            <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                          </svg>
                          <span class="govuk-pagination__link-title">
                            Previous<span class="govuk-visually-hidden"> site</span>
                          </span>
                        </a>
                      </div>
                      <ul class="govuk-pagination__list">
                        <li class="govuk-pagination__item">
                          <a
                            class="govuk-link govuk-pagination__link"
                            href="https://webring.hackclub.com/"
                            aria-label="Hack Club Webring"
                            aria-current="page"
                            style={{
                              display: "flex",
                              "align-items": "center",
                              "justify-content": "center",
                              "max-height": "50px",
                              "max-width": "100px",
                            }}
                          >
                            <img
                              src="https://assets.hackclub.com/icon-rounded.svg"
                              alt="Hack Club Webring"
                              style={{
                                "height": "50px",
                                "width": "150px",
                              }}
                            />
                          </a>
                        </li>
                      </ul>
                      <div class="govuk-pagination__next">
                        <a class="govuk-link govuk-pagination__link" href={nextUrl()} target="_parent" rel="next">
                          <span class="govuk-pagination__link-title">
                            Next<span class="govuk-visually-hidden"> site</span>
                          </span>
                          <svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" viewBox="0 0 15 13">
                            <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                          </svg>
                        </a>
                      </div>
                    </nav>
                  </div>
                </div>
              </Show>
            </div>
          </MetaProvider>
        </Suspense>
      )
      }
    >
      <FileRoutes />
    </Router >
  );
}
