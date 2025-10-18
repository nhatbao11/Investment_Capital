"use client"

import type React from "react"
import PageHeader from "../components/ui/PageHeader"
import { useLanguage } from "../contexts/LanguageContext"
import PostFeed from "../components/ui/PostFeed"

const Sector: React.FC = () => {
  const { t } = useLanguage()
  return (
    <div className="bg-background text-foreground min-h-screen">
      <PageHeader title={t("sector.hero.title")} subtitle={t("sector.hero.subtitle")} backgroundImage="/images/phantichnganh.png" height="h-48" />

      <div className="max-w-7xl mx-auto pt-0 pb-24 px-6 lg:px-8">
        <PostFeed category="nganh" accentColor="blue" title={t("sector.page.title")} />
      </div>

    </div>
  )
}

export default Sector
