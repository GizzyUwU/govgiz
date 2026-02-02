import { visit } from "unist-util-visit";
import { toString as nodeToString } from "hast-util-to-string";
import { refractor } from "refractor";
import tsx from "refractor/tsx";

refractor.register(tsx);

export default function mdxPrism() {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return (tree: any) => {
    visit(tree, "element", (node, _i, parent) => {
      if (node.tagName === "code" && parent?.tagName === "pre") {
        const className = node.properties?.className;
        if (!Array.isArray(className)) return;
        const langClass = className.find((c: string) =>
          c.startsWith("language-"),
        );
        if (!langClass) return;
        const lang = langClass.replace("language-", "");
        parent.properties = { ...(parent.properties || {}), lang };
      }
	  visitor(node, _i, parent)
    });
  };
  
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function visitor(node: any, index: number | undefined, parent: any) {
    if (parent.type !== "mdxJsxFlowElement") {
      return;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const attrs = parent.attributes.reduce((a: any, c: any) => {
      if (c.type === "mdxJsxAttribute") {
        a[c.name] = c.value;
      }
      return a;
    }, {});

    const lang = attrs.lang;
    if (!lang) {
      return;
    }

    const result = refractor.highlight(nodeToString(node), lang);

    node.children = result.children;
  }
}
