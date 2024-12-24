<?php
get_header();
get_template_part('template-parts/components/header', 'nav');
?>
<main class="container-py min-vh-100 d-flex align-items-center justify-content-center">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <article class="container">
                <div><?php the_content(); ?></div>
            </article>
        <?php endwhile;
    else : ?>
        <p>No pages found.</p>
    <?php endif; ?>
</main>
<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>