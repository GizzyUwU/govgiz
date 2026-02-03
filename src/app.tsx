import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount, createSignal } from "solid-js";
import { Breadcrumb } from "./components/Breadcrumb";
import { A } from "@solidjs/router";

export default function App() {
  const [ready, setReady] = createSignal(false);

  onMount(async () => {
    document.body.className +=
      "govuk-template__body js-enabled" +
      ("noModule" in HTMLScriptElement.prototype
        ? " govuk-frontend-supported"
        : "");
    // @ts-ignore
    const govuk = await import("govuk-frontend");
    govuk.initAll();
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
            <link rel="icon" sizes="88x31" href="/88x31.svg" />
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
              <div class="govuk-!-display-none"><A href="/kaboom"></A></div>
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
            </div>
          </MetaProvider>
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
