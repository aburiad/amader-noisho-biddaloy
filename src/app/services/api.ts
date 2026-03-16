const BASE_URL = 'https://ahsan.ronybormon.com/wp-json/school/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface SettingsData {
  site_name: string;
  site_tagline: string;
  logo_id: number;
  footer_text: string;
  footer_copyright: string;
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  youtube_url: string;
  office_hours: Array<{
    label: string;
    value: string;
  }>;
  nav_links: Array<{
    path: string;
    label: string;
  }>;
  quick_links: Array<{
    path: string;
    label: string;
  }>;
  logo_url: string;
}

export interface HomePageData {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_primary_cta_text: string;
  hero_primary_cta_link: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_link: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  mission_title: string;
  mission_subtitle: string;
  mission_items: Array<{
    title: string;
    description: string;
  }>;
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
}

export interface AboutPageData {
  page_title: string;
  page_subtitle: string;
  intro_title: string;
  intro_paragraphs: Array<{
    text: string;
  }>;
  vision_title: string;
  vision_description: string;
  mission_title: string;
  mission_description: string;
  who_can_join_title: string;
  who_can_join_items: Array<{
    title: string;
    description: string;
  }>;
  values: Array<{
    title: string;
    description: string;
  }>;
}

export interface AcademicPageData {
  page_title: string;
  page_subtitle: string;
  class_schedule: Array<{
    label: string;
    value: string;
  }>;
  classes: Array<{
    grade: string;
    subjects: string;
  }>;
  highlights: Array<{
    title: string;
    description: string;
  }>;
}

export interface AdmissionPageData {
  page_title: string;
  page_subtitle: string;
  requirements: Array<{
    title: string;
    description: string;
  }>;
  steps: Array<{
    step: string;
    title: string;
    description: string;
  }>;
  fees: Array<{
    label: string;
    value: string;
  }>;
}

export interface NoticesPageData {
  page_title: string;
  page_subtitle: string;
  important_notice_title: string;
  important_notice_text: string;
  categories: Array<{
    title: string;
    description: string;
  }>;
}

export interface Notice {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  type: string;
  priority: string;
  featured_image: boolean | string;
}

export interface GalleryItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  date: string;
  category: string;
  image_url: string;
}

export interface ContactPageData {
  page_title: string;
  page_subtitle: string;
  visit_title: string;
  visit_description: string;
  direction_hint: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: number;
  featured_image: string | null;
}

export interface BlogPageData {
  page_title: string;
  page_subtitle: string;
  posts: BlogPost[];
  total_posts: number;
  current_page: number;
  total_pages: number;
}

export interface BlogPostDetailData {
  page_title: string;
  page_subtitle: string;
  post_title: string;
  post_content: string;
  read_more_text: string;
  slug: string;
  featured_image: string | null;
  post_meta: Array<{
    label: string;
    value: string;
  }>;
}

export async function fetchSettings(): Promise<SettingsData> {
  const response = await fetch(`${BASE_URL}/settings`);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  const result: ApiResponse<SettingsData> = await response.json();
  return result.data;
}

export async function fetchHomePage(): Promise<HomePageData> {
  const response = await fetch(`${BASE_URL}/page/home`);
  if (!response.ok) {
    throw new Error('Failed to fetch home page data');
  }
  const result: ApiResponse<HomePageData> = await response.json();
  return result.data;
}

export async function fetchAboutPage(): Promise<AboutPageData> {
  const response = await fetch(`${BASE_URL}/page/about`);
  if (!response.ok) {
    throw new Error('Failed to fetch about page data');
  }
  const result: ApiResponse<AboutPageData> = await response.json();
  return result.data;
}

export async function fetchAcademicPage(): Promise<AcademicPageData> {
  const response = await fetch(`${BASE_URL}/page/academic`);
  if (!response.ok) {
    throw new Error('Failed to fetch academic page data');
  }
  const result: ApiResponse<AcademicPageData> = await response.json();
  return result.data;
}

export async function fetchAdmissionPage(): Promise<AdmissionPageData> {
  const response = await fetch(`${BASE_URL}/page/admission`);
  if (!response.ok) {
    throw new Error('Failed to fetch admission page data');
  }
  const result: ApiResponse<AdmissionPageData> = await response.json();
  return result.data;
}

export async function fetchNoticesPage(): Promise<NoticesPageData> {
  const response = await fetch(`${BASE_URL}/page/notices`);
  if (!response.ok) {
    throw new Error('Failed to fetch notices page data');
  }
  const result: ApiResponse<NoticesPageData> = await response.json();
  return result.data;
}

export async function fetchNotices(): Promise<Notice[]> {
  const response = await fetch(`${BASE_URL}/notices`);
  if (!response.ok) {
    throw new Error('Failed to fetch notices');
  }
  const result: ApiResponse<Notice[]> = await response.json();
  return result.data;
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const response = await fetch(`${BASE_URL}/gallery`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery');
  }
  const result: ApiResponse<GalleryItem[]> = await response.json();
  return result.data;
}

export async function fetchContactPage(): Promise<ContactPageData> {
  const response = await fetch(`${BASE_URL}/page/contact`);
  if (!response.ok) {
    throw new Error('Failed to fetch contact page data');
  }
  const result: ApiResponse<ContactPageData> = await response.json();
  return result.data;
}

export async function fetchBlogPage(page: number = 1, perPage: number = 10): Promise<BlogPageData> {
  // Direct Public API (No custom base needed)
  const response = await fetch(`https://ahsan.ronybormon.com/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_embed`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await response.json();
  const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0', 10);
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);

  if (!posts || posts.length === 0) {
    throw new Error('No posts available');
  }

  return {
    page_title: "School News",
    page_subtitle: "Updates from our official blog",
    posts: posts.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      date: post.date,
      author: post.author,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    })),
    total_posts: totalPosts,
    current_page: page,
    total_pages: totalPages
  };
}

// Specific single post fetch korar jonno
export async function fetchPostBySlug(slug: string): Promise<BlogPostDetailData> {
  const response = await fetch(`https://ahsan.ronybormon.com/wp-json/wp/v2/posts?slug=${slug}&_embed`);
  
  if (!response.ok) {
    throw new Error('Post not found');
  }

  const posts = await response.json();
  const post = posts[0];

  if (!post) throw new Error('Post not found');

  return {
    page_title: post.title.rendered, // Post er title-i page title
    page_subtitle: "Published on " + new Date(post.date).toLocaleDateString(),
    post_title: post.title.rendered,
    post_content: post.content.rendered, // Full content
    slug: post.slug,
    featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    read_more_text: "Back to Blog",
    post_meta: [
      { label: "Author ID", value: post.author.toString() },
      { label: "Status", value: post.status }
    ]
  };
}