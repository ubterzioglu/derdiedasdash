/* ============================================
   DER DIE DAS SPACE - HAMBURGER MENU
   Hamburger menu functionality for all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const slideMenu = document.getElementById('slideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenuBtn = document.getElementById('closeMenuBtn');

  if (!hamburgerBtn || !slideMenu || !menuOverlay) return;

  // Open menu
  hamburgerBtn.addEventListener('click', () => {
    slideMenu.classList.add('active');
    menuOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });

  // Close menu
  function closeMenu() {
    slideMenu.classList.remove('active');
    menuOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }

  menuOverlay.addEventListener('click', closeMenu);

  // Close on menu item click
  const menuItems = slideMenu.querySelectorAll('.slide-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', closeMenu);
  });
});
