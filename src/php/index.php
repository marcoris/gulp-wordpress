<?php get_header(); ?>

<?php if(have_posts()) { ?>
    <?php while(have_posts()) { ?>
        <?php the_post(); ?>
        <h2>
            <a href="<?php the_permalink() ?>" title="<?php the_title_attribute(); ?>"><?php the_title() ?>
            </a>
        </h2>
        <div>
            <?php gulpwordpress_post_meta(); ?>
        </div>
        <div>
            <?php the_excerpt(); ?>
        </diV>
            <?php gulpwordpress_readmore_link(); ?> 
    <?php } ?>
    <?php the_posts_pagination( ); ?>
<?php } else { ?>
    <p><?php esc_html_e('Sorry, no posts matched your criteria.', 'gulpwordpress'); ?></p>
<?php } ?>    

<?php

$city = 'london';

echo esc_html__( 'Your city is', 'gulpwordpress' ) . $city;

printf(
    /* tanslators: %s is the city name */
    esc_html__( 'Your city is %s', 'gulpwordpress' ),
    $city
);

?>

<?php get_footer(); ?>