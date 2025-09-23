"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { SearchResultsGroup, RecommendedContent } from '@/types/search';
import { SearchIcon, ChevronRightIcon } from "@/assets/icons";
import { useTranslations } from "next-intl";

interface SearchResultsProps {
  searchResults: SearchResultsGroup[];
  recommendedContent: RecommendedContent;
  isShowingRecommendations: boolean;
  isSearching: boolean;
  onItemClick: (href: string) => void;
  itemVariants: Variants;
}

export default function SearchResults({
  searchResults,
  recommendedContent,
  isShowingRecommendations,
  isSearching,
  onItemClick,
  itemVariants,
}: SearchResultsProps) {
  const t = useTranslations('Search')

  // 渲染搜索结果组
  const renderSearchResultsGroup = (group: SearchResultsGroup) => (
    <div key={group.title} className="space-y-6">
      {/* 分类标题 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
          {group.title}
        </h3>
      </div>

      {/* 分类内容 */}
      <ul className="space-y-3">
        {group.items.map((result) => (
          <li key={result.item.id}>
            <Link
              href={result.item.href}
              className="block group"
              onClick={() => onItemClick(result.item.href)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 flex items-center">
                  <h4 className="text-base font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                    {result.item.title}
                  </h4>
                  {/* {result.item.description && (
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-200">
                      {result.item.description}
                    </p>
                  )} */}
                  <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  // 渲染推荐内容组
  const renderRecommendedGroup = (
    title: string,
    items: {
      id: string;
      title: string;
      href: string;
      description?: string;
      tags?: string[];
    }[]
  ) => {
    if (items.length === 0) return null;

    return (
      <div key={title} className="space-y-6">
        {/* 分类标题 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
        </div>

        {/* 分类内容 */}
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="block group"
                onClick={() => onItemClick(item.href)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex items-center">
                    <h4 className="text-base font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                      {item.title}
                    </h4>
                    {/* {item.description && (
                      <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-200">
                        {item.description}
                      </p>
                    )} */}
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 ml-2" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // 加载状态
  if (isSearching) {
    return (
      <motion.div
        className="text-center py-12"
        variants={itemVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">{t('searching')}</p>
      </motion.div>
    );
  }

  // 显示搜索结果
  if (!isShowingRecommendations && searchResults.length > 0) {
    return (
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-8">
          {searchResults.map(renderSearchResultsGroup)}
        </div>
      </div>
    );
  }

  // 显示推荐内容
  if (isShowingRecommendations) {
    const groups = [];
    if (recommendedContent.featuredPosts.length > 0) {
      groups.push(
        renderRecommendedGroup(t('recommendedBlog'), recommendedContent.featuredPosts)
      );
    }
    if (recommendedContent.recentPosts.length > 0) {
      groups.push(
        renderRecommendedGroup(t('latestPosts'), recommendedContent.recentPosts)
      );
    }
    if (recommendedContent.navigationLinks.length > 0) {
      groups.push(
        renderRecommendedGroup(t('recommendedLinks'), recommendedContent.navigationLinks)
      );
    }

    return (
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-8">{groups}</div>
      </div>
    );
  }

  // 无结果状态
  return (
    <motion.div
      className="text-center py-12"
      variants={itemVariants}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SearchIcon
        className="h-16 w-16 text-gray-300 mx-auto mb-4"
        strokeWidth={1}
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noResults')}</h3>
      <p className="text-sm text-gray-500">{t('noResultsDescription')}</p>
    </motion.div>
  );
}
