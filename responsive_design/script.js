document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function setMenu(open) {
    navMenu.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  navToggle.addEventListener('click', function () {
    setMenu(!navMenu.classList.contains('active'));
  });

  // Закрытие меню при клике на ссылку
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  // Закрытие меню при возврате к десктопной ширине
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      setMenu(false);
    }
  });
});
