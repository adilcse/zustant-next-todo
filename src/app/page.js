"use client"
import dynamic from 'next/dynamic'
 
const Column = dynamic(() => import('../components/Column'), { ssr: false })

// import Column from '@/components/Column'
import Image from 'next/image'

export default function Home() {
  return (
      <>
  <div className="navbar"> 
  Welcome to your Todos
  </div>
  
        <div className="App">
          <Column showAddButton status="PLANNED" />
          <Column status="ONGOING" />
          <Column status="DONE" />
        </div>
      </>
  )
}
