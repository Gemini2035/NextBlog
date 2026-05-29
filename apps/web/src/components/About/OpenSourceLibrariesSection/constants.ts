import { ReactIcon, NextJsIcon, TypeScriptIcon, TailwindIcon, PostCSSIcon, ContentlayerIcon, MdxIcon, GrayMatterIcon, FramerMotionIcon, EmotionIcon, AnimateIcon, SWRIcon, RechartsIcon, FuseIcon, ClsxIcon, DebounceIcon, ESLintIcon, PrettierIcon, HuskyIcon, OpenAIIcon, GlobeIcon, GitHubIcon, IconProps } from "@/assets/icons";
import { ComponentType } from "react";

// 图标组件映射表
export const IconMap: Record<string, ComponentType<IconProps>> = {
    ReactIcon,
    NextJsIcon,
    TypeScriptIcon,
    TailwindIcon,
    PostCSSIcon,
    ContentlayerIcon,
    MdxIcon,
    GrayMatterIcon,
    FramerMotionIcon,
    EmotionIcon,
    AnimateIcon,
    SWRIcon,
    RechartsIcon,
    FuseIcon,
    ClsxIcon,
    DebounceIcon,
    ESLintIcon,
    PrettierIcon,
    HuskyIcon,
    OpenAIIcon,
    NextIntlIcon: GlobeIcon, // next-intl 使用 GlobeIcon 作为替代
    LintStagedIcon: GitHubIcon, // lint-staged 使用 GitHubIcon 作为替代
};
