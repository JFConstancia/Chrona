export const dynamic = "force-dynamic";

import { Footer } from '@/components/Footer'
import React from 'react'
import Hero from './components/Hero'
import { Header } from '@/components/Header'

const DashboardPage = () => {
  return (
    <>
    <Header />
    <Hero />
    <Footer />
    </>
  )
}

export default DashboardPage