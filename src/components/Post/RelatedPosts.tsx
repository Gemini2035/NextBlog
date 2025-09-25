import Link from "next/link";
import { Post } from "../../../.contentlayer/generated";
import { getEnhancedRelatedPosts } from "@/lib/posts";
import { Tag } from "@/ui";

interface RelatedPostsProps {
  post: Post;
  limit?: number;
}

export function RelatedPosts({ post, limit = 3 }: RelatedPostsProps) {
  const relatedPosts = getEnhancedRelatedPosts(post, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">相关文章</h3>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((relatedPost) => (
          <Link
            key={relatedPost.slug}
            href={`/${post.locale}/posts/${relatedPost.slug}`}
            className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {relatedPost.title}
              </h4>

              {relatedPost.description && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {relatedPost.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                 <time dateTime={relatedPost.date} className="space-x-2">
                   {new Date(relatedPost.date).toLocaleDateString(relatedPost.locale === 'zh' ? 'zh-CN' : relatedPost.locale === 'ja' ? 'ja-JP' : 'en-US', {
                     year: "numeric",
                     month: "short",
                     day: "numeric",
                   })}
                 </time>

                {relatedPost.tags && relatedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {relatedPost.tags.slice(0, 2).map((tag) => (
                      <Tag key={tag} size="sm">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
