import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/auth'
import React from 'react'

async function page() {

  const user = await getCurrentUser()

  return (
    <>
        <h1>Interview Generation</h1>
        <Agent usenname={user?.name} userId={user?.id} type="generate"/>
    </>
  )
}

export default page