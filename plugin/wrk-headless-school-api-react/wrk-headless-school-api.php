<?php
/**
 * Plugin Name: WRK Headless School API
 * Description: Manage dynamic school website content from WordPress and expose it through a custom REST API for React apps.
 * Version: 2.0.0
 * Author: OpenAI
 * Text Domain: wrk-headless-school-api
 */

if (! defined('ABSPATH')) {
    exit;
}

define('WRK_HSA_VERSION', '2.0.0');
define('WRK_HSA_FILE', __FILE__);
define('WRK_HSA_PATH', plugin_dir_path(__FILE__));
define('WRK_HSA_URL', plugin_dir_url(__FILE__));

require_once WRK_HSA_PATH . 'includes/class-wrk-hsa-plugin.php';
require_once WRK_HSA_PATH . 'includes/class-wrk-hsa-admin.php';
require_once WRK_HSA_PATH . 'includes/class-wrk-hsa-post-types.php';
require_once WRK_HSA_PATH . 'includes/class-wrk-hsa-rest-api.php';

register_activation_hook(__FILE__, ['WRK_HSA_Plugin', 'activate']);

function wrk_hsa() {
    return WRK_HSA_Plugin::instance();
}

wrk_hsa();
