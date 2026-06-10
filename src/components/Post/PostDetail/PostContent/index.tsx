import styles from './PostContent.module.css'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  return (
    <article className={styles.article} data-article-content>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  )
}
