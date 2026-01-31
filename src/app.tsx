import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import Logo from "/logo.svg";
import { Breadcrumb } from "./components/Breadcrumb";

export default function App() {
  onMount(async () => {
    document.body.className +=
      "govuk-template__body js-enabled" +
      ("noModule" in HTMLScriptElement.prototype
        ? " govuk-frontend-supported"
        : "");
    // @ts-ignore
    const govuk = await import("govuk-frontend");
    govuk.initAll();
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Gizzy</Title>
          <Link rel="icon" href="/haj.svg" />
          <Link rel="stylesheet" href="/assets/govuk-frontend.min.css" />
          <header class="govuk-header" data-module="govuk-header">
            <div class="govuk-header__container govuk-width-container">
              <div class="govuk-header__logo">
                <a href="/">
                  <img
                    style={{
                      transform: "scale(1.4)",
                      "transform-origin": "left center",
                    }}
                    src={Logo}
                  ></img>
                </a>
              </div>
            </div>
          </header>
          <Suspense>
            <div class="govuk-width-container govuk-!-text-break-word">
                <Breadcrumb />
                {props.children}
            </div>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
