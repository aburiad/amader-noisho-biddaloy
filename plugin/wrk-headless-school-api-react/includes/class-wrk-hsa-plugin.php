<?php

if (! defined('ABSPATH')) {
    exit;
}

class WRK_HSA_Plugin {
    const OPTION_KEY = 'wrk_hsa_content';

    /** @var self|null */
    private static $instance = null;

    /** @var array<string,mixed> */
    private $content = [];

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        $this->content = $this->get_content();

        add_action('init', [$this, 'load_textdomain']);

        new WRK_HSA_Post_Types();
        new WRK_HSA_Admin($this);
        new WRK_HSA_REST_API($this);
    }

    public function load_textdomain() {
        load_plugin_textdomain('wrk-headless-school-api', false, dirname(plugin_basename(WRK_HSA_FILE)) . '/languages');
    }

    public static function activate() {
        if (! get_option(self::OPTION_KEY)) {
            add_option(self::OPTION_KEY, self::default_content());
        }

        (new WRK_HSA_Post_Types())->register();
        flush_rewrite_rules();
    }

    public function get_content() {
        $saved = get_option(self::OPTION_KEY, []);
        return wp_parse_args(is_array($saved) ? $saved : [], self::default_content());
    }

    public function update_content($content) {
        $sanitized = $this->sanitize_content($content);
        update_option(self::OPTION_KEY, $sanitized, false);
        $this->content = $sanitized;
    }

    public function get_page($slug) {
        $content = $this->get_content();
        return isset($content['pages'][$slug]) ? $content['pages'][$slug] : [];
    }

    public function get_global() {
        $content = $this->get_content();
        return isset($content['global']) ? $content['global'] : [];
    }

    public function sanitize_content($content) {
        $defaults = self::default_content();
        $content  = is_array($content) ? $content : [];

        return [
            'global' => [
                'site_name'        => sanitize_text_field($content['global']['site_name'] ?? $defaults['global']['site_name']),
                'site_tagline'     => sanitize_text_field($content['global']['site_tagline'] ?? $defaults['global']['site_tagline']),
                'logo_id'          => absint($content['global']['logo_id'] ?? 0),
                'footer_text'      => wp_kses_post($content['global']['footer_text'] ?? $defaults['global']['footer_text']),
                'footer_copyright' => sanitize_text_field($content['global']['footer_copyright'] ?? $defaults['global']['footer_copyright']),
                'phone'            => sanitize_text_field($content['global']['phone'] ?? $defaults['global']['phone']),
                'email'            => sanitize_email($content['global']['email'] ?? $defaults['global']['email']),
                'address'          => sanitize_textarea_field($content['global']['address'] ?? $defaults['global']['address']),
                'facebook_url'     => esc_url_raw($content['global']['facebook_url'] ?? ''),
                'youtube_url'      => esc_url_raw($content['global']['youtube_url'] ?? ''),
                'office_hours'     => $this->sanitize_json_textarea($content['global']['office_hours'] ?? $defaults['global']['office_hours'], $defaults['global']['office_hours']),
                'nav_links'        => $this->sanitize_json_textarea($content['global']['nav_links'] ?? $defaults['global']['nav_links'], $defaults['global']['nav_links']),
                'quick_links'      => $this->sanitize_json_textarea($content['global']['quick_links'] ?? $defaults['global']['quick_links'], $defaults['global']['quick_links']),
            ],
            'pages' => [
                'home'      => $this->sanitize_page_content($content['pages']['home'] ?? [], $defaults['pages']['home']),
                'about'     => $this->sanitize_page_content($content['pages']['about'] ?? [], $defaults['pages']['about']),
                'academic'  => $this->sanitize_page_content($content['pages']['academic'] ?? [], $defaults['pages']['academic']),
                'admission' => $this->sanitize_page_content($content['pages']['admission'] ?? [], $defaults['pages']['admission']),
                'contact'   => $this->sanitize_page_content($content['pages']['contact'] ?? [], $defaults['pages']['contact']),
                'gallery'   => $this->sanitize_page_content($content['pages']['gallery'] ?? [], $defaults['pages']['gallery']),
                'notices'   => $this->sanitize_page_content($content['pages']['notices'] ?? [], $defaults['pages']['notices']),
            ],
        ];
    }

    private function sanitize_page_content($page, $defaults) {
        $sanitized = [];

        foreach ($defaults as $key => $default_value) {
            $incoming = $page[$key] ?? $default_value;

            if (is_array($default_value)) {
                $sanitized[$key] = $this->sanitize_json_textarea($incoming, $default_value);
            } elseif (str_contains($key, 'content') || str_contains($key, 'description') || str_contains($key, 'body')) {
                $sanitized[$key] = wp_kses_post($incoming);
            } else {
                $sanitized[$key] = sanitize_textarea_field($incoming);
            }
        }

        return $sanitized;
    }

    private function sanitize_json_textarea($value, $fallback) {
        if (is_array($value)) {
            return $this->sanitize_recursive($value);
        }

        if (is_string($value)) {
            $decoded = json_decode(wp_unslash($value), true);
            if (JSON_ERROR_NONE === json_last_error() && is_array($decoded)) {
                return $this->sanitize_recursive($decoded);
            }
        }

        return $fallback;
    }

    private function sanitize_recursive($value) {
        if (! is_array($value)) {
            return is_string($value) ? sanitize_text_field($value) : $value;
        }

        $clean = [];
        foreach ($value as $key => $item) {
            $clean_key         = is_string($key) ? sanitize_key($key) : $key;
            $clean[$clean_key] = is_array($item) ? $this->sanitize_recursive($item) : sanitize_text_field((string) $item);
        }

        return $clean;
    }

    public function media_url($attachment_id) {
        return $attachment_id ? wp_get_attachment_image_url($attachment_id, 'full') : '';
    }

    public static function default_content() {
        return [
            'global' => [
                'site_name'        => 'আমাদের নৈশ বিদ্যালয়',
                'site_tagline'     => 'দিনে কাজ, রাতে শিক্ষা - সবার জন্য শিক্ষার আলো',
                'logo_id'          => 0,
                'footer_text'      => 'দিনে কাজ করা মানুষদের জন্য রাতের বেলায় পড়াশোনার সুযোগ। সবার জন্য শিক্ষার আলো।',
                'footer_copyright' => '© ২০২৬ আমাদের নৈশ বিদ্যালয়। সর্বস্বত্ব সংরক্ষিত।',
                'phone'            => '০১৭১২-৩৪৫৬৭৮',
                'email'            => 'info@nightschool.edu.bd',
                'address'          => 'মিরপুর, ঢাকা-১২১৬',
                'facebook_url'     => '',
                'youtube_url'      => '',
                'office_hours'     => [
                    ['label' => 'রবিবার - বৃহস্পতিবার', 'value' => 'সকাল ১০টা - রাত ১০টা'],
                    ['label' => 'শুক্রবার', 'value' => 'বন্ধ'],
                    ['label' => 'শনিবার', 'value' => 'বন্ধ'],
                ],
                'nav_links'        => [
                    ['path' => '/', 'label' => 'হোম'],
                    ['path' => '/about', 'label' => 'আমাদের সম্পর্কে'],
                    ['path' => '/academic', 'label' => 'একাডেমিক'],
                    ['path' => '/admission', 'label' => 'ভর্তি'],
                    ['path' => '/notices', 'label' => 'নোটিশ'],
                    ['path' => '/gallery', 'label' => 'গ্যালারি'],
                    ['path' => '/contact', 'label' => 'যোগাযোগ'],
                ],
                'quick_links'      => [
                    ['path' => '/admission', 'label' => 'ভর্তি তথ্য'],
                    ['path' => '/academic', 'label' => 'একাডেমিক তথ্য'],
                    ['path' => '/notices', 'label' => 'নোটিশবোর্ড'],
                    ['path' => '/contact', 'label' => 'যোগাযোগ'],
                ],
            ],
            'pages' => [
                'home' => [
                    'hero_title'            => 'আমাদের নৈশ বিদ্যালয়',
                    'hero_subtitle'         => 'দিনে কাজ, রাতে শিক্ষা - সবার জন্য শিক্ষার আলো',
                    'hero_description'      => 'আমরা বিশ্বাস করি শিক্ষা প্রতিটি মানুষের অধিকার। কর্মজীবী মানুষদের জন্য আমরা তৈরি করেছি একটি সুযোগ যেখানে তারা রাতের বেলায় পড়াশোনা চালিয়ে যেতে পারবে এবং তাদের স্বপ্ন পূরণ করতে পারবে।',
                    'hero_primary_cta_text' => 'ভর্তি তথ্য দেখুন',
                    'hero_primary_cta_link' => '/admission',
                    'hero_secondary_cta_text' => 'যোগাযোগ করুন',
                    'hero_secondary_cta_link' => '/contact',
                    'features'              => [
                        ['title' => 'রাতের ক্লাস', 'description' => 'সন্ধ্যা ৭টা থেকে রাত ১০টা পর্যন্ত ক্লাস', 'icon' => 'clock'],
                        ['title' => 'সবার জন্য শিক্ষা', 'description' => 'যে কোনো বয়সের মানুষ ভর্তি হতে পারবেন', 'icon' => 'users'],
                        ['title' => 'কম খরচে শিক্ষা', 'description' => 'মাত্র ২০০ টাকা মাসিক বেতনে মানসম্মত শিক্ষা', 'icon' => 'book-open'],
                    ],
                    'mission_title'         => 'আমাদের মিশন',
                    'mission_subtitle'      => 'কর্মজীবী মানুষদের জন্য শিক্ষার সুযোগ তৈরি করা এবং সমাজে ইতিবাচক পরিবর্তন আনা',
                    'mission_items'         => [
                        ['title' => 'সবার জন্য সুযোগ', 'description' => 'বয়স বা পটভূমি নির্বিশেষে সবাই পড়াশোনা করতে পারবে'],
                        ['title' => 'কর্মজীবীদের শিক্ষা', 'description' => 'দিনে কাজ করে রাতে পড়াশোনার সুবিধা'],
                        ['title' => 'নতুন সুযোগ', 'description' => 'ঝরে পড়া শিক্ষার্থীদের জন্য নতুন শুরু'],
                        ['title' => 'মানসম্মত শিক্ষা', 'description' => 'সাশ্রয়ী মূল্যে উন্নত মানের শিক্ষা প্রদান'],
                    ],
                    'cta_title'             => 'আজই শুরু করুন আপনার শিক্ষা যাত্রা',
                    'cta_description'       => 'দেরি না করে আজই ভর্তি হয়ে যান এবং আপনার স্বপ্ন পূরণের পথে এগিয়ে যান',
                    'cta_button_text'       => 'ভর্তি তথ্য দেখুন',
                    'cta_button_link'       => '/admission',
                ],
                'about' => [
                    'page_title'            => 'আমাদের সম্পর্কে',
                    'page_subtitle'         => 'শিক্ষার আলো ছড়িয়ে দেওয়ার একটি সামাজিক উদ্যোগ',
                    'intro_title'           => 'আমাদের নৈশ বিদ্যালয়ের পরিচয়',
                    'intro_paragraphs'      => [
                        ['text' => 'আমাদের নৈশ বিদ্যালয় একটি অলাভজনক সামাজিক ও মানবিক শিক্ষা উদ্যোগ। এই বিদ্যালয়টি প্রতিষ্ঠার মূল উদ্দেশ্য হলো এমন সব মানুষের জন্য শিক্ষার সুযোগ তৈরি করা যারা দিনের বেলা কাজ করেন এবং রাতের বেলায় পড়াশোনা করতে চান।'],
                        ['text' => 'আমরা বিশ্বাস করি শিক্ষা প্রতিটি মানুষের মৌলিক অধিকার। দারিদ্র্য, বয়স বা পূর্ববর্তী শিক্ষা বিরতি কোনোটিই শিক্ষার পথে বাধা হতে পারে না। তাই আমরা তৈরি করেছি এমন একটি পরিবেশ যেখানে সবাই সমান সুযোগ পায়।'],
                        ['text' => 'আমাদের বিদ্যালয়ে শ্রেণী ১ থেকে শ্রেণী ১০ পর্যন্ত ঢাকা বোর্ডের পাঠ্যক্রম অনুসরণ করা হয়। শিক্ষার্থীরা নিয়মিত পরীক্ষায় অংশগ্রহণ করতে পারবেন এবং সাধারণ স্কুলের মতোই সনদপত্র পাবেন।'],
                    ],
                    'vision_title'          => 'আমাদের লক্ষ্য',
                    'vision_description'    => 'আমাদের লক্ষ্য হলো বাংলাদেশের প্রতিটি কর্মজীবী মানুষের জন্য শিক্ষার সুযোগ সৃষ্টি করা। আমরা চাই যেন কেউ শুধুমাত্র আর্থিক সমস্যা বা সময়ের অভাবে শিক্ষা থেকে বঞ্চিত না হয়।',
                    'mission_title'         => 'আমাদের মিশন',
                    'mission_description'   => 'মানসম্মত শিক্ষা প্রদান করে সমাজে ইতিবাচক পরিবর্তন আনা। ঝরে পড়া শিক্ষার্থীদের নতুন করে শিক্ষার আলোয় ফিরিয়ে আনা এবং তাদের জীবনে নতুন সম্ভাবনার দুয়ার খুলে দেওয়া।',
                    'who_can_join_title'    => 'কারা এখানে পড়তে পারবে?',
                    'who_can_join_items'    => [
                        ['title' => 'কর্মজীবী মানুষ', 'description' => 'যারা দিনের বেলা কাজ করেন এবং রাতে পড়াশোনা করতে চান'],
                        ['title' => 'ঝরে পড়া শিক্ষার্থী', 'description' => 'যারা আগে পড়াশোনা ছেড়ে দিয়েছিলেন এবং আবার শুরু করতে চান'],
                        ['title' => 'যে কোনো বয়সের মানুষ', 'description' => 'বয়সের কোনো বাধা নেই। যে কেউ ভর্তি হতে পারবেন'],
                    ],
                    'values'                => [
                        ['title' => 'গুণমান', 'description' => 'উচ্চমানের শিক্ষা প্রদান'],
                        ['title' => 'সমতা', 'description' => 'সবার জন্য সমান সুযোগ'],
                        ['title' => 'সমাজসেবা', 'description' => 'সমাজের উন্নয়নে অবদান'],
                        ['title' => 'স্বচ্ছতা', 'description' => 'স্পষ্ট ও জবাবদিহিতামূলক'],
                    ],
                ],
                'academic' => [
                    'page_title'        => 'একাডেমিক তথ্য',
                    'page_subtitle'     => 'শ্রেণী ১ থেকে ১০ পর্যন্ত ঢাকা বোর্ডের পাঠ্যক্রম',
                    'class_schedule'    => [
                        ['label' => 'ক্লাস সময়', 'value' => 'সন্ধ্যা ৭টা - রাত ১০টা'],
                        ['label' => 'সাপ্তাহিক ক্লাস', 'value' => 'রবিবার - বৃহস্পতিবার'],
                        ['label' => 'মাসিক বেতন', 'value' => '২০০ টাকা'],
                    ],
                    'classes'           => [
                        ['grade' => 'শ্রেণী ১', 'subjects' => 'বাংলা, ইংরেজি, গণিত, বিজ্ঞান, সমাজ'],
                        ['grade' => 'শ্রেণী ১০', 'subjects' => 'বাংলা, ইংরেজি, গণিত, পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান'],
                    ],
                    'highlights'        => [
                        ['title' => 'ঢাকা বোর্ড', 'description' => 'বোর্ড ভিত্তিক পাঠ্যক্রম'],
                        ['title' => 'নিয়মিত পরীক্ষা', 'description' => 'মাসিক ও বার্ষিক মূল্যায়ন'],
                    ],
                ],
                'admission' => [
                    'page_title'        => 'ভর্তি তথ্য',
                    'page_subtitle'     => 'নতুন শিক্ষার্থী ভর্তির সকল তথ্য একসাথে',
                    'requirements'      => [
                        ['title' => 'যে কেউ আবেদন করতে পারবেন', 'description' => 'বয়সের নির্দিষ্ট সীমা নেই'],
                        ['title' => 'জাতীয় পরিচয়পত্র / জন্মনিবন্ধন', 'description' => 'পরিচয় যাচাইয়ের জন্য'],
                        ['title' => 'পূর্ববর্তী শিক্ষার সনদ', 'description' => 'যদি থাকে'],
                    ],
                    'steps'             => [
                        ['step' => '১', 'title' => 'যোগাযোগ করুন', 'description' => 'ফোন বা সরাসরি অফিসে এসে তথ্য নিন'],
                        ['step' => '২', 'title' => 'ফর্ম পূরণ করুন', 'description' => 'ভর্তি ফর্ম সম্পূর্ণ করুন'],
                        ['step' => '৩', 'title' => 'ডকুমেন্ট জমা দিন', 'description' => 'প্রয়োজনীয় কাগজপত্র জমা দিন'],
                    ],
                    'fees'              => [
                        ['label' => 'ভর্তি ফি', 'value' => '৫০০ টাকা'],
                        ['label' => 'মাসিক বেতন', 'value' => '২০০ টাকা'],
                    ],
                ],
                'contact' => [
                    'page_title'        => 'যোগাযোগ',
                    'page_subtitle'     => 'যেকোনো তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন',
                    'visit_title'       => 'সরাসরি আসার তথ্য',
                    'visit_description' => 'আপনি চাইলে সরাসরি বিদ্যালয়ে আসতে পারেন। ক্লাসের সময় (সন্ধ্যা ৭টা - রাত ১০টা) বা দিনের বেলা অফিস সময়ে আসুন।',
                    'direction_hint'    => 'দিকনির্দেশনা: মিরপুর বাস স্ট্যান্ড থেকে ৫ মিনিট হাঁটা দূরত্বে',
                    'faqs'              => [
                        ['question' => 'কীভাবে ভর্তি হতে পারি?', 'answer' => 'অফিসে যোগাযোগ করে ভর্তি ফর্ম পূরণ করতে হবে।'],
                        ['question' => 'ক্লাস কখন হয়?', 'answer' => 'সন্ধ্যা ৭টা থেকে রাত ১০টা পর্যন্ত।'],
                    ],
                ],
                'gallery' => [
                    'page_title'        => 'গ্যালারি',
                    'page_subtitle'     => 'বিদ্যালয়ের কার্যক্রম ও মুহূর্তগুলো',
                ],
                'notices' => [
                    'page_title'            => 'নোটিশ বোর্ড',
                    'page_subtitle'         => 'সকল গুরুত্বপূর্ণ বিজ্ঞপ্তি ও ঘোষণা',
                    'important_notice_title' => 'গুরুত্বপূর্ণ বিজ্ঞপ্তি',
                    'important_notice_text'  => 'নতুন শিক্ষাবর্ষের জন্য ভর্তি চলছে। সীমিত আসন। দ্রুত যোগাযোগ করুন।',
                    'categories'            => [
                        ['title' => 'ভর্তি বিজ্ঞপ্তি', 'description' => 'নতুন শিক্ষার্থী ভর্তি সংক্রান্ত'],
                        ['title' => 'পরীক্ষার রুটিন', 'description' => 'পরীক্ষার সময়সূচী ও নিয়মাবলী'],
                        ['title' => 'ফলাফল', 'description' => 'পরীক্ষার ফলাফল প্রকাশ'],
                        ['title' => 'গুরুত্বপূর্ণ ঘোষণা', 'description' => 'বিশেষ তথ্য ও আপডেট'],
                    ],
                ],
            ],
        ];
    }
}
