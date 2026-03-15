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