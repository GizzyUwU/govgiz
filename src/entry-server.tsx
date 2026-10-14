// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="dark light" />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#24273a"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="#eff1f5"
          />
          <style>{`html{background-color:#24273a;color-scheme:dark light}body{margin:0;background-color:#24273a}body.govuk-template__body{background-color:#24273a}@media screen and (prefers-color-scheme:light){html,body,body.govuk-template__body{background-color:#eff1f5}}`}</style>
          {assets}
        </head>
        <body class="govuk-template__body">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
