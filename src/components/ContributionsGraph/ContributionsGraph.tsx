import { forwardRef, memo, useImperativeHandle, useMemo, useRef } from 'react'

import { DEFAULT_SIZE, DEFAULT_THEME, sizeProperties, THEMES } from '../../constants'
import type { GraphRemoteData, GraphSettings } from '../../types'
import Graph from './Graph'
import GraphFooter from './GraphFooter'
import GraphHeader from './GraphHeader'

interface ContributionsGraphProps {
  className?: string
  data: GraphRemoteData
  settings?: GraphSettings
}

function ContributionsGraph(props: ContributionsGraphProps, ref: React.Ref<HTMLDivElement | null>) {
  const { className = '', data, settings } = props

  const graphRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => graphRef.current)

  const applyingTheme = useMemo(
    () =>
      THEMES.find(
        (item) => item.name.toLowerCase() === (settings?.theme || DEFAULT_THEME).toLowerCase()
      )!,
    [settings?.theme]
  )

  const themeProperties = {
    '--graph-text-color': applyingTheme.textColor,
    '--graph-bg': applyingTheme.background,
    '--level-0': applyingTheme.levelColors[0],
    '--level-1': applyingTheme.levelColors[1],
    '--level-2': applyingTheme.levelColors[2],
    '--level-3': applyingTheme.levelColors[3],
    '--level-4': applyingTheme.levelColors[4],
  }

  const cssProperties = { ...themeProperties, ...sizeProperties[settings?.size || DEFAULT_SIZE] }

  return (
    <div
      ref={graphRef}
      className={`py-5 md:p-5 ${className}`}
      style={{
        ...cssProperties,
        color: 'var(--graph-text-color, #24292f)',
        backgroundColor: 'var(--graph-bg, #fff)',
      }}
    >
      <GraphHeader username={data.username} />

      <div className="flex flex-col gap-y-6">
        {data.data?.map((data) => (
          <Graph key={data.year} data={data} />
        ))}
      </div>

      {!(settings?.showOrigin === false) && <GraphFooter />}
    </div>
  )
}

export default memo(forwardRef(ContributionsGraph))
