// @ts-ignore
import rawPosts from "./posts.json";
import type { Post } from "~/types";
const Posts = rawPosts as unknown as Post[];
export const posts: Post[] = Posts.map((p: Post) => ({
	...p,
	date: new Date(p.date),
}));