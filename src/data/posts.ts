// @ts-ignore
import rawPosts from "./posts.json";
import type { Post } from "~/types";
const Posts = rawPosts as unknown as Post[];

/** Invalid dates (e.g. a typo'd frontmatter value) fall back instead of
 *  producing Invalid Date, which would silently break sorting. */
const toDate = (value: unknown, fallback: unknown): Date => {
	const parsed = new Date(value as string);
	if (!Number.isNaN(parsed.getTime())) return parsed;
	return new Date(fallback as string);
};

export const posts: Post[] = Posts.map((p: Post) => ({
	...p,
	date: new Date(p.date),
	createdAt: toDate(
		(p as Post & { createdAt?: unknown }).createdAt ?? p.date,
		p.date,
	),
	updatedAt: toDate(
		(p as Post & { updatedAt?: unknown }).updatedAt ??
			(p as Post & { createdAt?: unknown }).createdAt ??
			p.date,
		p.date,
	),
}));
