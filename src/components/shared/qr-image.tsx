import { useTranslations } from '@/i18n/provider'
import qr from 'qrcode'
import { Card } from '../ui/card'

// Real QR matrix so the placeholder reads as a QR; finder patterns are drawn
// solid and data modules faded to make it clear it's only a sample
const sample = qr.create('qeeper', { errorCorrectionLevel: 'L' }).modules
const SAMPLE_SIZE = sample.size
const SAMPLE_MODULES = Array.from({ length: SAMPLE_SIZE ** 2 }, (_, cell) => {
  const row = Math.floor(cell / SAMPLE_SIZE)
  const col = cell % SAMPLE_SIZE
  const near = (n: number) => n < 7
  const far = (n: number) => n >= SAMPLE_SIZE - 7
  const finder =
    (near(row) && near(col)) || (near(row) && far(col)) || (far(row) && near(col))
  return { row, col, finder, filled: sample.get(row, col) }
}).filter(({ filled }) => filled)

interface Props {
  svg: string
  className?: string
}
export const QrImage = ({ svg, className }: Props) => {
  const t = useTranslations()
  return (
    <Card shadow={false} className={className}>
      {svg ? (
        <div
          data-qr-preview
          className="aspect-square h-full w-full"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: svg is sanitized
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div
          data-qr-preview
          aria-label={t('samplePreview')}
          className="aspect-square h-full w-full bg-white p-4"
        >
          <svg
            viewBox={`0 0 ${SAMPLE_SIZE} ${SAMPLE_SIZE}`}
            className="h-full w-full"
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            {SAMPLE_MODULES.map(({ row, col, finder }) => (
              <rect
                key={`${row}-${col}`}
                x={col}
                y={row}
                width={1}
                height={1}
                className={finder ? 'fill-black' : 'fill-black/20'}
              />
            ))}
          </svg>
        </div>
      )}
    </Card>
  )
}
