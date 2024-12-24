<nav class="navbar navbar-expand-lg d-shaver-navbar" data-bs-theme="dark">
    <div class="container">
        <!-- <?php if (function_exists('the_custom_logo')) {
                    $custom_logo_id = get_theme_mod('custom_logo');
                    $logo = wp_get_attachment_image_src($custom_logo_id);
                } ?>
        <a class="navbar-brand" href="<?= esc_url(home_url('/')); ?>">
            <img src="<?= $logo[0] ?>" alt="D'Shaver and Comb Logo" width="40" class="d-inline-block align-text-middle me-1">
            <span class="fw-bold"><?= get_bloginfo('name'); ?></span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i class="fa-solid fa-sliders"></i>

        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <?php
            wp_nav_menu(
                array(
                    'menu' => 'primary',
                    'container' => '',
                    'theme_location' => 'primary',
                    'items_wrap' => '<ul id="" class="navbar-nav ms-auto mt-3 mt-lg-0 mb-lg-0 fw-bold fs-6">%3$s</ul>',
                    'walker' => new Bootstrap_Walker_Nav_Menu(), // Use the Bootstrap_Walker_Nav_Menu 
                )
            )
            ?>
        </div> -->
    </div>
</nav>