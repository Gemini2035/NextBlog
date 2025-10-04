'use client'

import { Link, Card, Tooltip } from '@/ui'
import { PostTag } from '../PostTag'
import type { Post } from '../../../../.contentlayer/generated'
import { formatDate, cn } from '@/utils'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

interface PostCardProps {
  post: Post
  variant?: 'default' | 'compact'
  showDescription?: boolean
}

interface OverflowIndicatorProps {
  isVisible: boolean
  direction: 'right' | 'down'
  size?: 'sm' | 'md'
  position?: 'title' | 'description'
}

interface TagLayoutInfo {
  visibleTags: string[]
  hiddenCount: number
  showOverflowIndicator: boolean
}

/**
 * 计算标签布局信息，使用贪心算法尽可能展示更多标签
 * 
 * 算法策略：
 * 1. 按宽度排序标签（短标签优先）
 * 2. 贪心选择：逐个添加标签，直到无法容纳更多
 * 3. 智能替换：尝试用更短的标签替换已选择的标签
 * 4. 优化替换：检查是否可以用两个短标签替换一个长标签
 * 
 * 考虑+x标签的宽度，确保布局不会溢出
 */
function calculateTagLayout(
  tags: string[], 
  containerWidth: number, 
  isCompact: boolean
): TagLayoutInfo {
  if (!tags || tags.length === 0) {
    return { visibleTags: [], hiddenCount: 0, showOverflowIndicator: false }
  }

  // 估算单个标签的宽度（基于文本长度和样式）
  const estimateTagWidth = (tag: string): number => {
    const baseWidth = isCompact ? 16 : 20 // 基础padding
    const charWidth = isCompact ? 6 : 7 // 每个字符的近似宽度
    // 考虑中文字符更宽的情况
    const hasChinese = /[\u4e00-\u9fa5]/.test(tag)
    const adjustedCharWidth = hasChinese ? charWidth * 1.2 : charWidth
    return baseWidth + (tag.length * adjustedCharWidth)
  }

  // 估算+x标签的宽度
  const estimateOverflowWidth = (count: number): number => {
    const baseWidth = isCompact ? 12 : 16
    const charWidth = isCompact ? 5 : 6
    const text = `+${count}`
    return baseWidth + (text.length * charWidth)
  }

  // 标签间距
  const gap = isCompact ? 4 : 8
  const maxWidth = containerWidth * 0.9 // 留出10%的缓冲空间

  // 贪心算法：按宽度排序标签，优先选择较短的标签
  const tagsWithWidth = tags.map((tag, index) => ({
    tag,
    width: estimateTagWidth(tag),
    originalIndex: index // 保持原始顺序信息
  }))

  // 按宽度排序（短标签优先），如果宽度相同则保持原始顺序
  tagsWithWidth.sort((a, b) => {
    if (a.width === b.width) {
      return a.originalIndex - b.originalIndex
    }
    return a.width - b.width
  })

  // 贪心选择：尽可能多地选择标签
  const selectedTags: string[] = []
  let totalWidth = 0

  for (const { tag, width } of tagsWithWidth) {
    const wouldNeedOverflow = selectedTags.length < tags.length - 1
    const remainingTags = tags.length - selectedTags.length - 1
    const overflowWidth = wouldNeedOverflow ? estimateOverflowWidth(remainingTags) + gap : 0
    
    const newTotalWidth = totalWidth + width + (selectedTags.length > 0 ? gap : 0) + overflowWidth
    
    if (newTotalWidth <= maxWidth) {
      selectedTags.push(tag)
      totalWidth = newTotalWidth - overflowWidth
    } else {
      // 尝试是否可以用更短的标签替换最后一个已选择的标签
      if (selectedTags.length > 0) {
        const lastSelectedTag = selectedTags[selectedTags.length - 1]
        const lastTagWidth = estimateTagWidth(lastSelectedTag)
        
        // 如果当前标签比最后一个选择的标签更短，尝试替换
        if (width < lastTagWidth) {
          const newTotalWidthWithReplacement = totalWidth - lastTagWidth + width
          if (newTotalWidthWithReplacement + overflowWidth <= maxWidth) {
            selectedTags[selectedTags.length - 1] = tag
            totalWidth = newTotalWidthWithReplacement
          }
        }
      }
      break
    }
  }

  // 如果贪心算法没有选择任何标签，但有空间显示+x标签，则至少显示一个最短的标签
  if (selectedTags.length === 0 && tags.length > 0) {
    const shortestTag = tagsWithWidth[0]
    const overflowWidth = estimateOverflowWidth(tags.length - 1) + gap
    const totalNeededWidth = shortestTag.width + overflowWidth
    
    if (totalNeededWidth <= maxWidth) {
      selectedTags.push(shortestTag.tag)
    }
  }

  // 尝试进一步优化：检查是否可以用两个更短的标签替换一个较长的标签
  if (selectedTags.length > 0) {
    const remainingTags = tagsWithWidth.filter(tagInfo => !selectedTags.includes(tagInfo.tag))
    
    for (let i = 0; i < selectedTags.length; i++) {
      const currentTag = selectedTags[i]
      const currentTagWidth = estimateTagWidth(currentTag)
      
      // 寻找两个更短的标签来替换当前标签
      for (let j = 0; j < remainingTags.length - 1; j++) {
        for (let k = j + 1; k < remainingTags.length; k++) {
          const tag1 = remainingTags[j]
          const tag2 = remainingTags[k]
          const twoTagsWidth = tag1.width + tag2.width + gap
          
          // 如果两个标签的总宽度小于当前标签，且加上+x标签后仍然能放下
          if (twoTagsWidth < currentTagWidth) {
            const newTotalWidth = totalWidth - currentTagWidth + twoTagsWidth
            const remainingCount = tags.length - selectedTags.length - 2
            const overflowWidth = remainingCount > 0 ? estimateOverflowWidth(remainingCount) + gap : 0
            
            if (newTotalWidth + overflowWidth <= maxWidth) {
              // 替换标签
              selectedTags[i] = tag1.tag
              selectedTags.splice(i + 1, 0, tag2.tag)
              totalWidth = newTotalWidth
              
              // 更新剩余标签列表
              remainingTags.splice(k, 1)
              remainingTags.splice(j, 1)
              break
            }
          }
        }
        if (remainingTags.length <= 1) break
      }
    }
  }

  const hiddenCount = tags.length - selectedTags.length
  const showOverflowIndicator = hiddenCount > 0

  // 保持原始标签顺序，但只返回被选中的标签
  const visibleTags = tags.filter(tag => selectedTags.includes(tag))

  return {
    visibleTags,
    hiddenCount,
    showOverflowIndicator
  }
}

