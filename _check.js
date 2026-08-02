
  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark text-lg"></i>' : '<i class="fa-solid fa-bars text-lg"></i>';
  });
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars text-lg"></i>';
    });
  });

  // Scroll-triggered fade-up reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Contact form (Web3Forms) — graceful handling without leaving the page
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const FORM_MSG = {
    sending:  { en: 'Sending...', ar: 'جارٍ الإرسال...' },
    success:  { en: "Message sent — we'll get back to you soon.", ar: 'تم إرسال رسالتك — سنتواصل معك قريبًا.' },
    fail:     { en: 'Something went wrong. Please try again or call us directly.', ar: 'حدث خطأ ما. حاول مرة أخرى أو اتصل بنا مباشرة.' },
    network:  { en: 'Network error. Please try again or call us directly.', ar: 'خطأ في الشبكة. حاول مرة أخرى أو اتصل بنا مباشرة.' }
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    status.classList.remove('hidden');
    status.textContent = FORM_MSG.sending[lang];
    status.style.color = '#c9c0b6';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      const data = await res.json();
      if (data.success) {
        status.textContent = FORM_MSG.success[lang];
        status.style.color = '#fb923c';
        form.reset();
      } else {
        status.textContent = FORM_MSG.fail[lang];
        status.style.color = '#dc2626';
      }
    } catch (err) {
      status.textContent = FORM_MSG.network[document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en'];
      status.style.color = '#dc2626';
    }
  });

  // ===================== BILINGUAL (EN / AR) SUPPORT =====================
  const TRANSLATIONS = {
    nav_menu:        { en: 'Menu', ar: 'القائمة' },
    nav_reviews:     { en: 'Reviews', ar: 'الآراء' },
    nav_contact:     { en: 'Contact', ar: 'تواصل' },
    nav_call:        { en: 'Call Now', ar: 'اتصل الآن' },

    hero_eyebrow:    { en: "JEDDAH'S PRESSURE-FRIED FAVORITE", ar: 'المفضل في جدة للدجاج المقرمش' },
    hero_tagline:    { en: 'Best Broast in Jeddah – Open 24 Hours', ar: 'أفضل بروست في جدة – مفتوح ٢٤ ساعة' },
    hero_sub:        { en: 'Crunchy. Juicy. Always Open.', ar: 'مقرمش. عصيري. مفتوح دائمًا.' },
    hero_order:      { en: 'Order Now', ar: 'اطلب الآن' },
    hero_viewmenu:   { en: 'View Menu', ar: 'عرض القائمة' },
    hero_directions: { en: 'Get Directions', ar: 'احصل على الاتجاهات' },

    menu_eyebrow:    { en: 'STRAIGHT FROM THE PRESSURE FRYER', ar: 'طازج مباشرة من القلاية الضاغطة' },
    menu_h2:         { en: 'Our <span class="fire-text">Menu</span>', ar: '<span class="fire-text">قائمتنا</span>' },
    menu_sub:        { en: 'Our full menu, straight from the counter to your table.', ar: 'قائمتنا الكاملة، طازجة من عندنا إلى طاولتك.' },

    broast_eyebrow: { en: "STRAIGHT FROM THE PRESSURE FRYER", ar: "\u0637\u0627\u0632\u062c \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u0627\u0644\u0642\u0644\u0627\u064a\u0629 \u0627\u0644\u0636\u0627\u063a\u0637\u0629" },
    broast_title:   { en: "Broast", ar: "\u0628\u0631\u0648\u0633\u062a" },
    broasted_chicken_title: { en: "Broasted Chicken", ar: "\u062f\u062c\u0627\u062c \u0628\u0631\u0648\u0633\u062a" },
    broasted_chicken_desc:  { en: "Our signature pressure-fried chicken \u2014 golden, crispy, and juicy inside. Regular or spicy.", ar: "\u062f\u062c\u0627\u062c\u0646\u0627 \u0627\u0644\u0645\u0642\u0631\u0645\u0634 \u0627\u0644\u0645\u0642\u0644\u064a \u0628\u0627\u0644\u0636\u063a\u0637\u060c \u0630\u0647\u0628\u064a \u0648\u0645\u0642\u0631\u0645\u0634 \u0645\u0646 \u0627\u0644\u062e\u0627\u0631\u062c \u0648\u0637\u0631\u064a \u0645\u0646 \u0627\u0644\u062f\u0627\u062e\u0644. \u0645\u062a\u0648\u0641\u0631 \u0639\u0627\u062f\u064a \u0623\u0648 \u062d\u0627\u0631." },
    chicken_musaab_title: { en: "Chicken Musaab (8 pcs)", ar: "\u062f\u062c\u0627\u062c \u0645\u0633\u062d\u0628 (8 \u0642\u0637\u0639)" },
    chicken_musaab_desc:  { en: "Eight pieces of tender pulled fried chicken. Regular or spicy.", ar: "\u062b\u0645\u0627\u0646\u064a \u0642\u0637\u0639 \u0645\u0646 \u062f\u062c\u0627\u062c \u0627\u0644\u0628\u0631\u0648\u0633\u062a \u0627\u0644\u0645\u0633\u062d\u0628 \u0627\u0644\u0637\u0631\u064a. \u0645\u062a\u0648\u0641\u0631 \u0639\u0627\u062f\u064a \u0623\u0648 \u062d\u0627\u0631." },
    fish_fillet_title: { en: "Fish Fillet (8 pcs)", ar: "\u0633\u0645\u0643 \u0641\u064a\u0644\u064a\u0647 (8 \u0642\u0637\u0639)" },
    fish_fillet_desc:  { en: "Eight pieces of crispy fried fish fillet, served with fries.", ar: "\u062b\u0645\u0627\u0646\u064a \u0642\u0637\u0639 \u0645\u0646 \u0641\u064a\u0644\u064a\u0647 \u0627\u0644\u0633\u0645\u0643 \u0627\u0644\u0645\u0642\u0631\u0645\u0634\u060c \u062a\u064f\u0642\u062f\u064e\u0651\u0645 \u0645\u0639 \u0627\u0644\u0628\u0637\u0627\u0637\u0627." },
    shrimp_broast_title: { en: "Shrimp Broast (10 pcs)", ar: "\u0628\u0631\u0648\u0633\u062a \u062c\u0645\u0628\u0631\u064a (10 \u0642\u0637\u0639)" },
    shrimp_broast_desc:  { en: "Ten pieces of crispy broasted shrimp. Regular or spicy.", ar: "\u0639\u0634\u0631 \u0642\u0637\u0639 \u0645\u0646 \u0627\u0644\u062c\u0645\u0628\u0631\u064a \u0627\u0644\u0645\u0642\u0631\u0645\u0634 \u0627\u0644\u0645\u0642\u0644\u064a \u0628\u0627\u0644\u0636\u063a\u0637. \u0645\u062a\u0648\u0641\u0631 \u0639\u0627\u062f\u064a \u0623\u0648 \u062d\u0627\u0631." },
    zinger_plate_title: { en: "Zinger (4 pcs)", ar: "\u0632\u0646\u062c\u0631 \u0635\u062d\u0646 (4 \u0642\u0637\u0639)" },
    zinger_plate_desc:  { en: "Four pieces of spicy zinger chicken on the bone. Regular or spicy.", ar: "\u0623\u0631\u0628\u0639 \u0642\u0637\u0639 \u0645\u0646 \u062f\u062c\u0627\u062c \u0627\u0644\u0632\u0646\u062c\u0631 \u0627\u0644\u062d\u0627\u0631. \u0645\u062a\u0648\u0641\u0631 \u0639\u0627\u062f\u064a \u0623\u0648 \u062d\u0627\u0631." },
    burgers_eyebrow: { en: "PRESSED, GRILLED, STACKED", ar: "\u0645\u0634\u0648\u064a \u0648\u0645\u062d\u0636\u0651\u0631 \u0637\u0627\u0632\u062c\u064b\u0627" },
    burgers_title:   { en: "Burgers", ar: "\u0628\u0631\u062c\u0631" },
    grilled_chicken_burger_title: { en: "Grilled Chicken Burger", ar: "\u0628\u0631\u062c\u0631 \u0641\u062d\u0645 \u062f\u062c\u0627\u062c" },
    grilled_chicken_burger_desc:  { en: "Chargrilled chicken patty with fresh veggies in a toasted bun. SAR 11 with cheese.", ar: "\u0642\u0637\u0639\u0629 \u062f\u062c\u0627\u062c \u0645\u0634\u0648\u064a\u0629 \u0639\u0644\u0649 \u0627\u0644\u0641\u062d\u0645 \u0645\u0639 \u062e\u0636\u0627\u0631 \u0637\u0627\u0632\u062c\u0629 \u0641\u064a \u062e\u0628\u0632 \u0645\u062d\u0645\u0635. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 11 \u0631\u064a\u0627\u0644." },
    grilled_beef_burger_title: { en: "Grilled Beef Burger", ar: "\u0628\u0631\u062c\u0631 \u0641\u062d\u0645 \u0644\u062d\u0645" },
    grilled_beef_burger_desc:  { en: "Juicy chargrilled beef patty, fresh veggies, toasted bun. SAR 13 with cheese.", ar: "\u0642\u0637\u0639\u0629 \u0644\u062d\u0645 \u0628\u0642\u0631\u064a \u0645\u0634\u0648\u064a\u0629 \u0639\u0644\u0649 \u0627\u0644\u0641\u062d\u0645 \u0645\u0639 \u062e\u0636\u0627\u0631 \u0637\u0627\u0632\u062c\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 13 \u0631\u064a\u0627\u0644." },
    zinger_burger_title: { en: "Zinger Burger", ar: "\u0628\u0631\u062c\u0631 \u0632\u0646\u062c\u0631" },
    zinger_burger_desc:  { en: "Crispy spicy chicken fillet, lettuce, and sauce. SAR 12 with cheese.", ar: "\u0641\u064a\u0644\u064a\u0647 \u062f\u062c\u0627\u062c \u0645\u0642\u0631\u0645\u0634 \u0648\u062d\u0627\u0631 \u0645\u0639 \u062e\u0633 \u0648\u0635\u0644\u0635\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 12 \u0631\u064a\u0627\u0644." },
    fish_burger_title: { en: "Fish Burger", ar: "\u0628\u0631\u062c\u0631 \u0633\u0645\u0643" },
    fish_burger_desc:  { en: "Crispy fish fillet with lettuce and tartar-style sauce. SAR 11 with cheese.", ar: "\u0641\u064a\u0644\u064a\u0647 \u0633\u0645\u0643 \u0645\u0642\u0631\u0645\u0634 \u0645\u0639 \u062e\u0633 \u0648\u0635\u0644\u0635\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 11 \u0631\u064a\u0627\u0644." },
    shawarma_burger_title: { en: "Shawarma Burger", ar: "\u0628\u0631\u062c\u0631 \u0634\u0627\u0648\u0631\u0645\u0627" },
    shawarma_burger_desc:  { en: "Shawarma-spiced chicken piled high with pickles and garlic sauce. SAR 10 with cheese.", ar: "\u062f\u062c\u0627\u062c \u0645\u062a\u0628\u0651\u0644 \u0639\u0644\u0649 \u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0634\u0627\u0648\u0631\u0645\u0627 \u0645\u0639 \u0627\u0644\u0645\u062e\u0644\u0644 \u0648\u0635\u0644\u0635\u0629 \u0627\u0644\u062b\u0648\u0645. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 10 \u0631\u064a\u0627\u0644." },
    grilled_chicken_double_burger_title: { en: "Grilled Chicken Double Burger", ar: "\u0628\u0631\u062c\u0631 \u062f\u062c\u0627\u062c (\u062f\u0628\u0644) \u0639\u0644\u0649 \u0627\u0644\u0641\u062d\u0645" },
    grilled_chicken_double_burger_desc:  { en: "Two chargrilled chicken patties stacked with fresh veggies. SAR 19 with cheese.", ar: "\u0642\u0637\u0639\u062a\u0627\u0646 \u0645\u0646 \u0627\u0644\u062f\u062c\u0627\u062c \u0627\u0644\u0645\u0634\u0648\u064a \u0639\u0644\u0649 \u0627\u0644\u0641\u062d\u0645 \u0645\u0639 \u062e\u0636\u0627\u0631 \u0637\u0627\u0632\u062c\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 19 \u0631\u064a\u0627\u0644." },
    grilled_beef_double_burger_title: { en: "Grilled Beef Double Burger", ar: "\u0628\u0631\u062c\u0631 \u0644\u062d\u0645 (\u062f\u0628\u0644) \u0639\u0644\u0649 \u0627\u0644\u0641\u062d\u0645" },
    grilled_beef_double_burger_desc:  { en: "Two chargrilled beef patties, double the flavor. SAR 22 with cheese.", ar: "\u0642\u0637\u0639\u062a\u0627\u0646 \u0645\u0646 \u0627\u0644\u0644\u062d\u0645 \u0627\u0644\u0628\u0642\u0631\u064a \u0627\u0644\u0645\u0634\u0648\u064a \u0639\u0644\u0649 \u0627\u0644\u0641\u062d\u0645. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 22 \u0631\u064a\u0627\u0644." },
    zinger_double_burger_title: { en: "Zinger Double Burger", ar: "\u062f\u0628\u0644 \u0628\u0631\u062c\u0631 \u0632\u0646\u062c\u0631" },
    zinger_double_burger_desc:  { en: "Two crispy spicy chicken fillets stacked high. SAR 19 with cheese.", ar: "\u0642\u0637\u0639\u062a\u0627\u0646 \u0645\u0646 \u0641\u064a\u0644\u064a\u0647 \u0627\u0644\u0632\u0646\u062c\u0631 \u0627\u0644\u0645\u0642\u0631\u0645\u0634 \u0648\u0627\u0644\u062d\u0627\u0631. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 19 \u0631\u064a\u0627\u0644." },
    sandwiches_eyebrow: { en: "WRAPPED FRESH TO ORDER", ar: "\u0637\u0627\u0632\u062c\u0629 \u0639\u0646\u062f \u0627\u0644\u0637\u0644\u0628" },
    sandwiches_title:   { en: "Sandwiches", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634" },
    zinger_sandwich_title: { en: "Zinger Sandwich", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0632\u0646\u062c\u0631" },
    zinger_sandwich_desc:  { en: "Crispy spicy chicken fillet wrapped with lettuce and sauce. SAR 12 with cheese.", ar: "\u0641\u064a\u0644\u064a\u0647 \u0632\u0646\u062c\u0631 \u0645\u0642\u0631\u0645\u0634 \u0648\u062d\u0627\u0631 \u0645\u0644\u0641\u0648\u0641 \u0645\u0639 \u0627\u0644\u062e\u0633 \u0648\u0627\u0644\u0635\u0644\u0635\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 12 \u0631\u064a\u0627\u0644." },
    nuggets_sandwich_title: { en: "Nuggets Sandwich", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0646\u0627\u062c\u062a\u0633" },
    nuggets_sandwich_desc:  { en: "Crispy chicken nuggets wrapped with fresh veggies and sauce. SAR 10 with cheese.", ar: "\u0646\u0627\u062c\u062a\u0633 \u062f\u062c\u0627\u062c \u0645\u0642\u0631\u0645\u0634\u0629 \u0645\u0644\u0641\u0648\u0641\u0629 \u0645\u0639 \u062e\u0636\u0627\u0631 \u0637\u0627\u0632\u062c\u0629 \u0648\u0635\u0644\u0635\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 10 \u0631\u064a\u0627\u0644." },
    fish_sandwich_title: { en: "Fish Sandwich", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0633\u0645\u0643" },
    fish_sandwich_desc:  { en: "Crispy fish fillet wrapped with lettuce and sauce. SAR 10 with cheese.", ar: "\u0641\u064a\u0644\u064a\u0647 \u0633\u0645\u0643 \u0645\u0642\u0631\u0645\u0634 \u0645\u0644\u0641\u0648\u0641 \u0645\u0639 \u0627\u0644\u062e\u0633 \u0648\u0627\u0644\u0635\u0644\u0635\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 10 \u0631\u064a\u0627\u0644." },
    shrimp_sandwich_title: { en: "Shrimp Sandwich", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u062c\u0645\u0628\u0631\u064a" },
    shrimp_sandwich_desc:  { en: "Crispy shrimp wrapped with fresh veggies and sauce. SAR 11 with cheese.", ar: "\u062c\u0645\u0628\u0631\u064a \u0645\u0642\u0631\u0645\u0634 \u0645\u0644\u0641\u0648\u0641 \u0645\u0639 \u062e\u0636\u0627\u0631 \u0637\u0627\u0632\u062c\u0629 \u0648\u0635\u0644\u0635\u0629. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 \u0628\u0640 11 \u0631\u064a\u0627\u0644." },
    shawarma_eyebrow: { en: "STACKED, SHAVED, ROLLED", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u0637\u0627\u0632\u062c\u0629 \u064a\u0648\u0645\u064a\u064b\u0627" },
    shawarma_title:   { en: "Shawarma", ar: "\u0634\u0627\u0648\u0631\u0645\u0627" },
    shawarma_small_title: { en: "Shawarma Sandwich (Small)", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0634\u0627\u0648\u0631\u0645\u0627 \u0635\u063a\u064a\u0631" },
    shawarma_small_desc:  { en: "Our classic shawarma roll, small size. SAR 6 with cheese, SAR 8 with hummus.", ar: "\u0644\u0641\u0629 \u0627\u0644\u0634\u0627\u0648\u0631\u0645\u0627 \u0627\u0644\u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0629\u060c \u062d\u062c\u0645 \u0635\u063a\u064a\u0631. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 6 \u0631\u064a\u0627\u0644\u060c \u0645\u0639 \u0627\u0644\u062d\u0645\u0635 8 \u0631\u064a\u0627\u0644." },
    shawarma_medium_title: { en: "Shawarma Sandwich (Medium)", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0634\u0627\u0648\u0631\u0645\u0627 \u0648\u0633\u0637" },
    shawarma_medium_desc:  { en: "Our classic shawarma roll, medium size. SAR 9 with cheese, SAR 10 with hummus.", ar: "\u0644\u0641\u0629 \u0627\u0644\u0634\u0627\u0648\u0631\u0645\u0627 \u0627\u0644\u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0629\u060c \u062d\u062c\u0645 \u0648\u0633\u0637. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 9 \u0631\u064a\u0627\u0644\u060c \u0645\u0639 \u0627\u0644\u062d\u0645\u0635 10 \u0631\u064a\u0627\u0644." },
    shawarma_saj_title: { en: "Shawarma Saj", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u0635\u0627\u062c" },
    shawarma_saj_desc:  { en: "Shawarma rolled in thin saj bread. SAR 11 with cheese, SAR 12 with hummus.", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u0645\u0644\u0641\u0648\u0641\u0629 \u0628\u062e\u0628\u0632 \u0627\u0644\u0635\u0627\u062c \u0627\u0644\u0631\u0642\u064a\u0642. \u0645\u0639 \u0627\u0644\u062c\u0628\u0646 11 \u0631\u064a\u0627\u0644\u060c \u0645\u0639 \u0627\u0644\u062d\u0645\u0635 12 \u0631\u064a\u0627\u0644." },
    shawarma_arabi_small_title: { en: "Shawarma Arabi (Small)", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u0639\u0631\u0628\u064a \u0635\u063a\u064a\u0631" },
    shawarma_arabi_small_desc:  { en: "Shawarma pieces with pickles and toppings, small platter. SAR 17 with hummus.", ar: "\u0642\u0637\u0639 \u0634\u0627\u0648\u0631\u0645\u0627 \u0645\u0639 \u0645\u062e\u0644\u0644 \u0648\u0625\u0636\u0627\u0641\u0627\u062a\u060c \u0637\u0628\u0642 \u0635\u063a\u064a\u0631. \u0645\u0639 \u0627\u0644\u062d\u0645\u0635 17 \u0631\u064a\u0627\u0644." },
    shawarma_arabi_title: { en: "Shawarma Arabi", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u0639\u0631\u0628\u064a" },
    shawarma_arabi_desc:  { en: "Full shawarma platter with pickles and toppings. SAR 22 with hummus.", ar: "\u0637\u0628\u0642 \u0634\u0627\u0648\u0631\u0645\u0627 \u0643\u0627\u0645\u0644 \u0645\u0639 \u0645\u062e\u0644\u0644 \u0648\u0625\u0636\u0627\u0641\u0627\u062a. \u0645\u0639 \u0627\u0644\u062d\u0645\u0635 22 \u0631\u064a\u0627\u0644." },
    shawarma_plate_title: { en: "Shawarma Plate", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u0635\u062d\u0646" },
    shawarma_plate_desc:  { en: "A generous plate of shawarma, perfect for sharing.", ar: "\u0637\u0628\u0642 \u0633\u062e\u064a \u0645\u0646 \u0627\u0644\u0634\u0627\u0648\u0631\u0645\u0627\u060c \u0645\u062b\u0627\u0644\u064a \u0644\u0644\u0645\u0634\u0627\u0631\u0643\u0629." },
    club_eyebrow: { en: "TRIPLE-STACKED CLASSICS", ar: "\u0643\u0644\u0627\u0633\u064a\u0643\u064a\u0627\u062a \u062b\u0644\u0627\u062b\u064a\u0629 \u0627\u0644\u0637\u0628\u0642\u0627\u062a" },
    club_title:   { en: "Club Sandwiches", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0643\u0644\u0648\u0628" },
    zinger_club_title: { en: "Zinger Club", ar: "\u0632\u0646\u062c\u0631 \u0643\u0644\u0648\u0628" },
    zinger_club_desc:  { en: "Triple-decker toasted club with crispy zinger chicken. Big size SAR 24.", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0643\u0644\u0648\u0628 \u062b\u0644\u0627\u062b\u064a \u0645\u062d\u0645\u0635 \u0645\u0639 \u062f\u062c\u0627\u062c \u0627\u0644\u0632\u0646\u062c\u0631 \u0627\u0644\u0645\u0642\u0631\u0645\u0634. \u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0643\u0628\u064a\u0631 24 \u0631\u064a\u0627\u0644." },
    chicken_club_title: { en: "Chicken Club", ar: "\u062f\u062c\u0627\u062c \u0643\u0644\u0648\u0628" },
    chicken_club_desc:  { en: "Triple-decker toasted club with grilled chicken. Big size SAR 25.", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0643\u0644\u0648\u0628 \u062b\u0644\u0627\u062b\u064a \u0645\u062d\u0645\u0635 \u0645\u0639 \u062f\u062c\u0627\u062c \u0645\u0634\u0648\u064a. \u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0643\u0628\u064a\u0631 25 \u0631\u064a\u0627\u0644." },
    chicken_shawarma_club_title: { en: "Chicken Shawarma Club", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u062f\u062c\u0627\u062c \u0643\u0644\u0648\u0628" },
    chicken_shawarma_club_desc:  { en: "Toasted club sandwich loaded with chicken shawarma. Big size SAR 18.", ar: "\u0633\u0627\u0646\u062f\u0648\u064a\u062a\u0634 \u0643\u0644\u0648\u0628 \u0645\u062d\u0645\u0635 \u0645\u062d\u0634\u0648 \u0628\u0634\u0627\u0648\u0631\u0645\u0627 \u0627\u0644\u062f\u062c\u0627\u062c. \u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0643\u0628\u064a\u0631 18 \u0631\u064a\u0627\u0644." },
    fries_eyebrow: { en: "SIDES DONE RIGHT", ar: "\u0623\u0637\u0628\u0627\u0642 \u062c\u0627\u0646\u0628\u064a\u0629 \u0645\u062a\u0642\u0646\u0629" },
    fries_title:   { en: "Fries & Sides", ar: "\u0628\u0637\u0627\u0637\u0627 \u0648\u0623\u0637\u0628\u0627\u0642 \u062c\u0627\u0646\u0628\u064a\u0629" },
    chicken_fries_title: { en: "Chicken Fries", ar: "\u062f\u062c\u0627\u062c \u0641\u0631\u0627\u064a\u0632" },
    chicken_fries_desc:  { en: "Crispy fries topped with chicken bites. Big size SAR 24.", ar: "\u0628\u0637\u0627\u0637\u0627 \u0645\u0642\u0631\u0645\u0634\u0629 \u0645\u063a\u0637\u0627\u0629 \u0628\u0642\u0637\u0639 \u0627\u0644\u062f\u062c\u0627\u062c. \u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0643\u0628\u064a\u0631 24 \u0631\u064a\u0627\u0644." },
    shawarma_fries_title: { en: "Shawarma Fries", ar: "\u0634\u0627\u0648\u0631\u0645\u0627 \u0641\u0631\u0627\u064a\u0632" },
    shawarma_fries_desc:  { en: "Crispy fries topped with shawarma. Big size SAR 25.", ar: "\u0628\u0637\u0627\u0637\u0627 \u0645\u0642\u0631\u0645\u0634\u0629 \u0645\u063a\u0637\u0627\u0629 \u0628\u0627\u0644\u0634\u0627\u0648\u0631\u0645\u0627. \u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0643\u0628\u064a\u0631 25 \u0631\u064a\u0627\u0644." },
    french_fries_title: { en: "French Fries", ar: "\u0628\u0637\u0627\u0637\u0627 \u0641\u0631\u0646\u0633\u064a\u0629" },
    french_fries_desc:  { en: "Golden crispy fries. Big size SAR 8.", ar: "\u0628\u0637\u0627\u0637\u0627 \u0645\u0642\u0631\u0645\u0634\u0629 \u0630\u0647\u0628\u064a\u0629. \u0627\u0644\u062d\u062c\u0645 \u0627\u0644\u0643\u0628\u064a\u0631 8 \u0631\u064a\u0627\u0644." },
    coleslaw_title: { en: "Coleslaw Salad", ar: "\u0633\u0644\u0637\u0629 \u0643\u0648\u0644 \u0633\u0644\u0648" },
    coleslaw_desc:  { en: "Fresh and creamy house coleslaw.", ar: "\u0633\u0644\u0637\u0629 \u0643\u0648\u0644 \u0633\u0644\u0648 \u0637\u0627\u0632\u062c\u0629 \u0648\u0643\u0631\u064a\u0645\u064a\u0629 \u0645\u0646 \u0625\u0639\u062f\u0627\u062f \u0627\u0644\u0645\u0637\u0639\u0645." },
    hummus_title: { en: "Hummus", ar: "\u062d\u0645\u0635" },
    hummus_desc:  { en: "Creamy house-made hummus.", ar: "\u062d\u0645\u0635 \u0643\u0631\u064a\u0645\u064a \u0645\u0646 \u0625\u0639\u062f\u0627\u062f \u0627\u0644\u0645\u0637\u0639\u0645." },
    sauce_title: { en: "Garlic / Hot / Green Chilli Sauce", ar: "\u0635\u0644\u0635\u0629 \u062b\u0648\u0645 / \u062d\u0627\u0631\u0629 / \u0641\u0644\u0641\u0644 \u0623\u062e\u0636\u0631" },
    sauce_desc:  { en: "Your choice of house-made dipping sauce.", ar: "\u0627\u062e\u062a\u0631 \u0635\u0644\u0635\u062a\u0643 \u0627\u0644\u0645\u0641\u0636\u0644\u0629 \u0645\u0646 \u0625\u0639\u062f\u0627\u062f \u0627\u0644\u0645\u0637\u0639\u0645." },
    kids_eyebrow: { en: "SIZED FOR LITTLE APPETITES", ar: "\u0628\u062d\u062c\u0645 \u064a\u0646\u0627\u0633\u0628 \u0627\u0644\u0623\u0637\u0641\u0627\u0644" },
    kids_title:   { en: "Kids Meal", ar: "\u0648\u062c\u0628\u0629 \u0623\u0637\u0641\u0627\u0644" },
    kids_meal_title: { en: "Kids Meal", ar: "\u0648\u062c\u0628\u0629 \u0623\u0637\u0641\u0627\u0644" },
    kids_meal_desc:  { en: "A kid-sized meal with a fun toy surprise inside.", ar: "\u0648\u062c\u0628\u0629 \u0628\u062d\u062c\u0645 \u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0623\u0637\u0641\u0627\u0644 \u0645\u0639 \u0644\u0639\u0628\u0629 \u0645\u0641\u0627\u062c\u0626\u0629 \u0628\u0627\u0644\u062f\u0627\u062e\u0644." },

    reviews_eyebrow: { en: 'FROM OUR REGULARS', ar: 'من عملائنا الدائمين' },
    reviews_h2:      { en: 'What People Are <span class="fire-text">Saying</span>', ar: 'ماذا يقول <span class="fire-text">عملاؤنا</span>' },
    review1_role:    { en: 'Local Foodie', ar: 'من محبي الأكل المحليين' },
    review1_text:    { en: 'Best broasted chicken in Jeddah, hands down. The crunch on this stays crisp even after delivery.', ar: 'أفضل دجاج بروست في جدة بلا منازع. يبقى مقرمشًا حتى بعد التوصيل.' },
    review2_role:    { en: 'Regular Customer', ar: 'عميل دائم' },
    review2_text:    { en: 'The spicy wings actually deliver on spicy. Family bucket is our Thursday night tradition now.', ar: 'الأجنحة الحارة فعلاً حارة كما تدّعي. الوجبة العائلية أصبحت تقليدنا كل خميس.' },
    review3_role:    { en: 'Food Blogger', ar: 'مدوّنة طعام' },
    review3_text:    { en: 'Garlic cheese dip is criminally underrated. Fast service, hot food, zero complaints.', ar: 'غموس الثوم بالجبن لا يُقدَّر بثمن. خدمة سريعة، طعام ساخن، ولا شكاوى إطلاقًا.' },
    rv_name1: { en: 'Sara A.', ar: 'سارة أ.' },
    rv_name2: { en: 'Omar M.', ar: 'عمر م.' },
    rv_name3: { en: 'Layla H.', ar: 'ليلى ح.' },
    rv_name4: { en: 'Abdullah R.', ar: 'عبدالله ر.' },
    review4_text: { en: 'Very delicious! Best broasted chicken in Jeddah', ar: 'لذيذ جدًا! أفضل بروست في جدة' },
    review4_role:    { en: 'Regular Customer', ar: 'عميل دائم' },

    contact_eyebrow: { en: 'QUESTIONS, CATERING, FEEDBACK', ar: 'استفسارات، تجهيزات الطعام، ملاحظات' },
    contact_h2:      { en: "Let's <span class=\"fire-text\">Connect</span>", ar: 'لنبقى <span class="fire-text">على تواصل</span>' },
    label_name:      { en: 'NAME', ar: 'الاسم' },
    label_email:     { en: 'EMAIL', ar: 'البريد الإلكتروني' },
    label_message:   { en: 'MESSAGE', ar: 'الرسالة' },
    ph_name:         { en: 'Your name', ar: 'اسمك' },
    ph_message:      { en: "Tell us what's on your mind", ar: 'أخبرنا بما يدور في ذهنك' },
    btn_send:        { en: 'Send Message', ar: 'إرسال الرسالة' },

    footer_copyright:{ en: '&copy; 2026 Tazbe Chicken. All rights reserved.', ar: '&copy; 2026 تازبى تشيكن. جميع الحقوق محفوظة.' }
,
    cat_0:{ en: 'Broast & Fillets', ar: 'بروست وقطع سمك' },
    m_0_0:{ en: 'Chicken Broast', ar: 'بروست دجاج' },
    m_0_1:{ en: 'Shrimp Broast', ar: 'بروست جمبري' },
    m_0_2:{ en: 'Fish Broast', ar: 'بروست سمك' },
    m_0_3:{ en: 'Chicken Fillet', ar: 'فيلية دجاج' },
    m_0_4:{ en: 'Fish Fillet', ar: 'فيلية سمك' },
    cat_1:{ en: 'Burgers & Meals', ar: 'برجر ووجبات' },
    m_1_0:{ en: 'Zinger Burger', ar: 'برجر زنجر' },
    m_1_1:{ en: 'Keto Burger', ar: 'برجر كيتو' },
    m_1_2:{ en: 'Tazbe Zinger', ar: 'زنجر تازبي' },
    m_1_3:{ en: 'Zinger Club', ar: 'كلوب زنجر' },
    m_1_4:{ en: 'Emirates Club', ar: 'كلوب الإمارات' },
    m_1_5:{ en: 'Zinger Grill', ar: 'شواية زنجر' },
    m_1_6:{ en: 'Dynamic Chicken', ar: 'دجاج دايناميك' },
    m_1_7:{ en: 'Dynamic Chicken', ar: 'دجاج دايناميك' },
    m_1_8:{ en: 'Wedges Chicken', ar: 'دجاج ويجز' },
    m_1_9:{ en: 'Chicken Fries', ar: 'بطاطس دجاج' },
    m_1_10:{ en: 'Kids Meal', ar: 'وجبة أطفال' },
    m_1_11:{ en: 'Tazbe Crunch', ar: 'تازبي كرانش' },
    cat_2:{ en: 'Sandwiches & Wraps', ar: 'ساندويتشات ولفائف' },
    m_2_0:{ en: 'Zinger Sandwich', ar: 'ساندويتش زنجر' },
    m_2_1:{ en: 'Shrimp Sandwich', ar: 'ساندويتش جمبري' },
    m_2_2:{ en: 'Nuggets Sandwich', ar: 'ساندويتش ناجتس' },
    m_2_3:{ en: 'Fish Sandwich', ar: 'ساندويتش سمك' },
    m_2_4:{ en: 'Zinger Arabi', ar: 'زنجر عربي' },
    m_2_5:{ en: 'Twister', ar: 'تويستر' },
    m_2_6:{ en: 'Tuna Club', ar: 'كلوب تونة' },
    cat_3:{ en: 'Sides', ar: 'أطباق جانبية' },
    m_3_0:{ en: 'Wedges', ar: 'ويجز' },
    m_3_1:{ en: 'Onion Rings', ar: 'حلقات بصل' },
    m_3_2:{ en: 'Fries (Small/Medium/Large)', ar: 'بطاطس (صغير/وسط/كبير)' },
    cat_0_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_0_0_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_0_1_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_0_2_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_0_3_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_0_4_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    cat_1_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_0_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_1_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_2_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_3_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_4_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_5_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_6_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_7_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_8_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_9_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_10_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_1_11_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    cat_2_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_2_0_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_2_1_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_2_2_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_2_3_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_2_4_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_2_5_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_2_6_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    cat_3_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_3_0_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_3_1_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    m_3_2_d:{ en: 'Fresh from the pressure fryer — golden, crispy, juicy.', ar: 'طازج من القلاية الضاغطة — ذهبي ومقرمش وعصيري.' },
    menu_eyebrow2:{ en: 'STRAIGHT FROM THE PRESSURE FRYER', ar: 'طازج مباشرة من القلاية الضاغطة' },
    menu_sub2:{ en: 'Best broast in Jeddah, open 24 hours. Fresh, hot, and always crispy.', ar: 'أفضل بروست في جدة، مفتوح ٢٤ ساعة. طازج وساخن ومقرمش دائمًا.' }  };

  function applyLanguage(lang){
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[key]) el.innerHTML = TRANSLATIONS[key][lang];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (TRANSLATIONS[key]) el.setAttribute('placeholder', TRANSLATIONS[key][lang]);
    });
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
    });

    localStorage.setItem('bk_lang', lang);
  }

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang-btn')));
  });

  // Restore saved language on load (defaults to English)
  applyLanguage(localStorage.getItem('bk_lang') === 'ar' ? 'ar' : 'en');
