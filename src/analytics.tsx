export default function OpenPanel() {
  return (
    <>
      <script
        innerHTML={`
        window.op=window.op||function(){var n=[];return new Proxy(function(){arguments.length&&n.push([].slice.call(arguments))},{get:function(t,r){return"q"===r?n:function(){n.push([r].concat([].slice.call(arguments)))}} ,has:function(t,r){return"q"===r}}) }();
        window.op('init', {
	apiUrl: 'https://opapi.gizzy.gay',
          clientId: 'cc07a93e-0819-47dd-8e22-efb420c8b5f0',
          trackScreenViews: true,
          trackOutgoingLinks: true,
          trackAttributes: true,
          // sessionReplay: {
          //   enabled: true,
          // },
          });
          `}
      ></script>
      <script src="https://analytics.gizzy.gay/op1.js" defer async></script>
    </>
  );
}
