import type { WeddingTemplateProps } from '../types'
import { Template01 } from './Template01'
import { cn } from '../utils'

export function WeddingRenderer(props: WeddingTemplateProps) {
  const layout = props.wedding.templateId
  const className =
    layout === 'template-02'
      ? 'template-minimal'
      : layout === 'template-03'
        ? 'template-traditional'
        : layout === 'template-04'
          ? 'template-editorial'
          : layout === 'template-05'
            ? 'template-floral'
            : 'template-modern'

  return (
    <div className={cn(className, props.wedding.fontPreset === 'sans' && 'font-sans')}>
      <Template01 {...props} />
    </div>
  )
}