function OverflowIndicator({ isVisible, direction, size = 'md', position }: OverflowIndicatorProps) {
  if (!isVisible) return null

  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-sm'
  const arrowChar = direction === 'right' ? '»' : '»'
  const rotation = direction === 'down' ? 'rotate-90' : ''
  
  return (
    <div className={cn(
      "absolute right-1 flex items-center",
      position === 'title' ? 'bottom-1' : 'bottom-1'
    )}>
      <div className={cn(
        "text-gray-400 font-bold animate-pulse",
        sizeClasses,
        rotation
      )}>
        {arrowChar}
      </div>
    </div>
  )
}


export function PostCard({ post, variant = 'default', showDescription = true }: PostCardProps) {
  const t = useTranslations('PostCard')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const descriptionContainerRef = useRef<HTMLDivElement>(null)
  const [isTitleScrolling, setIsTitleScrolling] = useState(false)
  const [isDescriptionScrolling, setIsDescriptionScrolling] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [titleScrollDistance, setTitleScrollDistance] = useState(0)
  const [descriptionScrollDistance, setDescriptionScrollDistance] = useState(0)
  const [tagContainerWidth, setTagContainerWidth] = useState(0)
  const tagContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const titleElement = titleRef.current
    const descriptionElement = descriptionRef.current
    const tagContainerElement = tagContainerRef.current
    if (!titleElement || !descriptionElement) return

    // 检查标题是否超出容器宽度
    const checkTitleOverflow = () => {
      const containerWidth = titleElement.parentElement?.clientWidth || 0
      const textWidth = titleElement.scrollWidth
      const isOverflowing = textWidth > containerWidth
      
      // 计算滚动距离：让标题最右侧刚好到达容器最右侧
      const distance = isOverflowing ? textWidth - containerWidth : 0
      
      setIsTitleScrolling(isOverflowing)
      setTitleScrollDistance(distance)
    }

    // 检查描述是否超出容器高度
    const checkDescriptionOverflow = () => {
      const containerHeight = descriptionElement.parentElement?.clientHeight || 0
      const textHeight = descriptionElement.scrollHeight
      const isOverflowing = textHeight > containerHeight
      
      // 计算滚动距离：让描述最底部刚好到达容器最底部
      const distance = isOverflowing ? textHeight - containerHeight : 0
      
      setIsDescriptionScrolling(isOverflowing)
      setDescriptionScrollDistance(distance)
    }

    // 检查标签容器宽度
    const checkTagContainerWidth = () => {
      if (tagContainerElement) {
        const width = tagContainerElement.clientWidth
        setTagContainerWidth(width)
      }
    }

    const checkOverflow = () => {
      checkTitleOverflow()
      checkDescriptionOverflow()
      checkTagContainerWidth()
    }

    // 延迟检查，确保DOM已渲染
    setTimeout(checkOverflow, 100)
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [post.title, post.description, post.tags])

  const isCompact = variant === 'compact'
  const padding = isCompact ? 'p-4' : 'p-6'
  const titleHeight = isCompact ? 'h-8' : 'h-[4rem]'
  const titleSize = isCompact ? 'text-lg' : 'text-xl'
  const titleTag = isCompact ? 'h3' : 'h2'
  const descriptionHeight = isCompact ? 'h-20' : 'h-36'
  const descriptionSize = isCompact ? 'text-xs' : 'text-sm'
  const tagHeight = isCompact ? 'h-6' : 'h-8'
  const tagSize = isCompact ? 'text-xs px-2 py-1' : ''

  const TitleComponent = titleTag as 'h2' | 'h3'

  // 计算标签布局信息
  const tagLayout = useMemo(() => {
    if (!post.tags || post.tags.length === 0 || tagContainerWidth === 0) {
      return { visibleTags: [], hiddenCount: 0, showOverflowIndicator: false }
    }
    
    return calculateTagLayout(post.tags, tagContainerWidth, isCompact)
  }, [post.tags, tagContainerWidth, isCompact])

  return (
    <Card 
      shadow={isCompact ? "sm" : "md"} 
      rounded 
    >
      <Link 
        href={post.url}
        className="block h-full"
        onMouseEnter={() => {
          setIsHovered(true)
          if (isTitleScrolling || isDescriptionScrolling) {
            setAnimationKey(prev => prev + 1)
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          // 重置动画
          setAnimationKey(prev => prev + 1)
        }}
      >
        <div className={cn(
          isCompact ? "flex flex-col h-full" : "grid grid-rows-[auto_auto_auto] h-full",
          padding,
          isCompact ? "gap-0" : "gap-4"
        )}>
          {isCompact ? (
            <div className="flex-1">
              {/* 标题区域 */}
              <div className={cn(
                titleHeight,
                "flex flex-col justify-center overflow-hidden relative mb-3"
              )}>
                <div ref={titleContainerRef} className="w-full overflow-hidden">
                  <TitleComponent 
                    key={animationKey}
                    ref={titleRef}
                    className={cn(
                      titleSize, "font-bold text-gray-900 leading-tight",
                      "whitespace-nowrap relative transition-all duration-300",
                      isTitleScrolling && isHovered ? "w-max animate-pulse" : "w-full overflow-hidden"
                    )}
                    style={{
                      animation: isTitleScrolling && isHovered ? 'title-scroll 4s ease-out forwards 0.3s' : 'none',
                      '--scroll-distance': `${titleScrollDistance}px`
                    } as React.CSSProperties}
                    title={post.title}
                  >
                    {post.title}
                  </TitleComponent>
                </div>
                <OverflowIndicator 
                  isVisible={isTitleScrolling} 
                  direction="right" 
                  size="sm"
                  position="title"
                />
              </div>
              
              {/* 日期信息 */}
              <div className="text-xs text-gray-500 mb-3">
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                {post.updatedAt && post.updatedAt !== post.date && (
                  <div className="text-xs text-gray-400 mt-1">
                    更新于 {formatDate(post.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* 标题区域 */}
              <div className={cn(
                titleHeight,
                "flex flex-col justify-center overflow-hidden relative"
              )}>
                <div ref={titleContainerRef} className="w-full overflow-hidden">
                  <TitleComponent 
                    key={animationKey}
                    ref={titleRef}
                    className={cn(
                      titleSize, "font-bold text-gray-900 leading-tight",
                      "whitespace-nowrap relative transition-all duration-300",
                      isTitleScrolling && isHovered ? "w-max animate-pulse" : "w-full overflow-hidden"
                    )}
                    style={{
                      animation: isTitleScrolling && isHovered ? 'title-scroll 4s ease-out forwards 0.3s' : 'none',
                      '--scroll-distance': `${titleScrollDistance}px`
                    } as React.CSSProperties}
                    title={post.title}
                  >
                    {post.title}
                  </TitleComponent>
                </div>
                <OverflowIndicator 
                  isVisible={isTitleScrolling} 
                  direction="right" 
                  size="md"
                  position="title"
                />
              </div>
              
              {/* 内容区域 */}
              {showDescription && (
                <div className={cn(
                  descriptionHeight,
                  "flex flex-col gap-2 overflow-hidden"
                )}>
                  {post.description && (
                    <div ref={descriptionContainerRef} className="flex-1 overflow-hidden relative">
                      <p 
                        key={animationKey}
                        ref={descriptionRef}
                        className={cn(
                          "text-gray-600 leading-relaxed transition-all duration-300",
                          descriptionSize,
                          isDescriptionScrolling && isHovered ? "animate-pulse" : ""
                        )}
                        style={{
                          animation: isDescriptionScrolling && isHovered ? 'description-scroll 4s ease-out forwards 0.3s' : 'none',
                          '--scroll-distance': `${descriptionScrollDistance}px`
                        } as React.CSSProperties}
                        title={post.description}
                      >
                        {post.description}
                      </p>
                      <OverflowIndicator 
                        isVisible={isDescriptionScrolling} 
                        direction="down" 
                        size="md"
                        position="description"
                      />
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 flex-shrink-0">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    {post.updatedAt && post.updatedAt !== post.date && (
                      <div className="text-xs text-gray-400 mt-1">
                        更新于 {formatDate(post.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* 标签区域 */}
          {post.tags && post.tags.length > 0 && (
            <div 
              ref={tagContainerRef}
              className={cn(
                tagHeight,
                "flex items-center overflow-hidden",
                isCompact ? "gap-1" : "gap-2"
              )}
            >
              <div className="flex items-center overflow-hidden w-full gap-1">
                {/* 显示的标签 */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {tagLayout.visibleTags.map((tag: string) => (
                    <PostTag key={tag} size="small" compact className={cn("flex-shrink-0", tagSize)}>
                      {tag}
                    </PostTag>
                  ))}
                </div>
                
                {/* 隐藏标签的提示 */}
                {tagLayout.showOverflowIndicator && (
                  <div className="flex-shrink-0 flex items-center">
                    <Tooltip 
                      title={
                        <div className="space-y-2">
                          <div className="text-xs text-gray-300 font-medium">
                            {t('remainingTags')}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(tagLayout.visibleTags.length).map((tag: string) => (
                              <PostTag key={tag} size="small" inTooltip>
                                {tag}
                              </PostTag>
                            ))}
                          </div>
                        </div>
                      }
                      placement="top"
                      theme="light"
                      delay={200}
                    >
                      <span className={cn(
                        "text-gray-500 text-xs font-medium cursor-pointer hover:text-gray-700 transition-colors px-1 rounded",
                        isCompact ? "text-xs" : "text-xs"
                      )}>
                        +{tagLayout.hiddenCount}
                      </span>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </Card>
  )
}