"use client"
import type { FC } from 'react'
import React, { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useAuth } from '@/context/authContext'

import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

const App: FC<IMainProps> = ({
  params,
}: any) => {
  // const { isAuthenticated } = useAuth()
  // console.log('isAuthenticated', isAuthenticated)
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     redirect('/login')
  //   }
  // }, [isAuthenticated])
  const { isAuthenticated, code } = useAuth()
  console.log('isAuthenticated', isAuthenticated, 'code', code)
  useEffect(() => {


    if (typeof window !== 'undefined' && !localStorage.getItem('wechat-code')) {
      redirect('/login')
    }
  }, [code])
  return (
    <Main params={params} />
  )
}

export default React.memo(App)
