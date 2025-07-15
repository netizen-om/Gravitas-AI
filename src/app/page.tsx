"use client"
import React from 'react'
import { Appbar } from '@/components/Appbar'
import axios from 'axios';

/**
 * Renders the main page layout with a header and content area.
 *
 * Displays a simple page containing the text "page" and the `Appbar` component.
 *
 * @returns The JSX structure for the page.
 */
function page() {


  return (
    <div>page
      <Appbar/>
    </div>
  )
}
export default page