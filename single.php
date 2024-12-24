<?php
get_header();
get_template_part('template-parts/components/header', 'nav');
?>

<main>
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article>
                <h1><?php the_title(); ?></h1>
                <div><?php the_content(); ?></div>
                <footer>
                    <p>Posted on: <?php the_date(); ?></p>
                    <p>Tags: <?php the_tags(); ?></p>
                </footer>
            </article>
        <?php endwhile;
    else : ?>
        <p>No posts found.</p>
    <?php endif; ?>
</main>
<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>