<?php
/**
 * This file defines some functions and filters to adjust the excerpt to your needs.
 *
**/

/**
 * Control the WordPress excerpt length
 */
if ( ! function_exists( 'gulpwordpress_excerpt_length' ) ) :
  function gulpwordpress_excerpt_length( $length ) {
    return 17;
  }
endif;

add_filter( 'excerpt_length', 'gulpwordpress_excerpt_length' );

/**
 * Control the read more text for excerpt links
 */
if ( ! function_exists( 'gulpwordpress_excerpt_more' ) ) :
  function gulpwordpress_excerpt_more( $more ) {
    // uncomment if you need the global $post object, then use like i. e. get_permalink( $post->ID );
    // global $post;
    return '&hellip;';
  }
endif;

add_filter( 'excerpt_more', 'gulpwordpress_excerpt_more' );
