import { Link, Meta, MetaProvider, Style, Title } from "@solidjs/meta";
import { createResource, Show } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount, createSignal } from "solid-js";
import { Breadcrumb } from "./components/Breadcrumb";
import { Buttons } from "./components/Buttons";
import { A } from "@solidjs/router";
import "./css/index.css";
import { Plausible } from "@strootje/solid-plausible";

async function fetchWebring() {
  const res = await fetch("https://webring.hackclub.com/members.json");
  return res.json() as Promise<{ url: string }[]>;
}

export default function App() {
  const [ready, setReady] = createSignal(false);
  const [members] = createResource(fetchWebring);
  const [prevUrl, setPrevUrl] = createSignal("#");
  const [nextUrl, setNextUrl] = createSignal("#");
  const [vh, setVh] = createSignal(0);

  onMount(async () => {
    document.body.className +=
      "govuk-template__body js-enabled" +
      ("noModule" in HTMLScriptElement.prototype
        ? " govuk-frontend-supported"
        : "");
    // @ts-ignore
    const govuk = await import("govuk-frontend");
    govuk.initAll();

    setVh(window.innerHeight);

    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);

    const data = members();
    if (!data) return;

    const currentHostname = new URL(
      document.referrer || document.location.href,
    ).hostname.toLowerCase();
    let index = data.findIndex(
      (m) => new URL(m.url).hostname.toLowerCase() === currentHostname,
    );
    if (index === -1) index = 0;

    const prevIndex = (index - 1 + data.length) % data.length;
    const nextIndex = (index + 1) % data.length;

    setPrevUrl(data[prevIndex].url);
    setNextUrl(data[nextIndex].url);
    setReady(true);
    return () => window.removeEventListener("resize", handleResize);
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
          <Plausible.Provider
            value={{
              apiHost: "https://pawsible.gizzy.gay",
              domain: "gizzy.gay",
            }}
          >
            <Plausible.AutoOutboundTracking />
            <Plausible.AutoPageviewTracking />
            <MetaProvider>
              <Title>Gov.Giz</Title>
              <Link
                rel="preload"
                href="/assets/govuk-frontend.min.css"
                as="style"
              />
              <Link
                rel="preload"
                href="/_build/assets/client-DIJl3Nsl.css"
                as="style"
              />
              <Link
                rel="preconnect"
                href="https://wsrv.nl"
                crossorigin="anonymous"
              />
              <Link
                rel="preconnect"
                href="https://assets.hackclub.com"
                crossorigin="anonymous"
              />
              <Link rel="icon" type="image/svg+xml" sizes="any" href="/haj.svg" />
              <Link rel="icon" sizes="88x31" type="image/svg+xml" href="/88x31.svg" />
              <Link rel="stylesheet" href="/assets/govuk-frontend.min.css" />
              <Meta name="title" content="Welcome to GOV.Giz" />
              <Meta
                name="description"
                content="Gizzy's personal site built with GOV.UK design system package!"
              />
              <Meta
                name="keywords"
                content="gizzy, govgiz, gov.giz, gizgov, giz.gov"
              />
              <Meta name="robots" content="index, follow" />
              <Meta name="language" content="English" />
              <Meta name="revisit-after" content="30 days" />
              <Meta name="author" content="Gizzy" />
              <Meta property="og:type" content="website" />
              <Meta property="og:url" content="https://gizzy.gay/" />
              <Meta property="og:title" content="Welcome to Gov.Giz" />
              <Meta
                property="og:description"
                content="GOV.Giz - The best place to find Gizzy services and information."
              />
              <Meta property="og:image" content="https://gizzy.gay/88x31.svg" />
              <Meta property="twitter:card" content="summary_large_image" />
              <Meta property="twitter:url" content="https://gizzy.gay" />
              <Meta property="twitter:title" content="Welcome to Gov.Giz" />
              <Meta
                property="twitter:description"
                content="GOV.Giz - The best place to find Gizzy services and information."
              />
              <Meta
                property="twitter:image"
                content="https://gizzy.gay/88x31.svg"
              />
              <div
                style={{
                  display: ready() ? "flex" : "none",
                  "flex-direction": "column",
                  "min-height": "100vh",
                  width: "100%",
                }}
              >
                <header class="govuk-header" data-module="govuk-header">
                  <div class="govuk-header__container govuk-width-container">
                    <div class="govuk-header__logo">
                      <A href="/" aria-current="page">
                        <img
                          style={{
                            transform: "scale(1.4)",
                            "transform-origin": "left center",
                          }}
                          alt=""
                          src="/logo.svg"
                        ></img>
                        <span class="govuk-visually-hidden">
                          Go to Gov.Giz homepage
                        </span>
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
                  <main
                    class="govuk-main-wrapper"
                    style={{
                      "padding-top": "0px",
                    }}
                  >
                    <div class="govuk-width-container govuk-!-text-break-word">
                      <Breadcrumb />
                      {props.children}
                    </div>
                  </main>
                </Suspense>
                <Show when={members()} fallback={null}>
                  <div
                    class="govuk-width-container"
                    style={{
                      display: "flex",
                      flex: "1",
                      "justify-content": "center",
                    }}
                  >
                    <div
                      class="govuk-grid-row"
                      style={{
                        display: "flex",
                        position: "relative",
                        bottom: 0,
                      }}
                    >
                      <nav
                        class="govuk-pagination"
                        aria-label="Pagination"
                        style={{
                          display: "flex",
                          "align-items": "center",
                        }}
                      >
                        <div class="govuk-pagination__prev">
                          <a
                            class="govuk-link govuk-pagination__link"
                            href={prevUrl()}
                            target="_parent"
                            rel="prev"
                          >
                            <svg
                              class="govuk-pagination__icon govuk-pagination__icon--prev"
                              xmlns="http://www.w3.org/2000/svg"
                              height="13"
                              width="15"
                              aria-hidden="true"
                              viewBox="0 0 15 13"
                            >
                              <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
                            </svg>
                            <span class="govuk-pagination__link-title">
                              Previous
                              <span class="govuk-visually-hidden"> site</span>
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
                                  height: "50px",
                                  width: "150px",
                                }}
                              />
                            </a>
                          </li>
                        </ul>
                        <div class="govuk-pagination__next">
                          <a
                            class="govuk-link govuk-pagination__link"
                            href={nextUrl()}
                            target="_parent"
                            rel="next"
                          >
                            <span class="govuk-pagination__link-title">
                              Next
                              <span class="govuk-visually-hidden"> site</span>
                            </span>
                            <svg
                              class="govuk-pagination__icon govuk-pagination__icon--next"
                              xmlns="http://www.w3.org/2000/svg"
                              height="13"
                              width="15"
                              aria-hidden="true"
                              viewBox="0 0 15 13"
                            >
                              <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                            </svg>
                          </a>
                        </div>
                      </nav>
                    </div>
                  </div>
                </Show>
                <footer
                  class="govuk-footer"
                  style={{
                    transform: "translateY(100%)",
                    transition: "transform 0.3s",
                  }}
                >
                  <div class="govuk-width-container">
                    <div class="govuk-footer__meta">
                      <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
                        <Buttons />
                        <img
                          class="govuk-footer__licence-logo"
                          alt=""
                          src="/haj.svg"
                          loading="lazy"
                          style={{
                            "max-height": "32px",
                            "max-width": "32px",
                            "vertical-align": "middle",
                          }}
                        />
                        <span class="govuk-footer__licence-description">
                          All content is available under the{" "}
                          <a
                            class="govuk-footer__link"
                            href="/license"
                            rel="license"
                          >
                            MIT Lcense
                          </a>
                          , except where otherwise stated
                        </span>
                      </div>
                      <div class="govuk-footer__meta-item">
                        <a
                          class="govuk-footer__link govuk-footer__copyright-logo copyright-logo-patch"
                          href="/license"
                        >
                          © Copyright of Gizzy, 2026 to{" "}
                          {new Date().getFullYear()}
                        </a>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </MetaProvider>
          </Plausible.Provider>
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
