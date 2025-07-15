"use client"
import React, { useEffect } from 'react'
import { Appbar } from '@/components/Appbar'
import { getCurrentUser } from '@/lib/auth'
import axios from 'axios';

function page() {

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/check");
        // console.log(res);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>page
      <Appbar/>
    </div>
  )
}
export default page