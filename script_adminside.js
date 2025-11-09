document.addEventListener('DOMContentLoaded', function () {
    // --- MODAL INSTANCES ---
    const messageModal = new bootstrap.Modal(document.getElementById('message-modal'));

    // --- DATA (Simulating a database) ---
    let destinations = [
        { id: 1, name: 'Paris', img: 'adminside_img/paris.png', description: 'Experience the timeless romance of Paris.' },
        { id: 2, name: 'Kyoto', img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=1200', description: 'Step into a world of ancient temples and serene gardens.' },
        { id: 3, name: 'Goa', img: 'adminside_img/goa.png', description: 'Relax on sun-kissed beaches and enjoy vibrant nightlife.'},
        { id: 4, name: 'Dubai', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200', description: 'Discover a futuristic city rising from the desert.'}
    ];
    let users = [
        { id: 1, name: 'Admin User', email: 'admin@wanderlust.com', role: 'Admin', status: 'Active'},
        { id: 2, name: 'Rohan Sharma', email: 'rohan@example.com', role: 'User', status: 'Active'},
        { id: 3, name: 'Priya Patel', email: 'priya@example.com', role: 'User', status: 'Active'},
    ];
    let bookings = [
        { id: 1, customer: 'Rohan Sharma', destId: 1, date: '2025-10-15', status: 'Confirmed'},
        { id: 2, customer: 'Priya Patel', destId: 3, date: '2025-11-02', status: 'Pending'},
        { id: 3, customer: 'Vikram Singh', destId: 2, date: '2025-09-28', status: 'Canceled'},
        { id: 4, customer: 'Anjali Mehta', destId: 4, date: '2025-10-22', status: 'Confirmed' }
    ];
    let messages = [
        { id: 1, from: 'Suresh Kumar', subject: 'Inquiry about Japan tour', body: 'Hello, I would like to know more details about the cultural tour of Kyoto.'},
        { id: 2, from: 'Deepa Iyer', subject: 'Custom package request', body: 'Can you create a custom family package for a trip to Europe?'},
    ];

    // --- RENDER FUNCTIONS ---
    function renderAll() {
        renderDashboard();
        renderAdminDestinations();
        renderAdminBookings();
        renderAdminUsers();
        renderAdminMessages();
    }

    function renderDashboard() {
        document.getElementById('dashboard-bookings').textContent = bookings.length;
        document.getElementById('dashboard-destinations').textContent = destinations.length;
        document.getElementById('dashboard-users').textContent = users.length;
        const recentBookingsContainer = document.getElementById('dashboard-recent-bookings');
        recentBookingsContainer.innerHTML = bookings.slice(0, 3).map(b => {
            const dest = destinations.find(d => d.id === b.destId) || { name: 'Unknown' };
            return `<tr><td>${b.customer}</td><td>${dest.name}</td><td>${b.date}</td><td><button class="btn btn-sm btn-outline-secondary view-booking-btn" data-id="${b.id}">View</button></td></tr>`
        }).join('');
    }

    function renderAdminDestinations() {
        const container = document.getElementById('destinations-table-body');
        container.innerHTML = destinations.map(d => `<tr><td><img src="${d.img}" width="80" style="border-radius: 5px;" alt="${d.name}"></td><td>${d.name}</td><td><button class="btn btn-sm btn-outline-danger delete-destination-btn" data-id="${d.id}"><i class="fas fa-trash"></i> Delete</button></td></tr>`).join('');
    }

    function renderAdminBookings(filter = 'All') {
        const container = document.getElementById('bookings-table-body');
        const statusColors = { Confirmed: 'success', Pending: 'warning', Canceled: 'danger' };
        const filteredBookings = (filter === 'All') ? bookings : bookings.filter(b => b.status === filter);
        container.innerHTML = filteredBookings.map(b => {
            const dest = destinations.find(d => d.id === b.destId) || { name: 'Unknown' };

            let actionButton;
            if (b.status === 'Pending') {
                actionButton = `<button class="btn btn-sm btn-outline-success manage-booking-btn" data-id="${b.id}">Approve</button>`;
            } else if (b.status === 'Confirmed') {
                actionButton = `<button class="btn btn-sm btn-outline-danger manage-booking-btn" data-id="${b.id}">Cancel</button>`;
            } else { // Canceled
                actionButton = `<button class="btn btn-sm btn-outline-warning manage-booking-btn" data-id="${b.id}">Re-Open</button>`;
            }

            return `<tr><td>${b.customer}</td><td>${dest.name}</td><td><span class="badge bg-${statusColors[b.status]}">${b.status}</span></td><td>${actionButton} <button class="btn btn-sm btn-outline-secondary view-booking-btn" data-id="${b.id}">View</button></td></tr>`
        }).join('');
    }

    function renderBookingDetail(bookingId) {
        const booking = bookings.find(b => b.id == bookingId);
        const destination = destinations.find(d => d.id === booking.destId);
        const container = document.getElementById('booking-detail-content');
        if (!booking || !destination) { container.innerHTML = `<p>Booking details not found.</p>`; return; }
        container.innerHTML = `<div class="row g-4"><div class="col-md-5"><img src="${destination.img}" class="img-fluid rounded" alt="${destination.name}"></div><div class="col-md-7"><h4>Booking #${booking.id}</h4><p><strong>Customer:</strong> ${booking.customer}</p><p><strong>Destination:</strong> ${destination.name}</p><p><strong>Date:</strong> ${booking.date}</p><p><strong>Status:</strong> ${booking.status}</p></div></div><button class="btn btn-primary mt-4 admin-nav-link" data-page="admin-bookings-page">Back to Bookings</button>`;
    }

    function renderAdminUsers() {
        const container = document.getElementById('users-table-body');
        container.innerHTML = users.map(u => {
            const isBanned = u.status === 'Banned';
            const banButtonText = isBanned ? 'Unban' : 'Ban';
            const banButtonClass = isBanned ? 'btn-outline-success' : 'btn-outline-danger';
            const rowClass = isBanned ? 'user-banned' : '';

            return `<tr class="${rowClass}"><td>${u.name}</td><td>${u.email}</td><td><span class="badge ${u.role === 'Admin' ? 'bg-primary' : 'bg-secondary'}">${u.role}</span></td><td><button class="btn btn-sm btn-outline-primary edit-user-btn" data-id="${u.id}">Edit</button> <button class="btn btn-sm ${banButtonClass} ban-user-btn" data-id="${u.id}">${banButtonText}</button></td></tr>`
        }).join('');
    }

    function renderEditUserPage(userId) {
        const user = users.find(u => u.id == userId);
        const container = document.getElementById('edit-user-form-container');
        if(!user) { container.innerHTML = 'User not found.'; return; }
        container.innerHTML = `
            <form id="edit-user-form">
                <input type="hidden" id="edit-user-id" value="${user.id}">
                <div class="mb-3"><label class="form-label">Name</label><input type="text" class="form-control" id="edit-user-name" value="${user.name}" required></div>
                <div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" id="edit-user-email" value="${user.email}" required></div>
                <div class="mb-3"><label class="form-label">Role</label>
                    <select class="form-select" id="edit-user-role">
                        <option value="User" ${user.role === 'User' ? 'selected' : ''}>User</option>
                        <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" class="btn btn-secondary admin-nav-link" data-page="admin-users-page">Cancel</button>
            </form>
        `;
    }

    function renderAdminMessages() {
        const container = document.getElementById('messages-table-body');
        container.innerHTML = messages.map(m => `<tr><td>${m.from}</td><td><button class="btn btn-sm btn-outline-primary view-message-btn" data-id="${m.id}">View</button></td></tr>`).join('');
    }

    // --- NAVIGATION LOGIC ---
    function showAdminPage(pageId) {
        document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');

        document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`.admin-nav-link[data-page="${pageId}"]`)?.classList.add('active');
    }

    document.querySelectorAll('.admin-nav-link').forEach(link => link.addEventListener('click', e => { e.preventDefault(); showAdminPage(e.currentTarget.dataset.page) }));

    // --- ADMIN PAGE FUNCTIONALITY ---
    document.getElementById('booking-status-filter').addEventListener('change', (e) => renderAdminBookings(e.target.value));

    document.getElementById('destination-form-page').addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('destination-title-page');
        const imgInput = document.getElementById('destination-img-page');
        const descInput = document.getElementById('destination-description-page');
        const feedbackDiv = document.getElementById('destination-form-feedback');

        feedbackDiv.innerHTML = ''; // Clear old messages

        const name = nameInput.value.trim();
        const img = imgInput.value.trim();
        const description = descInput.value.trim();

        if (!name || !img || !description) {
            feedbackDiv.innerHTML = `<div class="alert alert-danger">All fields are required.</div>`;
            return;
        }

        if (description.length < 10) {
            feedbackDiv.innerHTML = `<div class="alert alert-danger">Description must be at least 10 characters.</div>`;
            return;
        }

        destinations.push({
            id: Date.now(),
            name,
            img,
            description
        });

        renderAll();
        e.target.reset();
        feedbackDiv.innerHTML = `<div class="alert alert-success">Destination added successfully!</div>`;
        setTimeout(() => feedbackDiv.innerHTML = '', 4000);
    });

    document.getElementById('destinations-table-body').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-destination-btn');
        if (deleteBtn) {
            if (confirm('Are you sure?')) {
                destinations = destinations.filter(d => d.id != deleteBtn.dataset.id);
                renderAll();
            }
        }
    });

    document.getElementById('messages-table-body').addEventListener('click', (e) => {
        if (e.target.closest('.view-message-btn')) {
            const msg = messages.find(m => m.id == e.target.closest('.view-message-btn').dataset.id);
            document.getElementById('message-modal-title').textContent = `From: ${msg.from}`;
            document.getElementById('message-modal-body').innerHTML = `<p><strong>Subject:</strong> ${msg.subject}</p><p>${msg.body}</p>`;
            messageModal.show();
        }
    });

    document.getElementById('admin-content').addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-booking-btn');
        const manageBtn = e.target.closest('.manage-booking-btn');

        if (viewBtn) {
            const bookingId = viewBtn.dataset.id;
            renderBookingDetail(bookingId);
            showAdminPage('admin-booking-detail-page');
        }

        if (manageBtn) {
            const bookingId = manageBtn.dataset.id;
            const booking = bookings.find(b => b.id == bookingId);
            if (booking) {
                if (booking.status === 'Pending') {
                    booking.status = 'Confirmed';
                } else if (booking.status === 'Confirmed') {
                    booking.status = 'Canceled';
                } else if (booking.status === 'Canceled') {
                    booking.status = 'Pending';
                }
                renderAdminBookings(document.getElementById('booking-status-filter').value);
            }
        }

        if (e.target.matches('.admin-nav-link')) {
            showAdminPage(e.target.dataset.page);
        }
    });

    // User Page Logic
    document.getElementById('users-table-body').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-user-btn');
        const banBtn = e.target.closest('.ban-user-btn');

        if (editBtn) {
            renderEditUserPage(editBtn.dataset.id);
            showAdminPage('admin-edit-user-page');
        }

        if (banBtn) {
            const user = users.find(u => u.id == banBtn.dataset.id);
            if (user) {
                user.status = user.status === 'Active' ? 'Banned' : 'Active';
                renderAdminUsers();
            }
        }
    });

    document.getElementById('edit-user-form-container').addEventListener('submit', (e) => {
        if (e.target.id === 'edit-user-form') {
            e.preventDefault();

            const name = document.getElementById('edit-user-name').value.trim();
            const email = document.getElementById('edit-user-email').value.trim();
            const role = document.getElementById('edit-user-role').value;
            const feedbackDiv = document.getElementById('edit-user-form-feedback');

            if (feedbackDiv) feedbackDiv.innerHTML = '';

            if (!name || !email) {
                if (feedbackDiv) feedbackDiv.innerHTML = `<div class="alert alert-danger">Name and Email are required.</div>`;
                return;
            }

            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
            if (!email.match(emailPattern)) {
                if (feedbackDiv) feedbackDiv.innerHTML = `<div class="alert alert-danger">Enter a valid email address.</div>`;
                return;
            }

            const userId = document.getElementById('edit-user-id').value;
            const user = users.find(u => u.id == userId);
            if (user) {
                user.name = name;
                user.email = email;
                user.role = role;
            }

            renderAdminUsers();
            showAdminPage('admin-users-page');
        }
    });

    // --- INITIAL LOAD ---
    renderAll();
});
