document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const navItems = document.querySelectorAll('.nav-links li a'); // Desktop nav items
    const sidebarLinks = document.querySelectorAll('#sidebar ul li a'); // Sidebar nav items
    const avatarWrapper = document.querySelector('.navbar-avatar-wrapper'); // Avatar wrapper
    const avatarDropdown = document.querySelector('.avatar-dropdown'); // Avatar dropdown

    // Toggle sidebar visibility
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        hamburger.classList.toggle('active'); // Animate hamburger icon
        overlay.classList.toggle('active');
        document.body.style.overflowY = sidebar.classList.contains('active') ? 'hidden' : 'auto'; // Prevent scrolling when sidebar is open
    }

    hamburger.addEventListener('click', toggleSidebar);
    closeBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar); // Close sidebar when clicking overlay

    // Close sidebar when a sidebar link is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            // You might want to add smooth scrolling here if these links point to sections
            // For now, just close the sidebar
            toggleSidebar();
        });
    });

    // Toggle avatar dropdown
    avatarWrapper.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent click from bubbling to document and closing immediately
        this.classList.toggle('active');
    });

    // Close avatar dropdown when clicking anywhere else on the document
    document.addEventListener('click', function(event) {
        if (!avatarWrapper.contains(event.target)) {
            avatarWrapper.classList.remove('active');
        }
    });


    // Set initial active link based on current URL hash or default to first link (for desktop nav)
    const currentHash = window.location.hash;
    if (currentHash) {
        const activeLink = document.querySelector(`.nav-links li a[href="${currentHash}"]`);
        if (activeLink) {
            activeLink.classList.add('active-link');
        }
    } else {
        // If no hash, activate the 'Home' link by default
        const homeLink = document.querySelector('.nav-links li a[href="#hero"]');
        if (homeLink) {
            homeLink.classList.add('active-link');
        }
    }

    // Update active link on scroll (for desktop nav)
    const sections = document.querySelectorAll('main section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) { // Adjust offset as needed
                current = '#' + section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === current) {
                link.classList.add('active-link');
            }
        });
    });

    // FAQ Accordion Logic (existing from previous update)
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const icon = question.querySelector('i');

            // Close all other open FAQ items
            faqQuestions.forEach(otherQuestion => {
                const otherFaqItem = otherQuestion.closest('.faq-item');
                const otherFaqAnswer = otherFaqItem.querySelector('.faq-answer');
                const otherIcon = otherQuestion.querySelector('i');

                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherFaqAnswer.classList.remove('active');
                    otherFaqAnswer.style.maxHeight = null; // Collapse the answer
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            });

            // Toggle the clicked FAQ item
            question.classList.toggle('active');
            faqAnswer.classList.toggle('active');

            if (faqAnswer.classList.contains('active')) {
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px"; // Expand the answer
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                faqAnswer.style.maxHeight = null; // Collapse the answer
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
});