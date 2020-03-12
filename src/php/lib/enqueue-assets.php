<?php 

function gulpwordpress_assets() {
    wp_enqueue_style( 'gulpwordpress-stylesheet', get_template_directory_uri() . '/assets/css/style.min.css', array(), '1.0.0', 'all' );
    wp_enqueue_script( 'gulpwordpress-scripts', get_template_directory_uri() . '/assets/js/main.min.js', array('jquery'), '1.0.0', true);
}

add_action('wp_enqueue_scripts','gulpwordpress_assets');
