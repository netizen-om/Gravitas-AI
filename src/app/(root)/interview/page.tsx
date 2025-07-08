import Agent from '@/components/Agent'
import React from 'react'

function page() {
  return (
    <>
        <h1>Interview Generation</h1>
        <Agent usenname="you" userId="user1" type="generate"/>
    </>
  )
}

export default page