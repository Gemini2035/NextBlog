"use client";

import { useState, useEffect } from "react";
import { Card, Button } from "@/ui";
import { formatDate, cn } from "@/utils";
import type { Post } from "../../../.contentlayer/generated";

interface PostInfoCardProps {
  post: Post;
}

export default function PostInfoCard({ post }: PostInfoCardProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // 测量卡片高度
    const measureCardHeight = () => {
      const element = document.getElementById("post-info-card");
      if (element && !isSticky) {
        const height = element.offsetHeight;
        setCardHeight(height);
      }
    };

    // 使用Intersection Observer检测标兵div
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当标兵div的下边框离开视窗时，卡片变为sticky
          setIsSticky(!entry.isIntersecting);
        });
      },
      {
        root: null, // 使用视窗作为根
        rootMargin: "0px",
        threshold: 0, // 当元素完全离开视窗时触发
      }
    );

    // 初始测量
    measureCardHeight();

    // 监听窗口大小变化
    window.addEventListener("resize", measureCardHeight);

    // 等待DOM更新后设置observer
    const timer = setTimeout(() => {
      const sentinel = document.getElementById("post-info-sentinel");
      if (sentinel) {
        observer.observe(sentinel);
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", measureCardHeight);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isSticky]);

  return (
    <>
      {/* 标兵div - 用于检测位置 */}
      <div
        id="post-info-sentinel"
        className={cn("w-full h-0", `h-[${cardHeight}px]`)}
        aria-hidden="true"
      />

      <div className={cn(isSticky ? "relative" : "")}>
        <Card
          id="post-info-card"
          shadow="lg"
          border="sm"
          rounded
          disabledHover
          className={cn(
            "liquid-transform transition-all duration-500 ease-in-out overflow-visible",
            isSticky
              ? "animate-slide-in-right fixed top-50 right-0 min-w-80 w-30vw z-50 max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl transform -translate-y-1/2"
              : "w-full mb-8 animate-slide-in-top",
            isCollapsed && "transform translate-x-full"
          )}
        >
          <div className="p-6">
            {/* 文章标题 */}
            <h1
              className={cn(
                "font-bold text-gray-900 mb-4",
                isSticky ? "text-xl" : "text-3xl"
              )}
            >
              {post.title}
            </h1>

            {/* 日期信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <time dateTime={post.date}>{formatDate(post.date)}</time>

              {post.updatedAt && post.updatedAt !== post.date && (
                <span>更新于 {formatDate(post.updatedAt)}</span>
              )}
            </div>

            {/* 文章描述 */}
            {post.description && (
              <div className="mb-6">
                <p
                  className={cn(
                    "text-gray-700",
                    isSticky ? "text-sm" : "text-lg"
                  )}
                >
                  {post.description}
                </p>
              </div>
            )}

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div>
                <h3
                  className={cn(
                    "font-semibold text-gray-800 mb-3",
                    isSticky ? "text-sm" : "text-base"
                  )}
                >
                  标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-3 py-1 bg-blue-100 text-blue-800 rounded-full",
                        isSticky ? "text-xs" : "text-sm"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {isSticky && (
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              type="ghost"
              size="sm"
              className="absolute right-full top-1/2 -translate-y-1/2 px-2 py-4 rounded-full transition-all duration-300 z-50 bg-white border border-gray-200 shadow-sm"

              aria-label={isCollapsed ? "展开信息" : "收起信息"}
            >
              <svg
                className={cn(
                  "w-4 h-4 text-gray-600 transition-transform duration-200",
                  isCollapsed ? "rotate-90" : "rotate-270"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          )}
        </Card>
      </div>
    </>
  );
}
