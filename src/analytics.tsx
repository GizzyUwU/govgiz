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
      clientId: "eb1c83ae-66f7-4402-9514-745232eff6da",
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
