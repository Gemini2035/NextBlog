'use client'

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getBlogPosts } from "@/apis/blog";
import { Button, Link } from "@/ui";
import { PostTag } from "../PostTag";
import type { BlogPostDetail, BlogPostListItem } from "@/types/blog";

// 循环图标组件
const RefreshIcon = ({ isRotating }: { isRotating: boolean }) => (
  <svg
    className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

interface RelatedPostsProps {
  post: BlogPostDetail;
  limit?: number;
}

const getRelatedPostsData = (
  post: BlogPostDetail,
  posts: BlogPostListItem[],
  limit: number = 6
) => {
  const sameLocalePosts = posts.filter((candidate) => candidate.id !== post.id)
  const relatedByTags = sameLocalePosts.filter((candidate) =>
    candidate.tags.some((tag) => post.tags.includes(tag))
  )
  const otherPosts = sameLocalePosts.filter((candidate) => !relatedByTags.includes(candidate))

  return [...relatedByTags, ...otherPosts].slice(0, limit)
};

export function RelatedPosts({ post, limit = 6 }: RelatedPostsProps) {
  const t = useTranslations('Posts');
  const locale = useLocale()
  const [posts, setPosts] = useState<BlogPostListItem[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let ignore = false

    const fetchRelatedPosts = async () => {
      const response = await getBlogPosts({ siteLanguage: locale, pageSize: 100 })

      if (!ignore) {
        setPosts(response.data.posts)
      }
    }

    void fetchRelatedPosts()

    return () => {
      ignore = true
    }
  }, [locale])

  const allRelatedPosts = useMemo(
    () => getRelatedPostsData(post, posts, limit),
    [post, posts, limit]
  )
  const [currentPosts, setCurrentPosts] = useState<BlogPostListItem[]>([]);

  useEffect(() => {
    setCurrentPosts(allRelatedPosts.slice(0, 3))
  }, [allRelatedPosts])

  if (allRelatedPosts.length === 0) {
    return null;
  }

  // 换一批功能
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const shuffled = [...allRelatedPosts].sort(() => Math.random() - 0.5);
    setCurrentPosts(shuffled.slice(0, 3));
    setIsRefreshing(false);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{t('relatedPosts')}</h3>
        <Button
          type="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-blue-600! hover:text-blue-800 hover:bg-blue-50"
        >
          <RefreshIcon isRotating={isRefreshing} />
          <span className="ml-2 text-sm">
            {isRefreshing ? t('refreshing') : t('refresh')}
          </span>
        </Button>
      </div>
      
      <div className="flex justify-start overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0">
        <div className="flex gap-4 max-w-4xl">
          {currentPosts.map((relatedPost) => (
            <Link
              key={relatedPost.id}
              href={`/posts/${relatedPost.id}`}
              className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex-1 min-w-[280px] md:min-w-0 max-w-sm"
            >
              <div className="space-y-3 h-full flex flex-col">
                <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {relatedPost.title}
                </h4>

                {relatedPost.description && (
                  <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                    {relatedPost.description}
                  </p>
                )}

                <div className="mt-auto space-y-2">
                  {relatedPost.tags && relatedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <PostTag key={tag} size="small" variant="secondary">
                          {tag}
                        </PostTag>
                      ))}
                    </div>
                  )}
                  
                  <time dateTime={relatedPost.createdAt} className="text-sm text-gray-500">
                    {new Date(relatedPost.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
