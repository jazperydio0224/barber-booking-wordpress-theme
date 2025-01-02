<?php
/*
Template Name: Admin Dashboard
*/

// Check if the user is logged in and has admin privileges
if (!is_user_logged_in() || (!current_user_can('administrator') && !current_user_can('subscriber'))) {
    // Redirect to login page and then back to the current page after login
    $redirect_url = get_permalink(); // Get the current page URL
    wp_redirect(wp_login_url($redirect_url)); // Redirect to login page and then back
    exit;
}

get_header();
?>

<div class="d-flex">
    <?php get_template_part('template-parts/components/admin', 'sidebar') ?>
    <div class="main">
        <?php get_template_part('template-parts/components/admin', 'nav'); ?>

        <main class="px-2 px-lg-4 py-5 blur-content" id="admin-dashboard-container">
            <!-- display containers based on sidebar state -->
            <div class="container-fluid dashboard-section" id="bookings-calendar">
                <h2 class="fw-bold mb-4">Bookings Calendar</h2>
                <button class="btn btn-dark mb-4" id="add-new-walk-in-btn">Add Walk-In</button>
                <div class="container-fluid px-0" id="all-calendars-container">
                    <?php
                    $args = array(
                        'post_type' => 'barber',
                        'posts_per_page' => -1,
                        'orderby' => 'menu_order',
                        'order' => 'ASC',
                    );
                    $barber_query = new WP_Query($args);
                    if ($barber_query->have_posts()):
                        $barber_count = 0;

                        echo '<div class="row">';

                        while ($barber_query->have_posts()) :
                            $barber_query->the_post();
                            $barber_id = get_the_ID();
                            $barber_name = get_the_title();

                            if ($barber_count > 0 && $barber_count % 2 == 0) {
                                echo '</div><div class="row">';
                            }

                            echo '<div class="col-12 col-xxl-6 mb-4 mb-xl-0">';
                            echo '<h4 class="fw-bold mb-3">' . $barber_name . "'s" . ' Calendar' . '</h4>';
                            echo '<div class="full-calendar" id="full-calendar-' . $barber_id . '" data-barber-id="' . $barber_id . '"></div>';
                            echo '</div>';

                            $barber_count++;
                        endwhile;

                        echo '</div>';
                        wp_reset_postdata();
                    endif;
                    ?>
                </div>
            </div>
        </main>
    </div>

    <?php
    // services modal
    get_template_part('template-parts/components/admin', 'calendar-modal');
    // service status update modal
    get_template_part('template-parts/components/admin', 'calendar-update-status-modal');
    // add walk-in modal
    get_template_part("template-parts/components/admin", 'calendar-walk-in-modal');
    ?>
</div>

<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>