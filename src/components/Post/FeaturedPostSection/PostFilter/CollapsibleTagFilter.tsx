"use client";

import { useTranslations } from "next-intl";
import { Collapse, CollapsePanel, Button, Tag } from "@/ui";
import { cn } from "@/utils";
import { TagIcon } from "@/assets/icons";
import { TagOption } from "./types";

interface CollapsibleTagFilterProps {
  tags: TagOption[];
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
}

export function CollapsibleTagFilter({
  tags,
  selectedTags,
  onChange,
}: CollapsibleTagFilterProps) {
  const t = useTranslations("PostFilter");

  const handleTagToggle = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      onChange(selectedTags.filter((tag) => tag !== tagValue));
    } else {
      onChange([...selectedTags, tagValue]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedCount = selectedTags.length;

  return (
    <Collapse
      variant="default"
      size="sm"
      className="bg-gray-50 rounded-md"
      defaultActiveKey={["tag-filter"]}
    >
      <CollapsePanel
        key="tag-filter"
        header={
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              {t("tagFilter")} {selectedCount > 0 && `(${selectedCount})`}
            </span>
          </div>
        }
        headerContainerClassName="p-0! border-0! rounded-0!"
        contentClassName="px-3 py-3"
        showArrow={true}
      >
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500">{t("noTags")}</p>
        ) : (
          <div className="relative">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.value}
                  onClick={() => handleTagToggle(tag.value)}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <Tag
                    color={
                      selectedTags.includes(tag.value) ? "primary" : "default"
                    }
                    size="small"
                    className={cn(
                      selectedTags.includes(tag.value)
                        ? "shadow-sm"
                        : "hover:shadow-sm"
                    )}
                  >
                    {tag.label} ({tag.count})
                  </Tag>
                </div>
              ))}
            </div>
            {selectedCount > 0 && (
              <Button
                type="secondary"
                size="xs"
                rounded
                onClick={handleClearAll}
                className=" text-gray-500 absolute right-0 bottom-0"
              >
                {t("clearAllTags")}
              </Button>
            )}
          </div>
        )}
      </CollapsePanel>
    </Collapse>
  );
}
