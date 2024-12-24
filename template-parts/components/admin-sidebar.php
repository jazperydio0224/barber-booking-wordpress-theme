<aside id="sidebar" class="shadow-sm sidebar-toggle">

    <!-- Start - Sidebar Navigation -->
    <div class="sidebar-logo">
        <a href="<?= esc_url(home_url('/admin-dashboard')); ?>">D'Shaver and Comb</a>
    </div>
    <ul class="sidebar-nav p-0">
        <li class="sidebar-header">NAVIGATION</li>

        <li class="sidebar-item">
            <a href="<?= esc_url(home_url('/admin-dashboard')); ?>" class="sidebar-link <?php if (is_page('admin-dashboard')) echo 'active'; ?>" data-target="bookings-calendar">
                <i class="fa-solid fa-calendar"></i>
                <span>Bookings Calendar</span>
            </a>
        </li>
        <li class="sidebar-item">
            <a href="<?= esc_url(home_url('/admin-dashboard/bookings-list')); ?>" class="sidebar-link <?php if (is_page('bookings-list')) echo 'active'; ?>" data-target="bookings-list">
                <i class="fa-solid fa-list"></i>
                <span>Booking List</span>
            </a>
        </li>

        <li class="sidebar-item">
            <a href="<?= esc_url(home_url('/admin-dashboard/clients-list')); ?>" class="sidebar-link <?php if (is_page('clients-list')) echo 'active'; ?>" data-target="bookings-clients-list">
                <i class="fa-solid fa-user-shield"></i>
                <span>Clients List</span>
            </a>
        </li>


        <li class="sidebar-item">
            <a href="<?= esc_url(home_url('/admin-dashboard/notifications-list')); ?>" class="sidebar-link <?php if (is_page('notifications-list')) echo 'active'; ?>" data-target="bookings-notification">
                <i class="fa-solid fa-bell"></i>
                <span>Notifications <span id="notification-count" class="badge text-bg-danger d-none">0</span></span>
            </a>
        </li>

        <!-- Start - Sidebar Footer -->
        <div class="sidebar-footer">
            <a href="<?php echo wp_logout_url(home_url()); ?>" class="sidebar-link" id="log-out-btn">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
                <span>Log out</span>
            </a>
        </div>
        <!-- End - Sidebar Footer -->
    </ul>
    <!-- End - Sidebar Navigation -->
</aside>