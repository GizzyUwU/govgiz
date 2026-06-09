import { onMount } from "solid-js";

export default function OpenPanel() {
  onMount(() => {
    window.op =
      window.op ||
      (function () {
        var n: any[][] = [];
        return new Proxy(
          function () {
            arguments.length && n.push([].slice.call(arguments));
          },
          {
            get: function (t, r) {
              return "q" === r
                ? n
                : function () {
                    n.push([r].concat([].slice.call(arguments)));
                  };
            },
            has: function (t, r) {
              return "q" === r;
            },
          },
        );
      })();
    
    window.op("init", {
      apiUrl: "https://opapi.gizzy.gay",
      clientId: "cc07a93e-0819-47dd-8e22-efb420c8b5f0",
      trackScreenViews: true,
      trackOutgoingLinks: true,
      trackAttributes: true,
      // sessionReplay: {
      //   enabled: true,
      // },
    });

    const script = document.createElement("script");
    script.src = "https://analytics.gizzy.gay/op1.js";
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  });

  return null;
}
