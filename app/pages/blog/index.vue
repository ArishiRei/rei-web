<template>
  <section>
    <h1>Blog</h1>

    <ul>
      <li v-for="post in posts" :key="post.to">
        <NuxtLink :to="post.to">
          <h3>{{ post.title }}</h3>
          <p>{{ post.description }}</p>
          <small>{{ formatDate(post.date) }}</small>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { BlogPostSummary } from '~/types/blog'

/**
 * Fetch blog posts data from server API
 */
const { data: posts } = await useFetch<BlogPostSummary[]>('/api/blog')

/**
 * 日期格式化
 */
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString()
}

// SEO metadata for blog index page
const siteConfig = useSiteConfig()
const blogUrl = `${siteConfig.url}/blog`
const blogTitle = 'Blog'
const blogDescription = 'Explore our latest blog posts and articles'

// Generate structured data (JSON-LD) for blog section
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: blogTitle,
  description: blogDescription,
  url: blogUrl,
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': blogUrl
  },
  blogPost: posts.value?.map((post: BlogPostSummary) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: `${siteConfig.url}${post.to}`,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: siteConfig.name
    }
  }))
}

// SEO meta tags using useSeoMeta
useSeoMeta({
  title: blogTitle,
  description: blogDescription,
  ogTitle: blogTitle,
  ogDescription: blogDescription,
  ogType: 'website',
  ogUrl: blogUrl,
  ogSiteName: siteConfig.name,
  twitterCard: 'summary',
  twitterTitle: blogTitle,
  twitterDescription: blogDescription
})

// Additional head configuration
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData)
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: blogUrl
    }
  ]
})

// Define page meta for static generation
definePageMeta({
  // This ensures the page is generated statically
  prerender: true
})
</script>
