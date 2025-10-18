"use client"

import type React from "react"
import PageHeader from "../components/ui/PageHeader"
import { useLanguage } from "../contexts/LanguageContext"
import PostFeed from "../components/ui/PostFeed"

const Analysis: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="bg-background text-foreground min-h-screen">
      <PageHeader
        title={t("analysis.hero.title")}
        subtitle={t("analysis.hero.subtitle")}
        backgroundImage="/images/phantichdoanhnghiep.jpg"
        height="h-48"
      />

      <div className="max-w-7xl mx-auto pt-0 pb-24 px-6 lg:px-8">
        <PostFeed category="doanh_nghiep" accentColor="green" title={t("analysis.page.title")} />
      </div>
    </div>
  )
}

export default Analysis
