<?php

if (! defined('ABSPATH')) {
    exit;
}

class WRK_HSA_Admin {
    /** @var WRK_HSA_Plugin */
    private $plugin;

    public function __construct($plugin) {
        $this->plugin = $plugin;

        add_action('admin_menu', [$this, 'menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue']);
    }

    public function menu() {
        add_menu_page(
            __('School Headless CMS', 'wrk-headless-school-api'),
            __('School CMS', 'wrk-headless-school-api'),
            'manage_options',
            'wrk-hsa',
            [$this, 'render'],
            'dashicons-welcome-learn-more',
            56
        );
    }

    public function enqueue($hook) {
        if ('toplevel_page_wrk-hsa' !== $hook) {
            return;
        }

        wp_enqueue_media();

        $css_file = WRK_HSA_PATH . 'admin/build/index.css';
        $js_file  = WRK_HSA_PATH . 'admin/build/index.js';

        if (file_exists($css_file)) {
            wp_enqueue_style(
                'wrk-hsa-admin-app',
                WRK_HSA_URL . 'admin/build/index.css',
                [],
                (string) filemtime($css_file)
            );
        }

        wp_enqueue_script(
            'wrk-hsa-admin-app',
            WRK_HSA_URL . 'admin/build/index.js',
            ['wp-api-fetch'],
            file_exists($js_file) ? (string) filemtime($js_file) : WRK_HSA_VERSION,
            true
        );

        wp_add_inline_script(
            'wrk-hsa-admin-app',
            'window.WRK_HSA_ADMIN = ' . wp_json_encode([
                'restRoot'     => esc_url_raw(rest_url('school/v1/')),
                'restNonce'    => wp_create_nonce('wp_rest'),
                'adminUrl'     => esc_url_raw(admin_url()),
                'siteUrl'      => esc_url_raw(home_url('/')),
                'pluginVersion'=> WRK_HSA_VERSION,
            ]) . ';',
            'before'
        );
    }

    public function render() {
        echo '<div class="wrap"><div id="wrk-hsa-admin-root"></div></div>';
    }
}
