<template>
  <article v-if="data">
    <h1>{{ data.title }}</h1>

    <p class="desc">{{ data.description }}</p>

    <img v-if="data.cover" :src="data.cover" :alt="data.title">

    <!-- Markdown 渲染结果 -->
    <div class="content" v-html="html" />
  </article>

  <div v-else>
    Not Found
  </div>
</template>

<script setup lang="ts">
import { useRoute, createError } from '#imports'
import MarkdownIt from 'markdown-it'
import type { BlogPost } from '~/types/blog'

const route = useRoute()
const md = new MarkdownIt()

/**
 * Get slug from route params (single slug for static generation)
 */
const slug = computed<string>(() => {
  const s = route.params.slug
  return typeof s === 'string' ? s : ''
})

/**
 * Fetch blog post data from server API
 */
const { data, error } = await useFetch<BlogPost>(`/api/blog/${slug.value}`)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article Not Found'
  })
}

/**
 * Markdown → HTML
 */
const html = computed<string>(() =>
  md.render(data.value?.content || '')
)

// SEO metadata for individual blog posts
const siteConfig = useSiteConfig()
const blogUrl = `${siteConfig.url}/blog/${slug.value}`
const publishedDate = new Date(data.value.date).toISOString()

// Generate structured data (JSON-LD) for blog posts
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: data.value.title,
  description: data.value.description,
  author: {
    '@type': 'Person',
    name: siteConfig.name
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url
  },
  datePublished: publishedDate,
  dateModified: publishedDate,
  url: blogUrl,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': blogUrl
  },
  ...(data.value.cover && {
    image: {
      '@type': 'ImageObject',
      url: data.value.cover
    }
  }),
  keywords: data.value.tags?.join(', ') || ''
}

// SEO meta tags using useSeoMeta
useSeoMeta({
  title: data.value.title,
  description: data.value.description,
  ogTitle: data.value.title,
  ogDescription: data.value.description,
  ogType: 'article',
  ogUrl: blogUrl,
  ogSiteName: siteConfig.name,
  ...(data.value.cover && {
    ogImage: data.value.cover,
    ogImageAlt: data.value.title
  }),
  twitterCard: 'summary_large_image',
  twitterTitle: data.value.title,
  twitterDescription: data.value.description,
  ...(data.value.cover && {
    twitterImage: data.value.cover,
    twitterImageAlt: data.value.title
  }),
  articlePublishedTime: publishedDate,
  articleModifiedTime: publishedDate,
  articleAuthor: siteConfig.name,
  articleTag: data.value.tags || []
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