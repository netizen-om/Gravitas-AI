import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/auth'
import React from 'react'

/**
 * Asynchronously renders the Interview Generation page for the current user.
 *
 * Fetches the authenticated user's information and displays the Interview Generation header along with the Agent component, passing the user's name and ID as props.
 *
 * @returns A React fragment containing the page header and the Agent component configured for interview generation.
 */
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