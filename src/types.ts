export type Post = {
  title: string;
  date: Date;
  slug: string;
  tags: string[];
  series?: string;
  featuredImage?: string;
  featuredImageDesc?: string;
  featuredImageBGColor?: string;
  ftId?: number;
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
