import splitbee from '@splitbee/web'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { DEFAULT_SIZE, DEFAULT_THEME, SITE_HOST } from '../constants'
import type { GraphSettings } from '../types'
import { iconShare, iconUpRight } from './icons'
import Popover from './kit/Popover'

interface ShareButtonProps {
  username?: string
  settings?: GraphSettings
}

export default function ShareButton({ username, settings }: ShareButtonProps) {
  const [shareUrl, setShareUrl] = useState<string>()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (username && settings) {
      const url = new URL(`${SITE_HOST.HOST}/share/${username}`)

      if (settings.size && settings.size !== DEFAULT_SIZE) {
        url.searchParams.set('size', settings.size)
      }
      if (settings.theme && settings.theme !== DEFAULT_THEME) {
        url.searchParams.set('theme', settings.theme)
      }

      setShareUrl(url.toString())
    }
  }, [username, settings])

  return (
    <Popover
      content={
        <div className="max-w-[90vw] rounded-md pt-5 md:max-w-[min(40vw,300px)]">
          {shareUrl && (
            <div className="overflow-hidden rounded bg-main-100/80 p-3 text-xs text-main-500">
              <div className="break-all">{shareUrl}</div>

              <div className="mt-4 flex h-7 items-center justify-end gap-x-2">
                <Link passHref href={shareUrl}>
                  <a className="h-full" target="_blank">
                    <button
                      className="flex h-full items-center gap-x-1 rounded bg-main-200 px-2"
                      onClick={() => splitbee.track('Preview Share URL')}
                    >
                      <span>preview</span>
                      <span className="w-[10px] translate-y-[1px]">{iconUpRight}</span>
                    </button>
                  </a>
                </Link>
                <button
                  className="inline-block h-full min-w-[3.5rem] rounded bg-accent-100 px-1 text-accent-600"
                  onClick={() => {
                    if (!copied) {
                      splitbee.track('Copy Share URL')
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        setCopied(true)
                        setTimeout(() => {
                          setCopied(false)
                        }, 1500)
                      })
                    }
                  }}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      }
      title="Share Your Graph"
    >
      <button className="simple-button divider">
        <span className="h-5 w-5">{iconShare}</span>
        <span>Share it</span>
      </button>
    </Popover>
  )
}
