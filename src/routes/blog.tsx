import type { RouteSectionProps } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
// @ts-expect-error
import { MDXProvider } from "solid-mdx";
import { posts } from "~/data/posts";
import { markdownComponents, PostImage } from "~/components/Markdown";
import type { Post } from "~/types";
import dayjs from "dayjs";
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs';

const Blog = (props: RouteSectionProps<unknown>) => {
	const meta = () =>
		posts.find((p) => props.location.pathname.endsWith(p.slug)) as Post;
	console.log(meta())
	const index = () => posts.indexOf(meta());

	const prevMeta = () =>
		index() === posts.length - 1 ? undefined : posts[index() + 1];
	const nextMeta = () => (index() === 0 ? undefined : posts[index() - 1]);

	return (
		<>
			<div class="govuk-width-container">
				<a onClick={() => {
					history.back()
				}} class="govuk-back-link">Back</a>
				<Title>Gizzy - {meta()?.title}</Title>
				<Meta name="og:title" content={meta().title} />
				<Meta name="description" content={meta().description} />
				<Meta name="og:description" content={meta().description} />

				<Show when={meta().featuredImage}>
					<PostImage
						class="mb-3v saturate-0"
						src={meta().featuredImage || ""}
						alt={meta().featuredImageDesc || ""}
					/>
				</Show>
				<br />
				<h1 class="govuk-heading-l">{meta().title}</h1>
					<div class="govuk-inset-text"><p class="govuk-body-s govuk-!-margin-bottom-0">{dayjs(meta().date).format("D MM YYYY")}</p>
						<p class="govuk-body-s govuk-!-margin-bottom-0">
							<For each={meta().tags}>
								{(tag, index) => (
									<>
										<a
											href={`/tags/${tag}`}
											class="font-medium underline underline-offset-2 italic"
										>
											{tag}
										</a>
										{index() === meta().tags.length - 1 ? "" : ", "}
									</>
								)}
							</For>
						</p>
					</div>

				<MDXProvider components={markdownComponents}>
					{props.children}
				</MDXProvider>

				<div class="mt-3v flex flex-col gap-1v">
					<Show when={prevMeta()} fallback={<div />}>
						<div class="flex gap-1h">
							<span>Previous:</span>
							<a
								class="underline underline-offset-2"
								href={`/blog/${prevMeta()?.slug}`}
							>
								{prevMeta()?.title}
							</a>
						</div>
					</Show>
					<Show when={nextMeta()} fallback={<div />}>
						<div class="flex gap-1h">
							<span>Next:</span>
							<a
								class="underline underline-offset-2"
								href={`/blog/${nextMeta()?.slug}`}
							>
								{nextMeta()?.title}
							</a>
						</div>
					</Show>
				</div>
			</div>
		</>
	);
};
export default Blog;