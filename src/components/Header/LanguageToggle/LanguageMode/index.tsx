import { LANGUAGES } from "@/constants"
import { Variants, motion } from "framer-motion"

// 语言选择模式组件
interface LanguageModeProps {
    currentLang: string
    onLanguageChange: (langCode: string) => void
    itemVariants: Variants
  }
  
export default function LanguageMode({ currentLang, onLanguageChange, itemVariants }: LanguageModeProps) {
    return (
      <motion.div 
        className="w-full" 
        variants={itemVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ul className="space-y-2" role="listbox" aria-label="语言选择">
          {LANGUAGES.map((lang, index) => (
            <motion.li 
              key={lang.code}
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.03 }}
            >
              <button
                onClick={() => onLanguageChange(lang.code)}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-50 text-gray-900"
                role="option"
                aria-selected={currentLang === lang.code}
              >
                <span className="text-sm font-bold">
                  {currentLang === lang.code 
                    ? `${lang.nativeName} ✓` 
                    : `${lang.nativeName} (${lang.translations[currentLang as keyof typeof lang.translations]})`
                  }
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    )
  }