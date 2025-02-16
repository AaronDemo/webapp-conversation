"use client"
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { redirect, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/authContext'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

const App: FC<IMainProps> = ({
  params,
}: any) => {

  console.log('进入首页')
  const searchParams = useSearchParams()
  //获取企业微信回调参数
  const code = searchParams.get('code');
  console.log('urlcode', code)
  if (code != null) {
    globalThis.localStorage?.setItem("wechat-code", code ?? '')
  }
  const wxcode = globalThis.localStorage?.getItem("wechat-code")
  console.log('wxcode:', wxcode);
  useEffect(() => {
    if (!wxcode) {
      redirect('/login')
    }
  }, [])
  return (
    <Main params={params} />
  )
}

export default React.memo(App)
