<?php

if (! defined('ABSPATH')) {
    exit;
}

class WRK_HSA_Post_Types {
    public function __construct() {
        add_action('init', [$this, 'register']);
        add_action('init', [$this, 'register_meta']);
    }

    public function register() {
        register_post_type('wrk_notice', [
            'labels' => [
                'name'          => __('Notices', 'wrk-headless-school-api'),
                'singular_name' => __('Notice', 'wrk-headless-school-api'),
            ],
            'public'       => false,
            'show_ui'      => true,
            'show_in_rest' => true,
            'menu_icon'    => 'dashicons-megaphone',
            'supports'     => ['title', 'editor', 'thumbnail'],
        ]);

        register_post_type('wrk_gallery', [
            'labels' => [
                'name'          => __('Gallery', 'wrk-headless-school-api'),
                'singular_name' => __('Gallery Item', 'wrk-headless-school-api'),
            ],
            'public'       => false,
            'show_ui'      => true,
            'show_in_rest' => true,
            'menu_icon'    => 'dashicons-format-gallery',
            'supports'     => ['title', 'editor', 'thumbnail'],
        ]);
    }

    public function register_meta() {
        $notice_meta = [
            'notice_type'     => 'string',
            'notice_date'     => 'string',
            'notice_priority' => 'string',
        ];

        foreach ($notice_meta as $key => $type) {
            register_post_meta('wrk_notice', $key, [
                'show_in_rest'      => true,
                'single'            => true,
                'type'              => $type,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback'     => function() {
                    return current_user_can('edit_posts');
                },
            ]);
        }

        $gallery_meta = [
            'gallery_category' => 'string',
            'gallery_date'     => 'string',
        ];

        foreach ($gallery_meta as $key => $type) {
            register_post_meta('wrk_gallery', $key, [
                'show_in_rest'      => true,
                'single'            => true,
                'type'              => $type,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback'     => function() {
                    return current_user_can('edit_posts');
                },
            ]);
        }
    }
}
