<?php

require_once('lib/helpers.php');
require_once('lib/enqueue-assets.php');
require_once('lib/widgets.php');
require_once('lib/pvd.php');

/*
   * Make theme available for translation.
   * Translations can be filed in the /language/ directory.
   */
load_theme_textdomain( 'gulpwordpress', get_template_directory() . '/languages' );

/**
* Registers the menu
*/
function gulpwordpress_menus() {
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'gulpwordpress'),
        'metanavigation' => __( 'Metanavigation', 'themeName' )
));
}
add_action('init', 'gulpwordpress_menus');

// Register the options page
if(function_exists('acf_add_options_page')) {
    acf_add_options_page();
}

/**
 * Register Custom Navigation Walker
 */
function gulpwordpress_setup(){
    require_once get_template_directory() . '/wp_bootstrap_navwalker.php';

    // add additional image size for page headers
    add_image_size('header-image', 2500, 1220);
    add_image_size('one-pager-header', 2500, 500, true);
}
add_action('after_setup_theme', 'gulpwordpress_setup');

function gulpwordpress_init_widget($id) {
    register_sidebar(array(
        'name'          => 'Sidebar',
        'id'            => 'sidebar',
        'before_widget' => '<div class="sidebar-module">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>'
    ));
}
add_action('widgets_init', 'gulpwordpress_init_widget');

// Add blogpost thumbnail
add_theme_support('post-thumbnails');

// Following are includes / requires containing configuration that is outsourced to files

/**
 * Customize the excerpts
 */
require get_theme_file_path() . '/inc/excerpt.php';
