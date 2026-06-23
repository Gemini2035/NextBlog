import { SanitizedHtml } from '@/components/SanitizedHtml'
import styles from './PostContent.module.css'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return (
    <article className={styles.article} data-article-content>
      <SanitizedHtml
        className={styles.content}
        html={content}
      />
    </article>
  )
}
