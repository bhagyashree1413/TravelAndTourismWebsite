document.addEventListener('DOMContentLoaded', function () {
    const pageLinks = document.querySelectorAll('.nav-link-item');
    const pageSections = document.querySelectorAll('.page-section');
    const navCollapse = document.querySelector('.navbar-collapse');
    const bsCollapse = new bootstrap.Collapse(navCollapse, { toggle: false });

    function showPage(pageId) {
        pageSections.forEach(section => section.classList.remove('active'));

        const activePage = document.getElementById(pageId);
        if (activePage) activePage.classList.add('active');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const mainPageId = pageId.split('-')[0] + '-page';
            if (link.dataset.page === pageId || link.dataset.page === mainPageId) {
                link.classList.add('active');
            }
        });

        if (navCollapse.classList.contains('show')) {
            bsCollapse.hide();
        }

        window.scrollTo(0, 0);
    }
    function goToAdmin() {
    // Change this URL to your actual admin page
    window.location.href = "https://yourwebsite.com/admin";
  }

    pageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const pageId = this.dataset.page;
            if (pageId) {
                e.preventDefault();
                const hash = this.getAttribute('href') || `#${pageId.replace('-page', '')}`;
                history.pushState(null, '', hash);
                showPage(pageId);
            }
        });
    });

    function handleInitialPageLoad() {
        const pageName = location.hash.substring(1);
        let initialPageId = 'home-page';
        if (pageName) {
            const matchingPage = [...pageSections].find(p => p.id.startsWith(pageName));
            if (matchingPage) initialPageId = matchingPage.id;
        }
        showPage(initialPageId);
    }

    window.addEventListener('popstate', handleInitialPageLoad);
    handleInitialPageLoad();

    /* ---------------- CONTACT FORM ---------------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const feedbackDiv = document.getElementById("form-feedback");

            feedbackDiv.innerHTML = "";

            if (!name || !email || !message) {
                feedbackDiv.innerHTML = '<div class="alert alert-danger">All fields are required.</div>';
                return;
            }

            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!email.match(emailPattern)) {
                feedbackDiv.innerHTML = '<div class="alert alert-danger">Please enter a valid email address.</div>';
                return;
            }

            if (message.length < 10) {
                feedbackDiv.innerHTML = '<div class="alert alert-danger">Message must be at least 10 characters long.</div>';
                return;
            }

            feedbackDiv.innerHTML = '<div class="alert alert-success">Thank you for your message! We will get back to you soon.</div>';
            contactForm.reset();

            setTimeout(() => feedbackDiv.innerHTML = '', 5000);
        });
    }

    /* ---------------- PAYMENT LOGO SETUP ---------------- */
    const paymentMethods = [
        { id: "visa", name: "Visa", img: "visa.png" },
        { id: "mastercard", name: "MasterCard", img: "mastercard.png" },
        { id: "gpay", name: "Google Pay", img: "gpay.png" },
        { id: "paypal", name: "PayPal", img: "paypal.png" },
    ];

    function injectPaymentLogos(bookingPage) {
        if (!bookingPage) return;
        if (bookingPage.querySelector('.payment-options')) return; // avoid duplicates

        const wrapper = document.createElement("div");
        wrapper.classList.add("payment-options");
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "center";
        wrapper.style.gap = "15px";
        wrapper.style.marginTop = "10px";

        paymentMethods.forEach((method, index) => {
            const optionDiv = document.createElement("div");
            optionDiv.classList.add("payment-option");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = `${method.id}-${bookingPage.id}`;
            radio.name = `payment-${bookingPage.id}`;
            radio.value = method.id;
            if (index === 0) radio.checked = true;

            const label = document.createElement("label");
            label.htmlFor = radio.id;

            const img = document.createElement("img");
            img.src = method.img;
            img.alt = method.name;
            img.style.width = "60px";
            img.style.cursor = "pointer";
            img.style.border = "2px solid transparent";
            img.style.borderRadius = "8px";
            img.style.padding = "5px";
            img.style.transition = "transform 0.2s";

            radio.addEventListener('change', () => {
                bookingPage.querySelectorAll('.payment-option img').forEach(i => i.style.borderColor = 'transparent');
                img.style.borderColor = "#007bff";
                img.style.transform = "scale(1.1)";
            });

            if (index === 0) {
                img.style.borderColor = "#007bff";
                img.style.transform = "scale(1.1)";
            }

            label.appendChild(img);
            optionDiv.appendChild(radio);
            optionDiv.appendChild(label);
            wrapper.appendChild(optionDiv);
        });

        // Insert before the booking submit button
        const submitButton = bookingPage.querySelector('button[type="submit"]');
        if (submitButton) bookingPage.insertBefore(wrapper, submitButton);
    }

    /* ---------------- BOOKING FORM ---------------- */
    document.querySelectorAll('button[type="submit"]').forEach(button => {
        const bookingPage = button.closest('.page-section');

        if (bookingPage && bookingPage.id.startsWith('booking-')) {

            // Inject payment logos dynamically
            injectPaymentLogos(bookingPage);

            button.addEventListener('click', function (e) {
                e.preventDefault();

                const feedbackDiv = bookingPage.querySelector('.booking-feedback');
                const inputs = bookingPage.querySelectorAll('.form-control');
                const [nameField, emailField, travelersField] = inputs;

                if (feedbackDiv) feedbackDiv.innerHTML = '';

                // --- Validation ---
                if (!nameField?.value.trim() || !emailField?.value.trim() || !travelersField?.value.trim()) {
                    feedbackDiv.innerHTML = `<div class="alert alert-danger">Please fill in all required details before confirming payment.</div>`;
                    return;
                }

                const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    feedbackDiv.innerHTML = `<div class="alert alert-danger">Please enter a valid email address.</div>`;
                    return;
                }

                const numTravelers = parseInt(travelersField.value);
                if (isNaN(numTravelers) || numTravelers <= 0) {
                    feedbackDiv.innerHTML = `<div class="alert alert-danger">Please enter a valid number of travelers.</div>`;
                    return;
                }

                // --- Simulate Payment Processing ---
                button.disabled = true;
                const originalText = button.innerText;
                button.innerText = "Processing...";

                setTimeout(() => {
                    showPage('booking-success-page');
                    history.pushState(null, '', '#booking-success');
                    button.disabled = false;
                    button.innerText = originalText;
                }, 1500);
            });
        }
    });
});