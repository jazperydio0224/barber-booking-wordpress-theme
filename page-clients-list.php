<?php
/*
Template Name: Clients List
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

        <main class="px-2 px-lg-4 py-5 blur-content" id="clients-list-container">
            <div class="container-fluid dashboard-section" id="clients-list">
                <h2 class="fw-bold mb-4">Clients List</h2>
                <button class="btn btn-dark mb-4" id="add-new-client-btn">Add New Client</button>
                <table id="clients-list-table" class="table table-striped text-center table-fontsize">
                    <thead>
                        <tr>
                            <!-- <th style="vertical-align: middle !important; text-align: center !important;">Client ID</th> -->
                            <th style="vertical-align: middle !important; text-align: center !important;">Client</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Full Name</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">DOB</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Email Address</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Mobile Number</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Last Haircut</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Images</th>
                            <th style="vertical-align: middle !important; text-align: center !important;">Actions</th>
                        </tr>
                    </thead>
                    <tbody style="text-align: center !important; vertical-align: middle !important;">
                    </tbody>
                </table>
            </div>

            <?php get_template_part('template-parts/components/admin', 'clients-list-upload-modal'); ?>
            <?php get_template_part('template-parts/components/admin', 'clients-list-delete-img-confirmation-modal') ?>
            <?php get_template_part('template-parts/components/admin', 'clients-list-booking-history-modal') ?>
            <?php get_template_part('template-parts/components/admin', 'clients-list-add-new-client-modal') ?>
        </main>
    </div>
</div>

<?php
get_template_part('template-parts/components/footer', 'nav');
get_footer();
?>