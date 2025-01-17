import { useMemo } from 'react'

import { generateInvalidFakeContributions, numberWithCommas } from '../../helpers'
import type { ContributionDay, GraphData, RemoteData } from '../../types'
import styles from './Graph.module.css'

interface GraphProps {
  data: RemoteData
  daysLabel?: boolean
}

export default function Graph(props: GraphProps) {
  const res = useMemo<GraphData>(() => {
    if (!props.data.contributions || !props.data.min || !props.data.max) {
      return { total: 0, contributions: generateInvalidFakeContributions(props.data.year) }
    }

    return props.data.contributions.reduce<GraphData>(
      (res, item) => {
        res.contributions.push({
          week: item.week,
          days: item.days.map((day) => {
            res.total += day.count

            const level =
              day.count === props.data.min
                ? 1
                : day.count >= (props.data.p90 ?? Infinity)
                ? 4
                : day.count >= (props.data.p80 ?? Infinity)
                ? 3
                : day.count >= (props.data.median ?? Infinity)
                ? 2
                : day.count >= props.data.min
                ? 1
                : 0

            return { count: day.count, level }
          }),
        })

        return res
      },
      { total: 0, contributions: [] }
    )
  }, [props.data])

  return (
    <div>
      <div className="mb-2 text-sm">
        <span className="mr-2 italic">{props.data.year}:</span>
        {numberWithCommas(res.total)} Contributions
      </div>

      <div className={`${styles['graph']}`}>
        <ul className={`${styles['months']}`}>
          <li>Jan</li>
          <li>Feb</li>
          <li>Mar</li>
          <li>Apr</li>
          <li>May</li>
          <li>Jun</li>
          <li>Jul</li>
          <li>Aug</li>
          <li>Sep</li>
          <li>Oct</li>
          <li>Nov</li>
          <li>Dec</li>
        </ul>

        {props.daysLabel && (
          <ul className={`${styles['days']}`}>
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
        )}

        <ul className={`${styles['grids']} ${styles['blocks']}`}>
          {res.contributions.reduce<React.ReactElement[]>((acc, week, i) => {
            let days = week.days

            if (days.length < 7) {
              const fills = Array.from(Array(7 - days.length)).map<ContributionDay>(() => ({
                count: 0,
                level: -1,
              }))
              if (week.week === 0) {
                days = [...fills, ...week.days]
              } else {
                days = [...week.days, ...fills]
              }
            }

            days.forEach((day, j) => {
              acc.push(<li key={`${i}${j}`} data-level={day.level}></li>)
            })

            return acc
          }, [])}
        </ul>
      </div>
    </div>
  )
}
