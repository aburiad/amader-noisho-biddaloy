<?php

if (! defined('ABSPATH')) {
    exit;
}

class WRK_HSA_REST_API {
    /** @var WRK_HSA_Plugin */
    private $plugin;

    public function __construct($plugin) {
        $this->plugin = $plugin;
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route('school/v1', '/settings', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => [$this, 'settings'],
        ]);

        register_rest_route('school/v1', '/page/(?P<slug>[a-z0-9-]+)', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => [$this, 'page'],
        ]);

        register_rest_route('school/v1', '/notices', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => [$this, 'notices'],
        ]);

        register_rest_route('school/v1', '/gallery', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => [$this, 'gallery'],
        ]);

        register_rest_route('school/v1', '/bootstrap', [
            'methods'             => 'GET',
            'permission_callback' => '__return_true',
            'callback'            => [$this, 'bootstrap'],
        ]);

        register_rest_route('school/v1', '/admin/content', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'permission_callback' => [$this, 'can_manage'],
                'callback'            => [$this, 'admin_content'],
            ],
            [
                'methods'             => WP_REST_Server::EDITABLE,
                'permission_callback' => [$this, 'can_manage'],
                'callback'            => [$this, 'save_admin_content'],
                'args'                => [
                    'content' => [
                        'required' => true,
                        'type'     => 'object',
                    ],
                ],
            ],
        ]);

        register_rest_route('school/v1', '/admin/schema', [
            'methods'             => WP_REST_Server::READABLE,
            'permission_callback' => [$this, 'can_manage'],
            'callback'            => [$this, 'admin_schema'],
        ]);
    }

    public function can_manage() {
        return current_user_can('manage_options');
    }

    public function admin_content() {
        $content = $this->plugin->get_content();
        $global  = $content['global'];
        $global['logo_url'] = $this->plugin->media_url($global['logo_id'] ?? 0);
        $content['global']  = $global;

        return rest_ensure_response([
            'success' => true,
            'data'    => [
                'content' => $content,
                'meta'    => [
                    'notices_count' => (int) wp_count_posts('wrk_notice')->publish,
                    'gallery_count' => (int) wp_count_posts('wrk_gallery')->publish,
                ],
            ],
        ]);
    }

    public function save_admin_content(WP_REST_Request $request) {
        $content = $request->get_param('content');
        $this->plugin->update_content($content);
        $saved = $this->plugin->get_content();
        $saved['global']['logo_url'] = $this->plugin->media_url($saved['global']['logo_id'] ?? 0);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Content saved successfully.', 'wrk-headless-school-api'),
            'data'    => $saved,
        ]);
    }

    public function admin_schema() {
        return rest_ensure_response([
            'success' => true,
            'data'    => [
                'global' => [
                    'office_hours' => ['label', 'value'],
                    'nav_links'    => ['path', 'label'],
                    'quick_links'  => ['path', 'label'],
                ],
                'pages'  => [
                    'home' => [
                        'features'      => ['title', 'description', 'icon'],
                        'mission_items' => ['title', 'description'],
                    ],
                    'about' => [
                        'intro_paragraphs'  => ['text'],
                        'who_can_join_items'=> ['text'],
                        'values'            => ['title', 'description'],
                    ],
                    'academic' => [
                        'class_schedule' => ['label', 'value'],
                        'classes'        => ['title', 'description'],
                        'highlights'     => ['text'],
                    ],
                    'admission' => [
                        'requirements' => ['text'],
                        'steps'        => ['title', 'description'],
                        'fees'         => ['label', 'value'],
                    ],
                    'contact' => [
                        'faqs' => ['question', 'answer'],
                    ],
                    'notices' => [
                        'categories' => ['label', 'value'],
                    ],
                ],
            ],
        ]);
    }

    public function settings() {
        $global             = $this->plugin->get_global();
        $global['logo_url'] = $this->plugin->media_url($global['logo_id'] ?? 0);

        return rest_ensure_response([
            'success' => true,
            'data'    => $global,
        ]);
    }

    public function page($request) {
        $slug = sanitize_key($request['slug']);
        $page = $this->plugin->get_page($slug);

        if (empty($page)) {
            return new WP_Error('not_found', __('Page content not found.', 'wrk-headless-school-api'), ['status' => 404]);
        }

        return rest_ensure_response([
            'success' => true,
            'data'    => $page,
        ]);
    }

    public function notices() {
        $query = new WP_Query([
            'post_type'      => 'wrk_notice',
            'post_status'    => 'publish',
            'posts_per_page' => 50,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ]);

        return rest_ensure_response([
            'success' => true,
            'data'    => array_map([$this, 'map_notice'], $query->posts),
        ]);
    }

    public function gallery() {
        $query = new WP_Query([
            'post_type'      => 'wrk_gallery',
            'post_status'    => 'publish',
            'posts_per_page' => 100,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ]);

        return rest_ensure_response([
            'success' => true,
            'data'    => array_map([$this, 'map_gallery'], $query->posts),
        ]);
    }

    public function bootstrap() {
        $global             = $this->plugin->get_global();
        $global['logo_url'] = $this->plugin->media_url($global['logo_id'] ?? 0);

        $content = $this->plugin->get_content();

        return rest_ensure_response([
            'success' => true,
            'data'    => [
                'settings' => $global,
                'pages'    => $content['pages'],
                'notices'  => array_map([$this, 'map_notice'], get_posts([
                    'post_type'      => 'wrk_notice',
                    'post_status'    => 'publish',
                    'posts_per_page' => 10,
                    'orderby'        => 'date',
                    'order'          => 'DESC',
                ])),
                'gallery'  => array_map([$this, 'map_gallery'], get_posts([
                    'post_type'      => 'wrk_gallery',
                    'post_status'    => 'publish',
                    'posts_per_page' => 12,
                    'orderby'        => 'date',
                    'order'          => 'DESC',
                ])),
            ],
        ]);
    }

    private function map_notice($post) {
        return [
            'id'             => $post->ID,
            'title'          => get_the_title($post),
            'slug'           => $post->post_name,
            'description'    => wp_strip_all_tags(apply_filters('the_content', $post->post_content)),
            'content'        => apply_filters('the_content', $post->post_content),
            'date'           => get_post_meta($post->ID, 'notice_date', true) ?: get_the_date('', $post),
            'type'           => get_post_meta($post->ID, 'notice_type', true) ?: 'announcement',
            'priority'       => get_post_meta($post->ID, 'notice_priority', true) ?: 'low',
            'featured_image' => get_the_post_thumbnail_url($post, 'full'),
        ];
    }

    private function map_gallery($post) {
        return [
            'id'          => $post->ID,
            'title'       => get_the_title($post),
            'slug'        => $post->post_name,
            'description' => wp_strip_all_tags(apply_filters('the_content', $post->post_content)),
            'content'     => apply_filters('the_content', $post->post_content),
            'date'        => get_post_meta($post->ID, 'gallery_date', true) ?: get_the_date('', $post),
            'category'    => get_post_meta($post->ID, 'gallery_category', true) ?: 'general',
            'image_url'   => get_the_post_thumbnail_url($post, 'full'),
        ];
    }
}
