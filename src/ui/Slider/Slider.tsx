"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { SliderProps, SliderRef } from "./types";
import {
  getSliderStyles,
  getSliderTrackStyles,
  getSliderItemStyles,
  getNavigationButtonStyles,
  getIndicatorStyles,
  getIndicatorContainerStyles,
} from "./styles";
import { cn } from "@/utils";

/**
 * 左箭头图标
 */
const ChevronLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

/**
 * 右箭头图标
 */
const ChevronRightIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

/**
 * Slider组件 - 轮播组件
 * 支持自定义每页显示数量、滑动步长、左侧间距等功能
 *
 * @example
 * ```tsx
 * // 基础用法
 * <Slider
 *   items={[<div>Item 1</div>, <div>Item 2</div>]}
 *   itemsPerPage={2}
 *   slidePerPage={1}
 * />
 *
 * // 带导航和指示器
 * <Slider
 *   items={items}
 *   itemsPerPage={3}
 *   slidePerPage={2}
 *   paddingLeft={20}
 *   showNavigation
 *   showIndicators
 * />
 *
 * // 自动播放
 * <Slider
 *   items={items}
 *   itemsPerPage={2}
 *   slidePerPage={1}
 *   autoPlay
 *   autoPlayInterval={3000}
 *   loop
 * />
 * ```
 */
