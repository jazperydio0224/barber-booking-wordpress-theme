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
                <div id='full-calendar'></div>
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