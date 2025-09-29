"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from "@/utils";
import { 
  PaginationProps, 
  PaginationItemProps, 
  PaginationJumpProps,
  PaginationSizeChangerProps,
  PaginationQuickJumperProps
} from "./types";
import { 
  getPaginationStyles, 
  getPaginationItemStyles,
  getPaginationJumpStyles,
  getPaginationSizeChangerStyles,
  getPaginationQuickJumperStyles,
  getPaginationTotalStyles,
  getPaginationSimpleStyles
} from "./styles";
import { 
  PrevIcon, 
  NextIcon, 
  FirstIcon, 
  LastIcon, 
  JumpPrevIcon, 
  JumpNextIcon 
} from '../icons';

// 分页项组件
function PaginationItem({ 
  page, 
  active = false, 
  disabled = false, 
  onClick, 
  className,
  ellipsis = false,
  children 
}: PaginationItemProps) {
  const handleClick = () => {
    if (!disabled && !ellipsis && onClick) {
      onClick(page);
    }
  };

  return (
    <button
      className={getPaginationItemStyles(active, disabled, ellipsis, className)}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children || page}
    </button>
  );
}

// 跳转按钮组件
function PaginationJump({ 
  direction, 
  onClick, 
  disabled = false, 
  className,
  icon 
}: PaginationJumpProps) {
  const t = useTranslations('Pagination');
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={getPaginationJumpStyles(disabled, className)}
      onClick={handleClick}
      disabled={disabled}
      type="button"
      title={direction === 'prev' ? t('jumpPrev') : t('jumpNext')}
    >
      {icon}
    </button>
  );
}

// 每页条数选择器组件
function PaginationSizeChanger({ 
  current, 
  pageSize, 
  pageSizeOptions, 
  onChange, 
  disabled = false,
  className 
}: PaginationSizeChangerProps) {
  const t = useTranslations('Pagination');
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    onChange(current, newPageSize);
  };

  return (
    <div className={getPaginationSizeChangerStyles(className)}>
      <span className="text-gray-600">{t('itemsPerPage')}</span>
      <select
        value={pageSize}
        onChange={handleChange}
        disabled={disabled}
        className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
      >
        {pageSizeOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-gray-600">{t('items')}</span>
    </div>
  );
}