export const Slider = forwardRef<SliderRef, SliderProps>(
  (
    {
      items,
      itemsPerPage,
      slidePerPage,
      draggable = false,
      paddingLeft = 0,
      gap = 0,
      showNavigation = true,
      leftArrowClassName,
      rightArrowClassName,
      showIndicators = false,
      autoPlay = false,
      autoPlayInterval = 3000,
      loop = false,
      className,
      itemContainerClassName,
      style,
      onSlideChange,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [, setDragCurrentX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [hasDragged, setHasDragged] = useState(false);

    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // 设置默认值：当itemsPerPage为undefined时，默认一页展示4个
    const actualItemsPerPage = itemsPerPage ?? 4;
    // 设置默认值：当slidePerPage为undefined时，默认一次移动1个
    const actualSlidePerPage = slidePerPage ?? 1;

    // 计算总页数
    const totalPages = Math.ceil(items.length / actualSlidePerPage);
    const maxIndex = Math.max(0, totalPages - 1);

    // 当itemsPerPage大于等于items.length时隐藏箭头
    const shouldHideArrows = actualItemsPerPage >= items.length;

    // 计算当前应该显示的items
    // const getVisibleItems = useCallback(() => {
    //   const startIndex = currentIndex * actualSlidePerPage
    //   const endIndex = Math.min(startIndex + actualItemsPerPage, items.length)
    //   return items.slice(startIndex, endIndex)
    // }, [currentIndex, actualSlidePerPage, actualItemsPerPage, items])

    // 滑动到指定索引
    const slideTo = useCallback(
      (index: number) => {
        if (isTransitioning) return;

        const targetIndex = Math.max(0, Math.min(index, maxIndex));
        if (targetIndex === currentIndex) return;

        setIsTransitioning(true);
        setCurrentIndex(targetIndex);
        onSlideChange?.(targetIndex);

        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      },
      [currentIndex, maxIndex, isTransitioning, onSlideChange]
    );

    // 滑动到下一页
    const slideNext = useCallback(() => {
      if (currentIndex < maxIndex) {
        slideTo(currentIndex + 1);
      } else if (loop) {
        slideTo(0);
      }
    }, [currentIndex, maxIndex, loop, slideTo]);

    // 滑动到上一页
    const slidePrev = useCallback(() => {
      if (currentIndex > 0) {
        slideTo(currentIndex - 1);
      } else if (loop) {
        slideTo(maxIndex);
      }
    }, [currentIndex, loop, maxIndex, slideTo]);

    // 获取当前索引
    const getCurrentIndex = useCallback(() => currentIndex, [currentIndex]);

    // 获取总页数
    const getTotalPages = useCallback(() => totalPages, [totalPages]);

    // 暴露给父组件的方法
    useImperativeHandle(
      ref,
      () => ({
        slideTo,
        slideNext,
        slidePrev,
        getCurrentIndex,
        getTotalPages,
      }),
      [slideTo, slideNext, slidePrev, getCurrentIndex, getTotalPages]
    );

    // 自动播放逻辑
    useEffect(() => {
      if (autoPlay && totalPages > 1) {
        autoPlayRef.current = setInterval(() => {
          slideNext();
        }, autoPlayInterval);

        return () => {
          if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
          }
        };
      }
    }, [autoPlay, autoPlayInterval, slideNext, totalPages]);

    // 计算滑动容器的transform
    const getTransform = () => {
      // 使用calc()来考虑gap的影响
      // const itemWidth = `calc((100% - ${gap * (actualItemsPerPage - 1)}px) / ${actualItemsPerPage})`
      const translateX = -(
        currentIndex *
        actualSlidePerPage *
        (100 / actualItemsPerPage)
      );
      return `translateX(${translateX}%)`;
    };

    // 计算滑动容器的样式
    const trackStyle: React.CSSProperties = {
      transform: isDragging
        ? `translateX(${getTransform().match(/translateX\(([^)]+)\)/)?.[1] || "0%"}) translateX(${dragOffset}px)`
        : getTransform(),
      paddingLeft: `${paddingLeft}px`,
      gap: `${gap}px`,
      cursor: draggable ? (isDragging ? "grabbing" : "grab") : "default",
      userSelect: draggable ? "none" : "auto",
      ...style,
    };

    // 计算每个item的宽度
    const getItemWidth = () => {
      if (gap === 0) {
        return `${100 / actualItemsPerPage}%`;
      }
      // 使用calc()来精确计算考虑gap的宽度
      return `calc((100% - ${gap * (actualItemsPerPage - 1)}px) / ${actualItemsPerPage})`;
    };

    const itemStyle: React.CSSProperties = {
      width: getItemWidth(),
      flexShrink: 0,
    };

    // 处理导航按钮点击
    const handleNavigationClick = (direction: "left" | "right") => {
      if (direction === "left") {
        slidePrev();
      } else {
        slideNext();
      }
    };

    // 处理指示器点击
    const handleIndicatorClick = (index: number) => {
      slideTo(index);
    };

    // 拖动事件处理
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!draggable) return;
      e.preventDefault();
      setIsDragging(true);
      setHasDragged(false);
      setDragStartX(e.clientX);
      setDragCurrentX(e.clientX);
      setDragOffset(0);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging || !draggable) return;
      e.preventDefault();
      const deltaX = e.clientX - dragStartX;
      setDragCurrentX(e.clientX);
      setDragOffset(deltaX);

      // 如果移动距离超过阈值，标记为已拖动
      if (Math.abs(deltaX) > 5) {
        setHasDragged(true);
      }
    }, [isDragging, draggable, dragStartX]);

    const handleMouseUp = useCallback(() => {
      if (!isDragging || !draggable) return;
      setIsDragging(false);

      const threshold = 50; // 拖动阈值
      if (Math.abs(dragOffset) > threshold) {
        if (dragOffset > 0) {
          slidePrev();
        } else {
          slideNext();
        }
      }

      setDragOffset(0);

      // 延迟重置拖动状态，防止点击事件触发
      setTimeout(() => {
        setHasDragged(false);
      }, 100);
    }, [isDragging, draggable, dragOffset, slidePrev, slideNext]);

    // 触摸事件处理
    const handleTouchStart = (e: React.TouchEvent) => {
      if (!draggable) return;
      const touch = e.touches[0];
      setIsDragging(true);
      setHasDragged(false);
      setDragStartX(touch.clientX);
      setDragCurrentX(touch.clientX);
      setDragOffset(0);
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
      if (!isDragging || !draggable) return;
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStartX;
      setDragCurrentX(touch.clientX);
      setDragOffset(deltaX);

      // 如果移动距离超过阈值，标记为已拖动
      if (Math.abs(deltaX) > 5) {
        setHasDragged(true);
      }
    }, [isDragging, draggable, dragStartX]);

    const handleTouchEnd = useCallback(() => {
      if (!isDragging || !draggable) return;
      setIsDragging(false);

      const threshold = 50; // 拖动阈值
      if (Math.abs(dragOffset) > threshold) {
        if (dragOffset > 0) {
          slidePrev();
        } else {
          slideNext();
        }
      }

      setDragOffset(0);

      // 延迟重置拖动状态，防止点击事件触发
      setTimeout(() => {
        setHasDragged(false);
      }, 100);
    }, [isDragging, draggable, dragOffset, slidePrev, slideNext]);

    // 添加全局事件监听器
    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        document.addEventListener("touchend", handleTouchEnd);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }, [
      isDragging,
      dragStartX,
      dragOffset,
      handleMouseMove,
      handleMouseUp,
      handleTouchMove,
      handleTouchEnd,
    ]);

    // 处理点击事件，在拖动时屏蔽
    const handleClick = (e: React.MouseEvent) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 检查是否可以滑动
    const canSlidePrev = loop || currentIndex > 0;
    const canSlideNext = loop || currentIndex < maxIndex;

    return (
      <div ref={containerRef} className={getSliderStyles(className)} {...props}>
        {/* 滑动容器 */}
        <div
          ref={trackRef}
          className={getSliderTrackStyles(paddingLeft, gap)}
          style={trackStyle}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(getSliderItemStyles(actualItemsPerPage), itemContainerClassName)}
              style={itemStyle}
              onClick={handleClick}
            >
              {item}
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        {showNavigation && totalPages > 1 && !shouldHideArrows && (
          <>
            <button
              type="button"
              className={cn(
                getNavigationButtonStyles("left", "default", !canSlidePrev),
                leftArrowClassName
              )}
              onClick={() => handleNavigationClick("left")}
              disabled={!canSlidePrev}
              aria-label="上一页"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className={cn(
                getNavigationButtonStyles("right", "default", !canSlideNext),
                rightArrowClassName
              )}
              onClick={() => handleNavigationClick("right")}
              disabled={!canSlideNext}
              aria-label="下一页"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* 指示器 */}
        {showIndicators && totalPages > 1 && (
          <div className={getIndicatorContainerStyles()}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                type="button"
                className={getIndicatorStyles("dot", index === currentIndex)}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`跳转到第${index + 1}页`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
