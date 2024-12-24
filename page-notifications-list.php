<?php
/*
Template Name: Notifications List
*/

// Check if the user is logged in and has admin privileges
// || ! current_user_can('administrator')
if (! is_user_logged_in()) {
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
        <main class="px-2 px-lg-4 py-5 blur-content" id="notifications-list-container">
            <div class="container-fluid dashboard-section" id="notifications-list">
                <h2 class="fw-bold mb-4">Notifications List</h2>
                <table id="notifications-table" class="table text-center table-fontsize">
                    <thead>
                        <tr>
                            <th style="vertical-align: middle !important; text-align: center !important;">Ref No.</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Client</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Appointment Date</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Appointment Time</th>
                        </tr>
                    </thead>
                    <tbody style="text-align: center !important; vertical-align: middle !important;">
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</div>

<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>