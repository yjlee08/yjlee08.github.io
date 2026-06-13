document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('ul.tab-nav li .button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('data-ref');
            
            // Remove active from sibling buttons
            const nav = this.closest('ul.tab-nav');
            if (nav) {
                nav.querySelectorAll('.button.active').forEach(btn => btn.classList.remove('active'));
            }
            this.classList.add('active');

            // Find target pane and remove active from siblings
            const targetPane = document.querySelector(href);
            if (targetPane) {
                const tabContent = targetPane.closest('.tab-content');
                if (tabContent) {
                    tabContent.querySelectorAll('.tab-pane.active').forEach(pane => pane.classList.remove('active'));
                }
                targetPane.classList.add('active');
            }
        });
    });
});
