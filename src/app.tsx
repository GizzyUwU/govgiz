import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import Logo from "/logo.svg";

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
          <Title>Gov Giz</Title>
          <Link rel="icon" href="/haj.svg" />
          <Link rel="stylesheet" href="/assets/govuk-frontend.min.css" />
          <header class="govuk-header" data-module="govuk-header">
            <div class="govuk-header__container govuk-width-container">
              <div class="govuk-header__logo">
                <img
                  style={{
                    transform: "scale(1.4)",
                    "transform-origin": "left center",
                  }}
                  src={Logo}
                ></img>
              </div>
            </div>
          </header>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
