"use client";

import { motion, Variants } from "framer-motion";
import { Link } from "@/ui";
import { SearchResultsGroup, RecommendedContent, SearchResultItem } from '@/types/search';
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
  const hasSearchResults = searchResults.some((group) => group.items.length > 0)
  const { items: recommendedItems } = recommendedContent
  const getSearchGroupTitle = (type: SearchResultsGroup['type']) => {
    if (type === 'posts') {
      return t('searchResults.blogPosts')
    }

    if (type === 'links') {
      return t('searchResults.navigationLinks')
    }

    return t('searchResults.categories')
  }

  // Render a search results group.
  const renderSearchResultsGroup = ({ type, items }: SearchResultsGroup) => (
    <div key={type} className="space-y-6">
      {/* Group title */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
          {getSearchGroupTitle(type)}
        </h3>
      </div>

      {/* Group content */}
      <ul className="space-y-3">
        {items.map(({ id, href, title }) => (
          <li key={id}>
            <Link
              href={href}
              className="block group cursor-pointer"
              onClick={() => onItemClick(href)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 flex items-center">
                  <h4 className="text-base font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                    {title}
                  </h4>
                  {/* {item.description && (
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-200">
                      {item.description}
                    </p>
                  )} */}
                  <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 ml-2" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render a recommended content group.
  const renderRecommendedGroup = (
    title: string,
    items: SearchResultItem[]
  ) => {
    if (items.length === 0) return null;

    return (
      <div key={title} className="space-y-6">
        {/* Group title */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
        </div>

        {/* Group content */}
        <ul className="space-y-3">
          {items.map(({ id, href, title }) => (
            <li key={id}>
              <Link
                href={href}
                className="block group cursor-pointer"
                onClick={() => onItemClick(href)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex items-center">
                    <h4 className="text-base font-medium text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                      {title}
                    </h4>
                    {/* {item.description && (
                      <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-200">
                        {item.description}
                      </p>
                    )} */}
                    <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0 ml-2" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Loading state.
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

  if (isShowingRecommendations && recommendedItems.length > 0) {
    const group = renderRecommendedGroup(t('recommendedContent'), recommendedItems);

    return (
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-8">{group}</div>
      </div>
    );
  }

  if (hasSearchResults) {
    return (
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-8">
          {searchResults
            .filter((group) => group.items.length > 0)
            .map(renderSearchResultsGroup)}
        </div>
      </div>
    );
  }

  // Empty state.
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
