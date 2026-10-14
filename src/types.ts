export type Post = {
  title: string;
  date: Date;
  /** Creation date. Mirrors `date` for posts that predate this field. */
  createdAt: Date;
  /** Last update: frontmatter `updatedAt` for hand-written posts, newest
   *  devlog for synced project posts, otherwise same as `createdAt`. */
  updatedAt: Date;
  slug: string;
  tags?: string[];
  tag?: string[];

  series?: string;
  featuredImage?: string;
  featuredImageDesc?: string;
  featuredImageBGColor?: string;
  ftId?: number;
  /** Set on posts managed by `projectsToMDX.ts` (also stamped into the
   *  .md frontmatter so sync identity survives a posts.json regen).
   *  A post can combine same-name projects from several platforms. */
  projects?: { source: string; id: string | number }[];
  /** Legacy single-project identity — read for backwards compatibility. */
  source?: string;
  projectId?: string | number;
  description: string;
};

export type Tag = {
  id: string;
  posts: number[];
};

export type Series = {
  id: string;
  posts: number[];
};