// 快速跳转组件
function PaginationQuickJumper({ 
  current, 
  totalPages, 
  onJump, 
  disabled = false,
  className 
}: PaginationQuickJumperProps) {
  const t = useTranslations('Pagination');
  const [jumpValue, setJumpValue] = useState('');

  const handleJump = () => {
    const page = parseInt(jumpValue);
    if (page >= 1 && page <= totalPages) {
      onJump(page);
      setJumpValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };

  return (
    <div className={getPaginationQuickJumperStyles(className)}>
      <span className="text-gray-600">{t('jumpTo')}</span>
      <input
        type="number"
        value={jumpValue}
        onChange={(e) => setJumpValue(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
        placeholder={t('page')}
        min="1"
        max={totalPages}
      />
      <span className="text-gray-600">{t('page')}</span>
    </div>
  );
}

// 主分页组件
export function Pagination({
  current: controlledCurrent,
  defaultCurrent = 1,
  pageSize: controlledPageSize,
  defaultPageSize = 10,
  total = 0,
  onChange,
  onShowSizeChange,
  showQuickJumper = false,
  showSizeChanger = false,
  pageSizeOptions = ['10', '20', '50', '100'],
  showTotal = false,
  showPrevNextJumpers = true,
  showFirstLastJumpers = false,
  disabled = false,
  hideOnSinglePage = false,
  size = 'middle',
  align = 'left',
  className,
  style,
  showLessItems = false,
  simple = false,
  prevIcon,
  nextIcon,
  firstIcon,
  lastIcon,
  jumpPrevIcon,
  jumpNextIcon
}: PaginationProps) {
  const t = useTranslations('Pagination');
  const [current, setCurrent] = useState(controlledCurrent ?? defaultCurrent);
  const [pageSize, setPageSize] = useState(controlledPageSize ?? defaultPageSize);

  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  // 同步受控状态
  useEffect(() => {
    if (controlledCurrent !== undefined) {
      setCurrent(controlledCurrent);
    }
  }, [controlledCurrent]);

  useEffect(() => {
    if (controlledPageSize !== undefined) {
      setPageSize(controlledPageSize);
    }
  }, [controlledPageSize]);

  // 如果只有一页且设置了隐藏，则不渲染
  if (hideOnSinglePage && totalPages <= 1) {
    return null;
  }

  // 简单模式
  if (simple) {
    return (
      <div className={getPaginationSimpleStyles(className)} style={style}>
        <input
          type="number"
          value={current}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              setCurrent(page);
              onChange?.(page, pageSize);
            }
          }}
          disabled={disabled}
          className="w-12 px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
          min="1"
          max={totalPages}
        />
        <span className="text-gray-500">/</span>
        <span className="text-gray-600">{totalPages}</span>
      </div>
    );
  }

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPrevEllipsis = current > 4;
    const showNextEllipsis = current < totalPages - 3;

    if (showPrevEllipsis) {
      pages.push(1);
      if (current > 5) {
        pages.push('prev-ellipsis');
      }
    }

    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (showNextEllipsis) {
      if (current < totalPages - 4) {
        pages.push('next-ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page !== current && page >= 1 && page <= totalPages) {
      setCurrent(page);
      onChange?.(page, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newTotalPages = Math.ceil(total / newPageSize);
    const newCurrent = Math.min(current, newTotalPages);
    
    setPageSize(newPageSize);
    setCurrent(newCurrent);
    onShowSizeChange?.(newCurrent, newPageSize);
    onChange?.(newCurrent, newPageSize);
  };

  const handleJumpPrev = () => {
    const newPage = Math.max(1, current - 5);
    handlePageChange(newPage);
  };

  const handleJumpNext = () => {
    const newPage = Math.min(totalPages, current + 5);
    handlePageChange(newPage);
  };

  const handleQuickJump = (page: number) => {
    handlePageChange(page);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={getPaginationStyles(size, align, className)} style={style}>
      {/* 显示总数 */}
      {showTotal && (
        <div className={getPaginationTotalStyles()}>
          {typeof showTotal === 'function' 
            ? showTotal(total, [(current - 1) * pageSize + 1, Math.min(current * pageSize, total)])
            : t('total', { total })
          }
        </div>
      )}

      {/* 首页按钮 */}
      {showFirstLastJumpers && current > 1 && (
        <button
          className={getPaginationJumpStyles(disabled)}
          onClick={() => handlePageChange(1)}
          disabled={disabled}
          type="button"
          title={t('first')}
        >
          {firstIcon || <FirstIcon />}
        </button>
      )}

      {/* 上一页按钮 */}
      {current > 1 && (
        <button
          className={getPaginationJumpStyles(disabled)}
          onClick={() => handlePageChange(current - 1)}
          disabled={disabled}
          type="button"
          title={t('previous')}
        >
          {prevIcon || <PrevIcon />}
        </button>
      )}

      {/* 向前跳转按钮 */}
      {showPrevNextJumpers && current > 4 && (
        <PaginationJump
          direction="prev"
          onClick={handleJumpPrev}
          disabled={disabled}
          icon={jumpPrevIcon || <JumpPrevIcon />}
        />
      )}

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <PaginationItem
              key={`${page}-${index}`}
              page={0}
              ellipsis
              className="cursor-default"
            >
              ...
            </PaginationItem>
          );
        }

        return (
          <PaginationItem
            key={page}
            page={page}
            active={page === current}
            disabled={disabled}
            onClick={handlePageChange}
          />
        );
      })}

      {/* 向后跳转按钮 */}
      {showPrevNextJumpers && current < totalPages - 3 && (
        <PaginationJump
          direction="next"
          onClick={handleJumpNext}
          disabled={disabled}
          icon={jumpNextIcon || <JumpNextIcon />}
        />
      )}

      {/* 下一页按钮 */}
      {current < totalPages && (
        <button
          className={getPaginationJumpStyles(disabled)}
          onClick={() => handlePageChange(current + 1)}
          disabled={disabled}
          type="button"
          title={t('next')}
        >
          {nextIcon || <NextIcon />}
        </button>
      )}

      {/* 末页按钮 */}
      {showFirstLastJumpers && current < totalPages && (
        <button
          className={getPaginationJumpStyles(disabled)}
          onClick={() => handlePageChange(totalPages)}
          disabled={disabled}
          type="button"
          title={t('last')}
        >
          {lastIcon || <LastIcon />}
        </button>
      )}

      {/* 每页条数选择器 */}
      {showSizeChanger && (
        <PaginationSizeChanger
          current={current}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onChange={handlePageSizeChange}
          disabled={disabled}
        />
      )}

      {/* 快速跳转 */}
      {showQuickJumper && (
        <PaginationQuickJumper
          current={current}
          totalPages={totalPages}
          onJump={handleQuickJump}
          disabled={disabled}
        />
      )}
    </div>
  );
}
