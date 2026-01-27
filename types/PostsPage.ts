import PostType from "./Post";

type PostsPage = {
  posts: PostType[];
  nextCursor: string | null;
};

export default PostsPage;
