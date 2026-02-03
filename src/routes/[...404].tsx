import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main
      class="govuk-main-wrapper govuk-main-wrapper--l"
      id="main-content"
      role="main"
    >
      <Title>Gizzy - 404</Title>
      <HttpStatusCode code={404} />
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l">Page not found</h1>
        <p class="govuk-body">
          If you typed the web address, check it is correct.
        </p>
        <p class="govuk-body">
          If you pasted the web address, check you copied the entire address.
        </p>
        <p class="govuk-body">
          If the web address is correct or you selected a link or button, then
          this page no longer exists!{" "}
          <A class="govuk-link" href="/">
            Redirect to the homepage!
          </A>
        </p>
      </div>
    </main>
  );
}
