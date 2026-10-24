import { onMount } from "solid-js";

declare global {
  interface Window {
    plausible: any;
  }
}

export default function Plausible() {
  onMount(() => {
    window.plausible =
      window.plausible ||
      function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
    window.plausible.init =
      window.plausible.init ||
      function (i: any) {
        window.plausible.o = i || {};
      };
    window.plausible.init();

    const script = document.createElement("script");
    script.src = "https://pble.gizzy.gay/js/pa-3IJyHMz7Gcp3Zlmkm-xX-.js";
    script.async = true;

    document.head.appendChild(script);
  });

  return null;
}
