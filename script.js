const products = [
  {
    id: "rice-bag",
    title: "Premium Rice",
    category: "grains",
    description: "5kg long-grain rice, soft texture and rich taste.",
    price: 12.99,
    image: createGroceryImage("Premium Rice", "Grains", "#f6edd5", "#d7be89")
  },
  {
    id: "tomatoes",
    title: "Fresh Tomatoes",
    category: "vegetables",
    description: "Juicy red tomatoes picked from local farms.",
    price: 2.49,
    image: createGroceryImage("Fresh Tomatoes", "Vegetables", "#fde3df", "#ee8f85")
  },
  {
    id: "milk-pack",
    title: "Farm Milk",
    category: "dairy",
    description: "1L full-cream milk, chilled and delivered fresh.",
    price: 1.99,
    image: createGroceryImage("Farm Milk", "Dairy", "#e5efff", "#9ab8ef")
  },
  {
    id: "fruit-basket",
    title: "Fruit Basket",
    category: "fruits",
    description: "Seasonal fruits for healthy snacking at home.",
    price: 8.75,
    image: createGroceryImage("Fruit Basket", "Fruits", "#fff1d8", "#f0bf6f")
  },
  {
    id: "wheat-flour",
    title: "Whole Wheat Flour",
    category: "grains",
    description: "Stone-ground atta, perfect for soft chapatis.",
    price: 3.25,
    image: createGroceryImage("Whole Wheat Flour", "Grains", "#f8ecd6", "#debd85")
  },
  {
    id: "brown-rice",
    title: "Brown Rice",
    category: "grains",
    description: "Nutritious fiber-rich rice for healthy meals.",
    price: 4.6,
    image: createGroceryImage("Brown Rice", "Grains", "#efe5d7", "#c6a77c")
  },
  {
    id: "potatoes",
    title: "Fresh Potatoes",
    category: "vegetables",
    description: "Farm-fresh potatoes ideal for curries and fries.",
    price: 1.85,
    image: createGroceryImage("Fresh Potatoes", "Vegetables", "#f6e9ce", "#d7b57f")
  },
  {
    id: "onions",
    title: "Red Onions",
    category: "vegetables",
    description: "Crisp and pungent onions for everyday cooking.",
    price: 1.7,
    image: createGroceryImage("Red Onions", "Vegetables", "#f4e2ee", "#ce90ba")
  },
  {
    id: "carrots",
    title: "Crunchy Carrots",
    category: "vegetables",
    description: "Sweet carrots packed with vitamins and flavor.",
    price: 2.1,
    image: createGroceryImage("Crunchy Carrots", "Vegetables", "#ffe8d8", "#f39b62")
  },
  {
    id: "curd",
    title: "Natural Curd",
    category: "dairy",
    description: "Thick homemade-style curd for every meal.",
    price: 1.5,
    image: createGroceryImage("Natural Curd", "Dairy", "#edf4ff", "#a4bde9")
  },
  {
    id: "paneer",
    title: "Fresh Paneer",
    category: "dairy",
    description: "Soft cottage cheese cubes for rich dishes.",
    price: 3.95,
    image: createGroceryImage("Fresh Paneer", "Dairy", "#fef8e5", "#efd08c")
  },
  {
    id: "butter",
    title: "Creamy Butter",
    category: "dairy",
    description: "Salted table butter for toast and cooking.",
    price: 2.8,
    image: createGroceryImage("Creamy Butter", "Dairy", "#fff7dc", "#f1cf72")
  },
  {
    id: "bananas",
    title: "Bananas",
    category: "fruits",
    description: "Naturally sweet bananas, great for quick energy.",
    price: 1.2,
    image: createGroceryImage("Bananas", "Fruits", "#fff4cf", "#edd06e")
  },
  {
    id: "apples",
    title: "Red Apples",
    category: "fruits",
    description: "Juicy apples selected for freshness and crunch.",
    price: 3.4,
    image: createGroceryImage("Red Apples", "Fruits", "#ffe3de", "#e78d80")
  }
];

const cart = new Map();
const productImageIndexes = new Map();
let catalogSearchTerm = "";
let catalogFilterValue = "all";
const CATALOG_ITEMS_PER_PAGE = 8;
let catalogCurrentPage = 1;
const ADMIN_CATALOG_ITEMS_PER_PAGE = 8;
const USER_TABLE_ITEMS_PER_PAGE = 6;
const shownQtyControls = new Set();
let isLoggedIn = false;

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function imageFallback(title = "Product") {
  const safeTitle = encodeURIComponent(title);
  return `https://placehold.co/800x600/e8f4ef/165d46?text=${safeTitle}`;
}

function createGroceryImage(title, subtitle, colorStart, colorEnd) {
  void colorStart;
  void colorEnd;
  void subtitle;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `assets/products/photos/${slug}.jpg`;
}

function createGalleryFallbackImage(title, variant) {
  const safeTitle = encodeURIComponent(`${title} ${variant}`);
  return `https://placehold.co/800x600/f0f5ef/1f2e1f?text=${safeTitle}`;
}

function getProductImages(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  const base = product.image || imageFallback(product.title || "Product");
  return [
    base,
    createGalleryFallbackImage(product.title || "Product", "View 2"),
    createGalleryFallbackImage(product.title || "Product", "View 3")
  ];
}

function setupProfileDropdown() {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  if (!profileBtn || !profileDropdown) return;

  profileBtn.addEventListener("click", () => {
    const isOpen = profileDropdown.classList.toggle("show");
    profileBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const menu = document.getElementById("profileMenu");
    if (!menu.contains(event.target)) {
      profileDropdown.classList.remove("show");
      profileBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function closeProfileDropdown() {
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  if (!profileBtn || !profileDropdown) return;
  profileDropdown.classList.remove("show");
  profileBtn.setAttribute("aria-expanded", "false");
}

function setLoggedInState(value) {
  isLoggedIn = value;
  applyAuthStateToNav();
}

function applyAuthStateToNav() {
  const dashboardLink = document.getElementById("dashboardLink");
  const ordersLink = document.getElementById("ordersLink");
  const signinLink = document.getElementById("signinLink");
  const logoutLink = document.getElementById("logoutLink");

  if (dashboardLink) dashboardLink.hidden = !isLoggedIn;
  if (ordersLink) ordersLink.hidden = !isLoggedIn;
  if (signinLink) signinLink.hidden = isLoggedIn;
  if (logoutLink) logoutLink.hidden = !isLoggedIn;
}

function setupAuthUi() {
  isLoggedIn = false;
  applyAuthStateToNav();

  const signinLink = document.getElementById("signinLink");
  const logoutLink = document.getElementById("logoutLink");
  const signinModal = document.getElementById("signinModal");
  const closeSigninModal = document.getElementById("closeSigninModal");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  if (!signinLink || !logoutLink || !signinModal || !closeSigninModal || !googleLoginBtn) return;

  signinModal.hidden = true;

  const openModal = () => {
    signinModal.hidden = false;
  };

  const closeModal = () => {
    signinModal.hidden = true;
  };

  signinLink.addEventListener("click", (event) => {
    event.preventDefault();
    closeProfileDropdown();
    openModal();
  });

  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    setLoggedInState(false);
    closeProfileDropdown();
  });

  closeSigninModal.addEventListener("click", closeModal);

  signinModal.addEventListener("click", (event) => {
    if (event.target === signinModal) closeModal();
  });

  const signinModalCard = signinModal.querySelector(".signin-modal");
  if (signinModalCard) {
    signinModalCard.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !signinModal.hidden) closeModal();
  });

  googleLoginBtn.addEventListener("click", () => {
    setLoggedInState(true);
    closeModal();
  });
}

function getFilteredProducts() {
  const query = catalogSearchTerm.trim().toLowerCase();
  return products.filter((product) => {
    const matchesSearch = !query || product.title.toLowerCase().includes(query);
    const matchesFilter = catalogFilterValue === "all" || product.category === catalogFilterValue;
    return matchesSearch && matchesFilter;
  });
}

function renderProducts() {
  const productGrid = document.getElementById("productGrid");
  const catalogPagination = document.getElementById("catalogPagination");
  if (!productGrid) return;

  const visibleProducts = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / CATALOG_ITEMS_PER_PAGE));
  catalogCurrentPage = Math.min(catalogCurrentPage, totalPages);

  const pageStart = (catalogCurrentPage - 1) * CATALOG_ITEMS_PER_PAGE;
  const pageItems = visibleProducts.slice(pageStart, pageStart + CATALOG_ITEMS_PER_PAGE);

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = '<p class="cart-empty">No products found for your search.</p>';
    if (catalogPagination) catalogPagination.innerHTML = "";
    return;
  }

  productGrid.innerHTML = pageItems.map((product) => {
    const qty = cart.get(product.id)?.quantity ?? 0;
    const isShown = shownQtyControls.has(product.id);
    const discountedPrice = Number(product.price);
    const inferredMrp = Number((discountedPrice * 1.2).toFixed(2));
    const mrp = Number(product.mrp ?? inferredMrp);
    const safeMrp = mrp > discountedPrice ? mrp : Number((discountedPrice + 0.01).toFixed(2));
    const images = getProductImages(product);
    const totalImages = images.length;
    const currentImageIndex = productImageIndexes.get(product.id) ?? 0;
    const safeIndex = ((currentImageIndex % totalImages) + totalImages) % totalImages;
    const activeImage = images[safeIndex];
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${activeImage}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
        </div>
        ${totalImages > 1 ? `
          <div class="img-nav-row">
            <button class="img-nav-btn" data-image-nav="prev" data-id="${product.id}" type="button" aria-label="Previous image for ${product.title}">
              <svg class="img-nav-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <span class="img-counter">${safeIndex + 1}/${totalImages}</span>
            <button class="img-nav-btn" data-image-nav="next" data-id="${product.id}" type="button" aria-label="Next image for ${product.title}">
              <svg class="img-nav-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        ` : ""}
        <div class="product-content">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <div class="price-row">
            <span class="price-mrp">MRP <s>${formatCurrency(safeMrp)}</s></span>
            <span class="price">${formatCurrency(discountedPrice)}</span>
          </div>
          <div class="card-actions">
            <div class="qty-controls" id="qty-controls-${product.id}" ${isShown ? "" : "hidden"}>
              <button class="qty-step-btn" data-step="down" data-id="${product.id}" type="button" aria-label="Decrease quantity">-</button>
              <input
                class="qty-input"
                type="number"
                min="1"
                value="${Math.max(1, qty)}"
                id="input-${product.id}"
                aria-label="Enter quantity for ${product.title}"
                readonly
              />
              <button class="qty-step-btn" data-step="up" data-id="${product.id}" type="button" aria-label="Increase quantity">+</button>
            </div>
            <button class="add-btn" data-add="${product.id}" type="button" ${isShown ? "hidden" : ""}>Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  productGrid.onclick = (event) => {
    const addId = event.target.dataset.add;
    const step = event.target.dataset.step;
    const stepId = event.target.dataset.id;
    const imageNav = event.target.dataset.imageNav;
    const imageNavId = event.target.dataset.id;

    if (imageNav && imageNavId) {
      const product = products.find((item) => item.id === imageNavId);
      if (!product) return;
      const images = getProductImages(product);
      const totalImages = images.length;
      if (totalImages <= 1) return;

      const current = productImageIndexes.get(imageNavId) ?? 0;
      const next = imageNav === "next" ? current + 1 : current - 1;
      productImageIndexes.set(imageNavId, ((next % totalImages) + totalImages) % totalImages);
      renderProducts();
      return;
    }

    if (step && stepId) {
      const existing = cart.get(stepId);
      const currentQty = existing?.quantity ?? 0;
      const nextQty = step === "up" ? currentQty + 1 : Math.max(0, currentQty - 1);

      if (nextQty === 0) {
        cart.delete(stepId);
        shownQtyControls.delete(stepId);
      } else if (existing) {
        existing.quantity = nextQty;
      } else {
        const product = products.find((item) => item.id === stepId);
        if (!product) return;
        cart.set(stepId, { ...product, quantity: nextQty });
      }

      persistCart();
      renderCart();
      renderProducts();
      return;
    }

    if (addId) {
      shownQtyControls.add(addId);
      addToCart(addId, 1);
      renderProducts();
    }
  };

  if (!catalogPagination) return;

  if (totalPages <= 1) {
    catalogPagination.innerHTML = "";
    return;
  }

  catalogPagination.innerHTML = `
    <button class="page-btn" type="button" id="pagePrev" ${catalogCurrentPage === 1 ? "disabled" : ""}>Prev</button>
    <span class="page-indicator">Page ${catalogCurrentPage} / ${totalPages}</span>
    <button class="page-btn" type="button" id="pageNext" ${catalogCurrentPage === totalPages ? "disabled" : ""}>Next</button>
  `;

  const prevBtn = document.getElementById("pagePrev");
  const nextBtn = document.getElementById("pageNext");

  if (prevBtn) {
    prevBtn.onclick = () => {
      catalogCurrentPage = Math.max(1, catalogCurrentPage - 1);
      renderProducts();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      catalogCurrentPage = Math.min(totalPages, catalogCurrentPage + 1);
      renderProducts();
    };
  }
}

function setupCatalogSearch() {
  const searchInput = document.getElementById("catalogSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    catalogSearchTerm = event.target.value;
    catalogCurrentPage = 1;
    renderProducts();
  });
}

function setupCatalogFilter() {
  const filterInput = document.getElementById("catalogFilter");
  if (!filterInput) return;

  filterInput.addEventListener("change", (event) => {
    catalogFilterValue = event.target.value;
    catalogCurrentPage = 1;
    renderProducts();
  });
}

function addToCart(id, quantity = 1) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const existing = cart.get(id);
  if (!existing) {
    cart.set(id, { ...product, quantity });
  } else {
    existing.quantity += quantity;
  }

  updateQtyBadge(id);
  renderCart();
  persistCart();
}

function updateQtyBadge(id) {
  void id;
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");
  const floatingBar = document.getElementById("floatingCartBar");
  const floatingItemCount = document.getElementById("floatingItemCount");
  const floatingCartTotal = document.getElementById("floatingCartTotal");

  const cartItems = Array.from(cart.values());
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });

  if (floatingBar && floatingItemCount && floatingCartTotal) {
    floatingItemCount.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
    floatingCartTotal.textContent = formatCurrency(total);
    floatingBar.classList.toggle("show", totalItems > 0);
  }

  if (!cartList || !cartTotal) return;

  if (cartItems.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Your cart is empty. Start adding groceries.</p>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  cartList.innerHTML = cartItems.map((item) => {
    const latestProduct = products.find((product) => product.id === item.id);
    const imageSrc = latestProduct?.image ?? item.image;
    const itemTotal = item.price * item.quantity;

    return `
      <div class="cart-item">
        <div class="cart-item-layout">
          <img class="cart-item-image" src="${imageSrc}" alt="${item.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
          <div class="cart-item-main">
            <div class="cart-item-row">
              <strong>${item.title}</strong>
              <strong>${formatCurrency(itemTotal)}</strong>
            </div>
            <div class="cart-meta">${formatCurrency(item.price)} each · Qty: ${item.quantity}</div>
          </div>
          <div class="cart-actions">
            <button class="cart-step-btn" data-cart-step="up" data-id="${item.id}" type="button" aria-label="Increase ${item.title}">+</button>
            <button class="cart-step-btn" data-cart-step="down" data-id="${item.id}" type="button" aria-label="Decrease ${item.title}">-</button>
            <button class="cart-delete-btn" data-cart-delete="${item.id}" type="button" aria-label="Remove ${item.title}">🗑</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = formatCurrency(total);

  cartList.onclick = (event) => {
    const cartStep = event.target.dataset.cartStep;
    const cartStepId = event.target.dataset.id;
    const cartDeleteId = event.target.dataset.cartDelete;

    if (cartStep && cartStepId) {
      const existing = cart.get(cartStepId);
      if (!existing) return;

      if (cartStep === "up") {
        existing.quantity += 1;
      } else {
        existing.quantity = Math.max(1, existing.quantity - 1);
      }

      updateQtyBadge(cartStepId);
      renderCart();
      persistCart();
      return;
    }

    if (cartDeleteId) {
      cart.delete(cartDeleteId);
      updateQtyBadge(cartDeleteId);
      renderCart();
      persistCart();
    }
  };
}

function persistCart() {
  localStorage.setItem("thriftyHomesCart", JSON.stringify(Array.from(cart.values())));
}

function restoreCart() {
  const saved = localStorage.getItem("thriftyHomesCart");
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    parsed.forEach((item) => {
      const latestProduct = products.find((product) => product.id === item.id);
      if (!latestProduct) {
        cart.set(item.id, item);
        return;
      }

      cart.set(item.id, {
        ...item,
        title: latestProduct.title,
        price: latestProduct.price,
        category: latestProduct.category,
        description: latestProduct.description,
        image: latestProduct.image
      });
    });
  } catch (error) {
    localStorage.removeItem("thriftyHomesCart");
  }
}

function setupCheckoutButton() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  const floatingCheckoutBtn = document.getElementById("floatingCheckoutBtn");

  const goToCheckout = () => {
    persistCart();
    window.location.href = "checkout.html";
  };

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", goToCheckout);
  }

  if (floatingCheckoutBtn) {
    floatingCheckoutBtn.addEventListener("click", goToCheckout);
  }
}

function setupSlideshow() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("slideDots");
  if (slides.length === 0 || !dotsWrap) return;

  let currentIndex = 0;

  dotsWrap.innerHTML = slides
    .map((_, index) => `<button class="dot ${index === 0 ? "active" : ""}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`)
    .join("");

  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  dotsWrap.addEventListener("click", (event) => {
    const dot = event.target.closest(".dot");
    if (!dot) return;

    showSlide(Number(dot.dataset.index));
  });

  setInterval(() => {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }, 3000);
}

function openMockRazorpay(amountPaise, name, onSuccess, onDismiss) {
  const modal = document.getElementById("rzpModal");
  if (!modal) return;

  const fmt = (p) => "₹" + (p / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  document.getElementById("rzpAmountDisplay").textContent = fmt(amountPaise);
  document.getElementById("rzpPayAmount").textContent = fmt(amountPaise);

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    onDismiss();
  };

  document.getElementById("rzpClose").onclick = close;
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); }, { once: true });

  // Tab switching
  modal.querySelectorAll(".rzp-tab").forEach((tab) => {
    tab.onclick = () => {
      modal.querySelectorAll(".rzp-tab").forEach((t) => t.classList.remove("active"));
      modal.querySelectorAll(".rzp-panel").forEach((p) => (p.hidden = true));
      tab.classList.add("active");
      document.getElementById("rzp-panel-" + tab.dataset.tab).hidden = false;
    };
  });

  // Card number auto-format
  const cardNumInput = document.getElementById("rzpCardNum");
  if (cardNumInput) {
    cardNumInput.oninput = (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 16);
      e.target.value = v.replace(/(.{4})/g, "$1  ").trim();
    };
  }

  document.getElementById("rzpPayBtn").onclick = () => {
    const payBtn = document.getElementById("rzpPayBtn");
    payBtn.textContent = "Processing…";
    payBtn.disabled = true;
    setTimeout(() => {
      modal.hidden = true;
      document.body.style.overflow = "";
      onSuccess();
    }, 1500);
  };
}

function renderCheckoutPage() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const orderNote = document.getElementById("orderNote");

  if (!checkoutItems || !checkoutTotal || !checkoutForm) return;

  const saved = localStorage.getItem("thriftyHomesCart");
  let items = saved ? JSON.parse(saved) : [];

  const syncCheckoutImages = () => {
    items = items.map((item) => {
      const latestProduct = products.find((product) => product.id === item.id);
      if (!latestProduct) return item;
      return {
        ...item,
        image: latestProduct.image,
        title: latestProduct.title,
        price: latestProduct.price
      };
    });
  };

  const persistCheckoutItems = () => {
    localStorage.setItem("thriftyHomesCart", JSON.stringify(items));
  };

  const drawCheckoutItems = () => {
    syncCheckoutImages();

    if (items.length === 0) {
      checkoutItems.innerHTML = '<p class="cart-empty">No items in cart yet.</p>';
      checkoutTotal.textContent = formatCurrency(0);
      return;
    }

    let total = 0;
    checkoutItems.innerHTML = items.map((item) => {
      const lineTotal = item.quantity * item.price;
      total += lineTotal;

      return `
        <div class="checkout-item">
          <div class="checkout-item-layout">
            <img class="checkout-item-image" src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
            <div class="checkout-item-main">
              <strong>${item.title}</strong>
              <div class="cart-meta">${formatCurrency(item.price)} each</div>
              <div><strong>${formatCurrency(lineTotal)}</strong></div>
            </div>
            <div class="checkout-item-controls">
              <button class="checkout-step-btn" data-checkout-step="down" data-id="${item.id}" type="button" aria-label="Decrease ${item.title}">-</button>
              <span class="checkout-qty">${item.quantity}</span>
              <button class="checkout-step-btn" data-checkout-step="up" data-id="${item.id}" type="button" aria-label="Increase ${item.title}">+</button>
              <button class="checkout-delete-btn" data-checkout-delete="${item.id}" type="button" aria-label="Remove ${item.title}">🗑</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    checkoutTotal.textContent = formatCurrency(total);
  };

  drawCheckoutItems();

  checkoutItems.onclick = (event) => {
    const step = event.target.dataset.checkoutStep;
    const stepId = event.target.dataset.id;
    const deleteId = event.target.dataset.checkoutDelete;

    if (step && stepId) {
      items = items.map((item) => {
        if (item.id !== stepId) return item;
        const nextQty = step === "up" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: nextQty };
      });

      persistCheckoutItems();
      drawCheckoutItems();
      return;
    }

    if (deleteId) {
      items = items.filter((item) => item.id !== deleteId);
      persistCheckoutItems();
      drawCheckoutItems();
    }
  };

  const getCartTotal = () =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const finaliseOrder = (name, payment) => {
    localStorage.removeItem("thriftyHomesCart");
    window.location.href = "orders.html";
  };

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(checkoutForm);
    const name = formData.get("fullName");
    const phone = formData.get("phone");
    const payment = formData.get("payment");
    const totalPaise = Math.max(100, Math.round(getCartTotal() * 100));

    openMockRazorpay(totalPaise, name, () => finaliseOrder(name, payment), () => {
      if (orderNote) orderNote.textContent = "Payment cancelled. Your cart is still saved.";
    });
  });
}

const mockOrders = [
  {
    id: "ORD-20240521",
    date: "21 May 2024",
    status: "Delivered",
    payment: "UPI",
    items: [
      { title: "Premium Rice", quantity: 2, price: 12.99, image: createGroceryImage("Premium Rice", "Grains", "#f6edd5", "#d7be89") },
      { title: "Farm Milk", quantity: 3, price: 1.99, image: createGroceryImage("Farm Milk", "Dairy", "#e5efff", "#9ab8ef") }
    ]
  },
  {
    id: "ORD-20240614",
    date: "14 Jun 2024",
    status: "Delivered",
    payment: "Cash on Delivery",
    items: [
      { title: "Fresh Tomatoes", quantity: 1, price: 2.49, image: createGroceryImage("Fresh Tomatoes", "Vegetables", "#fde3df", "#ee8f85") },
      { title: "Red Onions", quantity: 2, price: 1.70, image: createGroceryImage("Red Onions", "Vegetables", "#f4e2ee", "#ce90ba") },
      { title: "Crunchy Carrots", quantity: 1, price: 2.10, image: createGroceryImage("Crunchy Carrots", "Vegetables", "#ffe8d8", "#f39b62") }
    ]
  },
  {
    id: "ORD-20240802",
    date: "2 Aug 2024",
    status: "Delivered",
    payment: "Credit/Debit Card",
    items: [
      { title: "Fruit Basket", quantity: 1, price: 8.75, image: createGroceryImage("Fruit Basket", "Fruits", "#fff1d8", "#f0bf6f") },
      { title: "Bananas", quantity: 3, price: 1.20, image: createGroceryImage("Bananas", "Fruits", "#fff4cf", "#edd06e") },
      { title: "Red Apples", quantity: 2, price: 3.40, image: createGroceryImage("Red Apples", "Fruits", "#ffe3de", "#e78d80") }
    ]
  },
  {
    id: "ORD-20241015",
    date: "15 Oct 2024",
    status: "Delivered",
    payment: "UPI",
    items: [
      { title: "Fresh Paneer", quantity: 2, price: 3.95, image: createGroceryImage("Fresh Paneer", "Dairy", "#fef8e5", "#efd08c") },
      { title: "Creamy Butter", quantity: 1, price: 2.80, image: createGroceryImage("Creamy Butter", "Dairy", "#fff7dc", "#f1cf72") },
      { title: "Natural Curd", quantity: 2, price: 1.50, image: createGroceryImage("Natural Curd", "Dairy", "#edf4ff", "#a4bde9") }
    ]
  },
  {
    id: "ORD-20250112",
    date: "12 Jan 2025",
    status: "Delivered",
    payment: "Cash on Delivery",
    items: [
      { title: "Whole Wheat Flour", quantity: 2, price: 3.25, image: createGroceryImage("Whole Wheat Flour", "Grains", "#f8ecd6", "#debd85") },
      { title: "Brown Rice", quantity: 1, price: 4.60, image: createGroceryImage("Brown Rice", "Grains", "#efe5d7", "#c6a77c") }
    ]
  }
];

function renderOrdersPage() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  const statusColor = { "Delivered": "#165d46", "Pending": "#b45309", "Cancelled": "#8a3d21" };

  ordersList.innerHTML = mockOrders.slice().reverse().map((order) => {
    const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsHtml = order.items.map((item) => `
      <div class="order-line-item">
        <img class="order-item-image" src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="order-item-meta">
          <span class="order-item-title">${item.title}</span>
          <span class="order-item-qty">Qty: ${item.quantity} × ${formatCurrency(item.price)}</span>
        </div>
        <strong class="order-item-total">${formatCurrency(item.price * item.quantity)}</strong>
      </div>
    `).join("");

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div class="order-card-meta">
            <span class="order-id">${order.id}</span>
            <span class="order-date">${order.date}</span>
          </div>
          <div class="order-card-right">
            <span class="order-payment">${order.payment}</span>
            <span class="order-status" style="color:${statusColor[order.status] ?? "#555"}">${order.status}</span>
          </div>
        </div>
        <div class="order-items">${itemsHtml}</div>
        <div class="order-total-row">
          <span>Order Total</span>
          <strong>${formatCurrency(orderTotal)}</strong>
        </div>
      </div>
    `;
  }).join("");
}

function renderDashboardPage() {
  const dashboardPage = document.getElementById("dashboardPage");
  if (!dashboardPage) return;

  const roleTabs = Array.from(document.querySelectorAll(".dashboard-tab"));
  const sidebarTitle = document.getElementById("dashboardSidebarTitle");
  const sidebarRefChip = document.getElementById("dashboardSidebarRefChip");
  const sidebarMenu = document.getElementById("dashboardSidebarMenu");
  const contentTitle = document.getElementById("dashboardContentTitle");
  const contentCopy = document.getElementById("dashboardContentCopy");
  const contentBody = document.getElementById("dashboardContentBody");
  const primaryActionBtn = document.getElementById("dashboardPrimaryAction");
  const productEditorModal = document.getElementById("productEditorModal");
  const closeProductEditor = document.getElementById("closeProductEditor");
  const cancelProductEditor = document.getElementById("cancelProductEditor");
  const productEditorTitle = document.getElementById("productEditorTitle");
  const productEditorSubmitBtn = document.getElementById("productEditorSubmitBtn");
  const productEditorForm = document.getElementById("productEditorForm");
  const mockUploadBtn = document.getElementById("mockUploadBtn");
  const mockUploadFileName = document.getElementById("mockUploadFileName");
  const userEditorModal = document.getElementById("userEditorModal");
  const closeUserEditor = document.getElementById("closeUserEditor");
  const cancelUserEditor = document.getElementById("cancelUserEditor");
  const userEditorForm = document.getElementById("userEditorForm");
  const userRoleEditorModal = document.getElementById("userRoleEditorModal");
  const closeUserRoleEditor = document.getElementById("closeUserRoleEditor");
  const cancelUserRoleEditor = document.getElementById("cancelUserRoleEditor");
  const userRoleEditorForm = document.getElementById("userRoleEditorForm");
  const stockistDealerModal = document.getElementById("stockistDealerModal");
  const closeStockistDealerModal = document.getElementById("closeStockistDealerModal");
  const cancelStockistDealerModal = document.getElementById("cancelStockistDealerModal");
  const stockistDealerForm = document.getElementById("stockistDealerForm");
  const dealerInviteModal = document.getElementById("dealerInviteModal");
  const closeDealerInviteModal = document.getElementById("closeDealerInviteModal");
  const cancelDealerInviteModal = document.getElementById("cancelDealerInviteModal");
  const dealerInviteForm = document.getElementById("dealerInviteForm");
  const dispatchCompleteModal = document.getElementById("dispatchCompleteModal");
  const closeDispatchCompleteModal = document.getElementById("closeDispatchCompleteModal");
  const cancelDispatchCompleteModal = document.getElementById("cancelDispatchCompleteModal");
  const dispatchCompleteForm = document.getElementById("dispatchCompleteForm");
  const dispatchStatusSelect = document.getElementById("dispatchStatus");
  const dispatchDateTimeRow = document.getElementById("dispatchDateTimeRow");
  const deleteConfirmModal = document.getElementById("deleteConfirmModal");
  const closeDeleteConfirmModal = document.getElementById("closeDeleteConfirmModal");
  const cancelDeleteConfirmModal = document.getElementById("cancelDeleteConfirmModal");
  const confirmDeleteConfirmModal = document.getElementById("confirmDeleteConfirmModal");
  const deleteConfirmTitle = document.getElementById("deleteConfirmTitle");
  const deleteConfirmMessage = document.getElementById("deleteConfirmMessage");
  const orderUpdateModal = document.getElementById("orderUpdateModal");
  const closeOrderUpdateModal = document.getElementById("closeOrderUpdateModal");
  const cancelOrderUpdateModal = document.getElementById("cancelOrderUpdateModal");
  const orderUpdateForm = document.getElementById("orderUpdateForm");

  if (!sidebarTitle || !sidebarMenu || !contentTitle || !contentCopy || !contentBody || !primaryActionBtn) return;

  const roleReferenceIds = {
    superstockist: "SS-REF-317",
    stockist: "ST-REF-317",
    dealer: "DL-REF-317"
  };

  const roleMenuItems = {
    admin: ["Manage Product Catalog", "User Management", "View Orders", "Earnings Summary"],
    superstockist: ["Invite Stockist or Dealers", "View Orders", "Earnings Summary"],
    stockist: ["Invite Dealer", "View Orders", "Earnings Summary"],
    dealer: ["View Orders", "Earnings Summary"]
  };

  const roleLabel = {
    admin: "Admin",
    superstockist: "Superstockist",
    stockist: "Stockist",
    dealer: "Dealer"
  };

  const roleDefaultMenuItems = {
    admin: "Earnings Summary"
  };

  let activeRole = "admin";
  let activeMenuItem = "Earnings Summary";
  let editingProductId = null;
  let editingUserId = null;
  let userMgmtSearchTerm = "";
  let userMgmtRoleFilter = "all";
  let adminCatalogSearchTerm = "";
  let adminCatalogFilterValue = "all";
  let adminCatalogPage = 1;
  let userManagementPage = 1;
  let adminOrderSearchTerm = "";
  let adminOrderFilterValue = "all";
  let analyticsPeriodType = "all";
  let analyticsDateValue = "";
  let analyticsWeekValue = "";
  let analyticsMonthValue = "";
  let analyticsYearValue = "";
  let superstockistDispatchTab = "pending";
  let pendingDeleteAction = null;
  let mockUsers = [
    {
      id: "usr-1",
      firstName: "Aarav",
      lastName: "Sharma",
      email: "aarav.sharma@gmail.com",
      role: "Admin",
      referenceNumber: "REF-ADM-001"
    },
    {
      id: "usr-2",
      firstName: "Priya",
      lastName: "Nair",
      email: "priya.nair@gmail.com",
      role: "Superstockist",
      referenceNumber: "REF-SS-102",
      serviceAreaPincode: "560001",
      commission: 8
    },
    {
      id: "usr-8",
      firstName: "Mehul",
      lastName: "Shah",
      email: "mehul.shah@gmail.com",
      role: "Superstockist",
      referenceNumber: "REF-SS-214",
      serviceAreaPincode: "500081",
      commission: 7
    },
    {
      id: "usr-10",
      firstName: "Sonia",
      lastName: "Malik",
      email: "sonia.malik@gmail.com",
      role: "Superstockist",
      referenceNumber: "SS-REF-317",
      serviceAreaPincode: "400001",
      commission: 8
    },
    {
      id: "usr-11",
      firstName: "Harish",
      lastName: "Menon",
      email: "harish.menon@gmail.com",
      role: "Superstockist",
      referenceNumber: "SS-REF-402",
      serviceAreaPincode: "411014",
      commission: 7
    },
    {
      id: "usr-12",
      firstName: "Farah",
      lastName: "Khan",
      email: "farah.khan@gmail.com",
      role: "Superstockist",
      referenceNumber: "SS-REF-418",
      serviceAreaPincode: "700091",
      commission: 9
    },
    {
      id: "usr-9",
      firstName: "Lakshmi",
      lastName: "Reddy",
      email: "lakshmi.reddy@gmail.com",
      role: "Superstockist",
      referenceNumber: "REF-SS-325",
      serviceAreaPincode: "600028",
      commission: 9
    },
    {
      id: "usr-3",
      firstName: "Rohan",
      lastName: "Patel",
      email: "rohan.patel@gmail.com",
      role: "Stockist",
      referenceNumber: "REF-ST-213",
      commission: 5
    },
    {
      id: "usr-7",
      firstName: "Karan",
      lastName: "Mehta",
      email: "karan.mehta@gmail.com",
      role: "Dealer",
      referenceNumber: "REF-DL-701",
      commission: 3
    },
    {
      id: "usr-5",
      firstName: "Ishaan",
      lastName: "Kumar",
      email: "ishaan.kumar@gmail.com",
      role: "Customer",
      referenceNumber: "REF-CUS-517"
    }
  ];
  let mockStockistDealerUsers = [
    {
      id: "sd-1",
      firstName: "Vikram",
      lastName: "Jain",
      email: "vikram.jain@gmail.com",
      type: "stockist",
      stockistReferenceId: "ST-REF-550",
      dealerReferenceId: "-"
    },
    {
      id: "sd-2",
      firstName: "Meera",
      lastName: "Kapoor",
      email: "meera.kapoor@gmail.com",
      type: "dealer",
      stockistReferenceId: "-",
      dealerReferenceId: "DL-REF-812"
    },
    {
      id: "sd-3",
      firstName: "Suresh",
      lastName: "Yadav",
      email: "suresh.yadav@gmail.com",
      type: "stockist",
      stockistReferenceId: "ST-REF-903",
      dealerReferenceId: "-"
    }
  ];
  let mockDealerUsers = [
    {
      id: "dl-1",
      firstName: "Nitin",
      lastName: "Malhotra",
      email: "nitin.malhotra@gmail.com",
      stockistReferenceId: "ST-REF-903",
      dealerReferenceId: "DL-REF-221"
    },
    {
      id: "dl-2",
      firstName: "Pooja",
      lastName: "Kulkarni",
      email: "pooja.kulkarni@gmail.com",
      stockistReferenceId: "ST-REF-903",
      dealerReferenceId: "DL-REF-336"
    }
  ];
  let mockDashboardOrders = [
    {
      id: "ORD-250301",
      isGuest: true,
      referenceIds: {
        superstockistId: "NA",
        stockistId: "NA",
        dealerId: "NA"
      },
      orderDate: "01 Mar 2025",
      status: "Delivered",
      total: 1465,
      customer: {
        firstName: "Rahul",
        lastName: "Verma",
        email: "rahul.verma@gmail.com",
        phone: "+91 98765 43210",
        address: "22, Green Park, Mumbai"
      },
      itemCount: 7,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250317",
      referenceIds: {
        superstockistId: "SS-REF-317",
        stockistId: "ST-REF-317",
        dealerId: "DL-REF-317"
      },
      orderDate: "17 Mar 2025",
      status: "Processing",
      total: 845,
      customer: {
        firstName: "Sneha",
        lastName: "Iyer",
        email: "sneha.iyer@gmail.com",
        phone: "+91 99887 77665",
        address: "12, Lake View Road, Bengaluru"
      },
      itemCount: 4,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250402",
      referenceIds: {
        superstockistId: "SS-REF-402",
        stockistId: "ST-REF-402",
        dealerId: "DL-REF-402"
      },
      orderDate: "02 Apr 2025",
      status: "Delivered",
      total: 2390,
      customer: {
        firstName: "Arjun",
        lastName: "Mehta",
        email: "arjun.mehta@gmail.com",
        phone: "+91 90909 81818",
        address: "45, Sunrise Colony, Pune"
      },
      itemCount: 11,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250418",
      referenceIds: {
        superstockistId: "SS-REF-418",
        stockistId: "ST-REF-418",
        dealerId: "DL-REF-418"
      },
      orderDate: "18 Apr 2025",
      status: "Packed",
      total: 1099,
      customer: {
        firstName: "Kavya",
        lastName: "Nanda",
        email: "kavya.nanda@gmail.com",
        phone: "+91 98111 22334",
        address: "9, Heritage Block, Hyderabad"
      },
      itemCount: 5,
      dispatch: {
        status: "pending",
        completedAt: "",
        comments: ""
      }
    },
    {
      id: "ORD-250429",
      referenceIds: {
        superstockistId: "SS-REF-317",
        stockistId: "ST-REF-903",
        dealerId: "DL-REF-903"
      },
      orderDate: "29 Apr 2025",
      status: "Shipped",
      total: 1260,
      customer: {
        firstName: "Diya",
        lastName: "Rao",
        email: "diya.rao@gmail.com",
        phone: "+91 91234 55667",
        address: "88, Palm Street, Chennai"
      },
      itemCount: 6,
      dispatch: {
        status: "dispatched",
        completedAt: "2025-04-30T11:15",
        comments: "Left warehouse after quality check"
      }
    }
  ];

  const fallbackCommissionByRole = {
    Superstockist: 8,
    Stockist: 5,
    Dealer: 3
  };

  const monthIndexMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11
  };

  const parseDashboardOrderDate = (value) => {
    if (!value) return null;
    const parts = value.trim().split(/\s+/);
    if (parts.length !== 3) return null;
    const [dayText, monthText, yearText] = parts;
    const day = Number(dayText);
    const month = monthIndexMap[monthText];
    const year = Number(yearText);
    if (Number.isNaN(day) || Number.isNaN(year) || typeof month !== "number") return null;
    return new Date(year, month, day);
  };

  const formatDateInputValue = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getIsoWeekValue = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
    return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  };

  const getCommissionRateForRole = (role, referenceId) => {
    if (!referenceId || referenceId === "NA") return 0;
    if (role === "Superstockist") {
      const matchedUser = mockUsers.find((user) => user.role === role && user.referenceNumber === referenceId);
      return matchedUser?.commission ?? fallbackCommissionByRole[role];
    }
    return fallbackCommissionByRole[role] ?? 0;
  };

  const getOrderEarningsBreakdown = (order) => {
    const total = Number(order.total ?? 0);
    const ssRate = getCommissionRateForRole("Superstockist", order.referenceIds?.superstockistId);
    const stockistRate = getCommissionRateForRole("Stockist", order.referenceIds?.stockistId);
    const dealerRate = getCommissionRateForRole("Dealer", order.referenceIds?.dealerId);
    const superstockistAmount = Number((total * ssRate / 100).toFixed(2));
    const stockistAmount = Number((total * stockistRate / 100).toFixed(2));
    const dealerAmount = Number((total * dealerRate / 100).toFixed(2));
    const adminAmount = Number((total - superstockistAmount - stockistAmount - dealerAmount).toFixed(2));

    return {
      admin: { amount: adminAmount },
      superstockist: { rate: ssRate, amount: superstockistAmount },
      stockist: { rate: stockistRate, amount: stockistAmount },
      dealer: { rate: dealerRate, amount: dealerAmount }
    };
  };

  const getFilteredAnalyticsOrders = (orders) => {
    return orders.filter((order) => {
      const orderDate = parseDashboardOrderDate(order.orderDate);
      if (!orderDate) return false;

      if (analyticsPeriodType === "date") {
        return !analyticsDateValue || formatDateInputValue(orderDate) === analyticsDateValue;
      }

      if (analyticsPeriodType === "week") {
        return !analyticsWeekValue || getIsoWeekValue(orderDate) === analyticsWeekValue;
      }

      if (analyticsPeriodType === "month") {
        return !analyticsMonthValue || formatDateInputValue(orderDate).slice(0, 7) === analyticsMonthValue;
      }

      if (analyticsPeriodType === "year") {
        return !analyticsYearValue || String(orderDate.getFullYear()) === analyticsYearValue;
      }

      return true;
    });
  };

  const renderAnalyticsPanel = (role) => {
    primaryActionBtn.hidden = true;

    const analyticsOrders = role === "admin"
      ? mockDashboardOrders
      : mockDashboardOrders.filter((order) => {
          if (role === "superstockist") return order.referenceIds?.superstockistId === roleReferenceIds.superstockist;
          if (role === "stockist") return order.referenceIds?.stockistId === roleReferenceIds.stockist;
          return order.referenceIds?.dealerId === roleReferenceIds.dealer;
        });

    const visibleOrders = getFilteredAnalyticsOrders(analyticsOrders);
    const availableYears = Array.from(new Set(analyticsOrders
      .map((order) => parseDashboardOrderDate(order.orderDate)?.getFullYear())
      .filter(Boolean)))
      .sort((left, right) => right - left);

    let periodInputHtml = "";
    if (analyticsPeriodType === "date") {
      periodInputHtml = `<input id="analyticsDateInput" class="dashboard-catalog-search" type="date" value="${analyticsDateValue}" aria-label="Filter analytics by date" />`;
    } else if (analyticsPeriodType === "week") {
      periodInputHtml = `<input id="analyticsWeekInput" class="dashboard-catalog-search" type="week" value="${analyticsWeekValue}" aria-label="Filter analytics by week" />`;
    } else if (analyticsPeriodType === "month") {
      periodInputHtml = `<input id="analyticsMonthInput" class="dashboard-catalog-search" type="month" value="${analyticsMonthValue}" aria-label="Filter analytics by month" />`;
    } else if (analyticsPeriodType === "year") {
      periodInputHtml = `
        <div class="dashboard-catalog-filter-wrap">
          <label for="analyticsYearInput">Year</label>
          <select id="analyticsYearInput" class="dashboard-catalog-filter" aria-label="Filter analytics by year">
            <option value="">All Years</option>
            ${availableYears.map((year) => `<option value="${year}" ${analyticsYearValue === String(year) ? "selected" : ""}>${year}</option>`).join("")}
          </select>
        </div>
      `;
    }

    const orderBreakdowns = visibleOrders.map((order) => ({ order, earnings: getOrderEarningsBreakdown(order) }));
    const maxRoleAmount = Math.max(1, ...orderBreakdowns.map(({ earnings }) => {
      if (role === "superstockist") return earnings.superstockist.amount;
      if (role === "stockist") return earnings.stockist.amount;
      return earnings.dealer.amount;
    }));

    const totals = orderBreakdowns.reduce((summary, { earnings }) => {
      summary.admin += earnings.admin.amount;
      summary.superstockist += earnings.superstockist.amount;
      summary.stockist += earnings.stockist.amount;
      summary.dealer += earnings.dealer.amount;
      return summary;
    }, { admin: 0, superstockist: 0, stockist: 0, dealer: 0 });

    const roleTitle = roleLabel[role] ?? "Role";
    const roleCardsHtml = role === "admin"
      ? `
        <div class="analytics-summary-grid">
          <article class="analytics-summary-card"><span>Admin Earnings</span><strong>${formatCurrency(totals.admin)}</strong></article>
          <article class="analytics-summary-card"><span>Superstockist Earnings</span><strong>${formatCurrency(totals.superstockist)}</strong></article>
          <article class="analytics-summary-card"><span>Stockist Earnings</span><strong>${formatCurrency(totals.stockist)}</strong></article>
          <article class="analytics-summary-card"><span>Dealer Earnings</span><strong>${formatCurrency(totals.dealer)}</strong></article>
          <article class="analytics-summary-card"><span>Orders Count</span><strong>${visibleOrders.length}</strong></article>
        </div>
      `
      : (() => {
          const roleKey = role === "superstockist" ? "superstockist" : role;
          const totalAmount = totals[roleKey];
          const averageAmount = visibleOrders.length ? totalAmount / visibleOrders.length : 0;
          return `
            <div class="analytics-summary-grid analytics-summary-grid-compact">
              <article class="analytics-summary-card"><span>${roleTitle} Earnings</span><strong>${formatCurrency(totalAmount)}</strong></article>
              <article class="analytics-summary-card"><span>Orders Count</span><strong>${visibleOrders.length}</strong></article>
              <article class="analytics-summary-card"><span>Average / Order</span><strong>${formatCurrency(averageAmount)}</strong></article>
            </div>
          `;
        })();

    const adminRowsHtml = orderBreakdowns.map(({ order, earnings }) => {
      const orderTotal = Math.max(1, Number(order.total ?? 0));
      return `
      <article class="analytics-order-card">
        <div class="analytics-order-head">
          <div>
            <strong>${order.id}</strong>
            <p>${order.orderDate} · ${order.customer.firstName} ${order.customer.lastName}</p>
          </div>
          <span>${formatCurrency(order.total)}</span>
        </div>
        <div class="analytics-bar-group">
          <div class="analytics-bar-row">
            <span>Admin</span>
            <div class="analytics-bar-track"><div class="analytics-bar analytics-bar-admin" style="width:${(earnings.admin.amount / orderTotal) * 100}%"></div></div>
            <strong>${formatCurrency(earnings.admin.amount)}</strong>
          </div>
          <div class="analytics-bar-row">
            <span>Superstockist</span>
            <div class="analytics-bar-track"><div class="analytics-bar analytics-bar-superstockist" style="width:${(earnings.superstockist.amount / orderTotal) * 100}%"></div></div>
            <strong>${formatCurrency(earnings.superstockist.amount)}</strong>
          </div>
          <div class="analytics-bar-row">
            <span>Stockist</span>
            <div class="analytics-bar-track"><div class="analytics-bar analytics-bar-stockist" style="width:${(earnings.stockist.amount / orderTotal) * 100}%"></div></div>
            <strong>${formatCurrency(earnings.stockist.amount)}</strong>
          </div>
          <div class="analytics-bar-row">
            <span>Dealer</span>
            <div class="analytics-bar-track"><div class="analytics-bar analytics-bar-dealer" style="width:${(earnings.dealer.amount / orderTotal) * 100}%"></div></div>
            <strong>${formatCurrency(earnings.dealer.amount)}</strong>
          </div>
        </div>
      </article>
    `;
    }).join("");

    const roleRowsHtml = role === "admin"
      ? ""
      : orderBreakdowns.map(({ order, earnings }) => {
          const roleKey = role === "superstockist" ? "superstockist" : role;
          const amount = earnings[roleKey].amount;
          const rate = earnings[roleKey].rate;
          return `
            <article class="analytics-order-card">
              <div class="analytics-order-head">
                <div>
                  <strong>${order.id}</strong>
                  <p>${order.orderDate} · ${order.customer.firstName} ${order.customer.lastName}</p>
                </div>
                <span>${formatCurrency(order.total)}</span>
              </div>
              <div class="analytics-bar-group">
                <div class="analytics-bar-row analytics-bar-row-single">
                  <span>${roleTitle}</span>
                  <div class="analytics-bar-track"><div class="analytics-bar analytics-bar-${roleKey}" style="width:${(amount / maxRoleAmount) * 100}%"></div></div>
                  <strong>${formatCurrency(amount)}</strong>
                </div>
                <p class="analytics-order-rate">Commission: ${rate}%</p>
              </div>
            </article>
          `;
        }).join("");

    contentBody.innerHTML = `
      <div class="dashboard-catalog-controls analytics-controls">
        <div class="dashboard-catalog-filter-wrap">
          <label for="analyticsPeriodType">Range</label>
          <select id="analyticsPeriodType" class="dashboard-catalog-filter" aria-label="Filter analytics range">
            <option value="all" ${analyticsPeriodType === "all" ? "selected" : ""}>All</option>
            <option value="date" ${analyticsPeriodType === "date" ? "selected" : ""}>Date</option>
            <option value="week" ${analyticsPeriodType === "week" ? "selected" : ""}>Week</option>
            <option value="month" ${analyticsPeriodType === "month" ? "selected" : ""}>Month</option>
            <option value="year" ${analyticsPeriodType === "year" ? "selected" : ""}>Year</option>
          </select>
        </div>
        ${periodInputHtml}
      </div>
      ${roleCardsHtml}
      <section class="analytics-orders-wrap">
        ${visibleOrders.length === 0 ? '<p class="dashboard-placeholder">No earnings found for the selected period.</p>' : (role === "admin" ? adminRowsHtml : roleRowsHtml)}
      </section>
    `;

    const analyticsPeriodTypeInput = document.getElementById("analyticsPeriodType");
    const analyticsDateInput = document.getElementById("analyticsDateInput");
    const analyticsWeekInput = document.getElementById("analyticsWeekInput");
    const analyticsMonthInput = document.getElementById("analyticsMonthInput");
    const analyticsYearInput = document.getElementById("analyticsYearInput");

    if (analyticsPeriodTypeInput) {
      analyticsPeriodTypeInput.addEventListener("change", (event) => {
        analyticsPeriodType = event.target.value;
        renderPanelBody();
      });
    }
    if (analyticsDateInput) {
      analyticsDateInput.addEventListener("change", (event) => {
        analyticsDateValue = event.target.value;
        renderPanelBody();
      });
    }
    if (analyticsWeekInput) {
      analyticsWeekInput.addEventListener("change", (event) => {
        analyticsWeekValue = event.target.value;
        renderPanelBody();
      });
    }
    if (analyticsMonthInput) {
      analyticsMonthInput.addEventListener("change", (event) => {
        analyticsMonthValue = event.target.value;
        renderPanelBody();
      });
    }
    if (analyticsYearInput) {
      analyticsYearInput.addEventListener("change", (event) => {
        analyticsYearValue = event.target.value;
        renderPanelBody();
      });
    }
  };

  const getImageFileName = (imagePath) => {
    if (!imagePath) return "No file selected";
    const parts = imagePath.split("/");
    return parts[parts.length - 1] || "mock-file.jpg";
  };

  const closeEditorModal = () => {
    if (!productEditorModal) return;
    productEditorModal.hidden = true;
  };

  const closeUserModal = () => {
    if (!userEditorModal) return;
    userEditorModal.hidden = true;
  };

  const closeUserRoleModal = () => {
    if (!userRoleEditorModal) return;
    userRoleEditorModal.hidden = true;
    editingUserId = null;
  };

  const openUserModal = () => {
    if (!userEditorModal || !userEditorForm) return;
    userEditorForm.reset();
    const roleSelect = document.getElementById("userRole");
    const refRow = document.getElementById("userReferenceRow");
    const pincodeRow = document.getElementById("userPincodeRow");
    const commissionRow = document.getElementById("userCommissionRow");
    if (refRow) refRow.hidden = true;
    if (pincodeRow) pincodeRow.hidden = true;
    if (commissionRow) commissionRow.hidden = true;
    if (roleSelect) roleSelect.value = "Admin";
    userEditorModal.hidden = false;
  };

  const openUserRoleModal = (userId) => {
    if (!userRoleEditorModal || !userRoleEditorForm || !userId) return;
    const matchedUser = mockUsers.find((user) => user.id === userId);
    if (!matchedUser) return;

    editingUserId = userId;
    userRoleEditorForm.reset();

    const userIdInput = document.getElementById("userRoleEditorId");
    const roleInput = document.getElementById("userRoleEditorSelect");
    const userName = document.getElementById("userRoleEditorName");

    const commissionRow = document.getElementById("userRoleCommissionRow");
    const commissionInput = document.getElementById("userRoleCommission");
    const pincodeRow = document.getElementById("userRolePincodeRow");
    const pincodeInput = document.getElementById("userRoleServiceAreaPincode");
    const commissionRoles = ["Superstockist", "Stockist", "Dealer"];
    const upgradeRoleOptions = {
      Admin: ["Admin"],
      Superstockist: ["Superstockist"],
      Stockist: ["Stockist", "Superstockist"],
      Dealer: ["Dealer", "Stockist"],
      Customer: ["Customer", "Dealer"]
    };

    const toggleCommissionRow = (role) => {
      if (!commissionRow) return;
      commissionRow.hidden = !commissionRoles.includes(role);
      if (commissionInput) commissionInput.required = commissionRoles.includes(role);
    };

    const togglePincodeRow = (role) => {
      const needsPincode = role === "Superstockist";
      if (pincodeRow) pincodeRow.hidden = !needsPincode;
      if (pincodeInput) pincodeInput.required = needsPincode;
    };

    if (userIdInput) userIdInput.value = userId;
    if (roleInput) {
      const allowedRoles = upgradeRoleOptions[matchedUser.role] ?? [matchedUser.role];
      roleInput.innerHTML = allowedRoles
        .map((roleOption) => `<option value="${roleOption}">${roleOption}</option>`)
        .join("");
      roleInput.value = matchedUser.role;
      roleInput.disabled = false;
      roleInput.onchange = () => {
        toggleCommissionRow(roleInput.value);
        togglePincodeRow(roleInput.value);
      };
    }
    if (commissionInput) commissionInput.value = matchedUser.commission ?? "";
    if (pincodeInput) pincodeInput.value = matchedUser.serviceAreaPincode ?? "";
    if (userName) userName.textContent = `${matchedUser.firstName} ${matchedUser.lastName} (${matchedUser.email})`;

    const initialRole = roleInput?.value || matchedUser.role;
    toggleCommissionRow(initialRole);
    togglePincodeRow(initialRole);
    userRoleEditorModal.hidden = false;
  };

  const closeStockistDealerFormModal = () => {
    if (!stockistDealerModal) return;
    stockistDealerModal.hidden = true;
  };

  const openStockistDealerFormModal = () => {
    if (!stockistDealerModal || !stockistDealerForm) return;
    stockistDealerForm.reset();
    stockistDealerModal.hidden = false;
  };

  const closeDealerFormModal = () => {
    if (!dealerInviteModal) return;
    dealerInviteModal.hidden = true;
  };

  const closeDispatchCompleteFormModal = () => {
    if (!dispatchCompleteModal) return;
    dispatchCompleteModal.hidden = true;
  };

  const closeDeleteModal = () => {
    if (!deleteConfirmModal) return;
    deleteConfirmModal.hidden = true;
    pendingDeleteAction = null;
  };

  const closeOrderUpdateFormModal = () => {
    if (!orderUpdateModal) return;
    orderUpdateModal.hidden = true;
  };

  const openOrderUpdateFormModal = (orderId) => {
    if (!orderUpdateModal || !orderUpdateForm || !orderId) return;
    const matchedOrder = mockDashboardOrders.find((order) => order.id === orderId);
    if (!matchedOrder) return;

    const orderIdInput = document.getElementById("orderUpdateOrderId");
    const modalTitle = document.getElementById("orderUpdateTitle");
    const modalCopy = document.getElementById("orderUpdateCopy");
    const currentSsRow = document.getElementById("orderUpdateCurrentSsRow");
    const currentSsValue = document.getElementById("orderUpdateCurrentSs");
    const selectLabel = document.getElementById("orderUpdateSelectLabel");
    const superstockistSelect = document.getElementById("orderUpdateSuperstockistSelect");

    if (!orderIdInput || !modalTitle || !modalCopy || !currentSsRow || !currentSsValue || !selectLabel || !superstockistSelect) return;

    const superstockistUsers = mockUsers.filter((user) => user.role === "Superstockist");
    const currentRef = matchedOrder.referenceIds?.superstockistId ?? "NA";
    const isGuestOrder = Boolean(matchedOrder.isGuest);
    const hasAssignedSuperstockist = currentRef !== "NA";
    const isGuestOrderNeedingAssignment = isGuestOrder && !hasAssignedSuperstockist;

    if (orderIdInput) orderIdInput.value = matchedOrder.id;

    modalTitle.textContent = isGuestOrderNeedingAssignment ? "Assign Superstockist" : "Modify Superstockist";
    modalCopy.textContent = isGuestOrderNeedingAssignment
      ? "Select a Superstockist for this guest order."
      : "Modify the Superstockist assignment for this order.";
    selectLabel.textContent = isGuestOrderNeedingAssignment ? "Assign Superstockist" : "Modify Superstockist";

    currentSsRow.hidden = isGuestOrderNeedingAssignment;
    currentSsValue.textContent = currentRef;

    superstockistSelect.innerHTML = superstockistUsers
      .map((user) => {
        const displayPincode = user.serviceAreaPincode || "NA";
        const displayRef = user.referenceNumber || "NA";
        return `<option value="${displayRef}">${user.email} - ${displayPincode}</option>`;
      })
      .join("");

    if (superstockistUsers.length === 0) {
      superstockistSelect.innerHTML = '<option value="">No superstockist available</option>';
      superstockistSelect.disabled = true;
    } else {
      superstockistSelect.disabled = false;
      if (superstockistUsers.some((user) => user.referenceNumber === currentRef)) {
        superstockistSelect.value = currentRef;
      }
    }

    orderUpdateModal.hidden = false;
  };

  const openDeleteModal = (title, message, onConfirm) => {
    if (!deleteConfirmModal || !deleteConfirmTitle || !deleteConfirmMessage) return;
    pendingDeleteAction = onConfirm;
    deleteConfirmTitle.textContent = title;
    deleteConfirmMessage.textContent = message;

    deleteConfirmModal.hidden = false;
  };

  const getCurrentDateTimeLocalValue = () => {
    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localTime.toISOString().slice(0, 16);
  };

  const toggleDispatchDateTimeField = (dispatchStatus) => {
    const dispatchDateTimeInput = document.getElementById("dispatchCompletedAt");
    if (!dispatchDateTimeRow || !dispatchDateTimeInput) return;

    const shouldShow = dispatchStatus === "dispatched";
    dispatchDateTimeRow.hidden = !shouldShow;
    dispatchDateTimeInput.required = shouldShow;
  };

  const openDispatchCompleteFormModal = (orderId) => {
    if (!dispatchCompleteModal || !dispatchCompleteForm || !orderId) return;
    const matchedOrder = mockDashboardOrders.find((order) => order.id === orderId);
    dispatchCompleteForm.reset();

    const orderIdInput = document.getElementById("dispatchOrderId");
    const dispatchDateTimeInput = document.getElementById("dispatchCompletedAt");
    const dispatchCommentsInput = document.getElementById("dispatchComments");
    if (orderIdInput) {
      orderIdInput.value = orderId;
    }
    const statusValue = matchedOrder?.dispatch?.status === "cancelled" ? "cancelled" : "dispatched";
    if (dispatchStatusSelect) {
      dispatchStatusSelect.value = statusValue;
    }
    if (dispatchCommentsInput) {
      dispatchCommentsInput.value = matchedOrder?.dispatch?.comments ?? "";
    }
    if (dispatchDateTimeInput) {
      dispatchDateTimeInput.value = matchedOrder?.dispatch?.completedAt || getCurrentDateTimeLocalValue();
    }

    toggleDispatchDateTimeField(statusValue);

    dispatchCompleteModal.hidden = false;
  };

  const openDealerFormModal = () => {
    if (!dealerInviteModal || !dealerInviteForm) return;
    dealerInviteForm.reset();
    dealerInviteModal.hidden = false;
  };

  const openEditorModal = (product = null) => {
    if (!productEditorModal || !productEditorForm || !productEditorTitle) return;

    editingProductId = product?.id ?? null;
    const isUpdateMode = Boolean(product);
    productEditorTitle.textContent = isUpdateMode ? "Update Product" : "Add Product";
    if (productEditorSubmitBtn) {
      productEditorSubmitBtn.textContent = isUpdateMode ? "Update Product" : "Add Product";
    }

    const titleInput = document.getElementById("editorTitle");
    const categoryInput = document.getElementById("editorCategory");
    const descriptionInput = document.getElementById("editorDescription");
    const mrpInput = document.getElementById("editorMrp");
    const discountedPriceInput = document.getElementById("editorDiscountedPrice");
    const stockCountInput = document.getElementById("editorStockCount");
    const imageInput = document.getElementById("editorImage");

    if (!titleInput || !categoryInput || !descriptionInput || !mrpInput || !discountedPriceInput || !stockCountInput || !imageInput) return;

    titleInput.value = product?.title ?? "";
    categoryInput.value = product?.category ?? "grains";
    descriptionInput.value = product?.description ?? "";
    const safeDiscountedPrice = Number(product?.price ?? 0);
    const fallbackMrp = Number((safeDiscountedPrice * 1.2).toFixed(2));
    const safeMrp = Number(product?.mrp ?? fallbackMrp);
    const safeStockCount = Number(product?.stockCount ?? 0);
    mrpInput.value = product ? String(safeMrp) : "";
    discountedPriceInput.value = product ? String(safeDiscountedPrice) : "";
    stockCountInput.value = product ? String(safeStockCount) : "";
    imageInput.value = product?.image ?? "";
    if (mockUploadFileName) {
      mockUploadFileName.textContent = getImageFileName(imageInput.value);
    }

    productEditorModal.hidden = false;
  };

  const renderCatalogProducts = () => {
    const query = adminCatalogSearchTerm.trim().toLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesSearch = !query || product.title.toLowerCase().includes(query);
      const matchesFilter = adminCatalogFilterValue === "all" || product.category === adminCatalogFilterValue;
      return matchesSearch && matchesFilter;
    });

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ADMIN_CATALOG_ITEMS_PER_PAGE));
    adminCatalogPage = Math.min(adminCatalogPage, totalPages);

    const pageStart = (adminCatalogPage - 1) * ADMIN_CATALOG_ITEMS_PER_PAGE;
    const pageItems = filteredProducts.slice(pageStart, pageStart + ADMIN_CATALOG_ITEMS_PER_PAGE);

    contentBody.innerHTML = `
      <div class="dashboard-catalog-controls">
        <input
          id="dashboardCatalogSearch"
          class="dashboard-catalog-search"
          type="search"
          placeholder="Search products"
          value="${adminCatalogSearchTerm}"
          aria-label="Search products in catalog"
        />
        <div class="dashboard-catalog-filter-wrap">
          <label for="dashboardCatalogFilter">Filter</label>
          <select id="dashboardCatalogFilter" class="dashboard-catalog-filter" aria-label="Filter products by category">
            <option value="all" ${adminCatalogFilterValue === "all" ? "selected" : ""}>All</option>
            <option value="grains" ${adminCatalogFilterValue === "grains" ? "selected" : ""}>Grains</option>
            <option value="vegetables" ${adminCatalogFilterValue === "vegetables" ? "selected" : ""}>Vegetables</option>
            <option value="dairy" ${adminCatalogFilterValue === "dairy" ? "selected" : ""}>Dairy</option>
            <option value="fruits" ${adminCatalogFilterValue === "fruits" ? "selected" : ""}>Fruits</option>
          </select>
        </div>
      </div>

      <div class="dashboard-products-grid">
        ${pageItems
          .map(
            (product) => `
              <article class="dashboard-product-card">
                <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="this.onerror=null;this.src='${imageFallback("Image Unavailable")}';" />
                <div class="dashboard-product-content">
                  <h4>${product.title}</h4>
                  <p>${product.description}</p>
                  <div class="dashboard-product-meta">
                    <span>${product.category}</span>
                    <strong>${formatCurrency(product.price)}</strong>
                  </div>
                  <button type="button" class="dashboard-update-btn" data-edit-product="${product.id}">
                    <svg class="dashboard-update-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.004 1.004 0 0 0 0-1.42l-2.5-2.5a1.004 1.004 0 0 0-1.42 0l-1.96 1.96 3.75 3.75 2.13-1.79z" />
                    </svg>
                    <span>Update Product</span>
                  </button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>

      ${filteredProducts.length === 0 ? '<p class="dashboard-placeholder">No products found for your search/filter.</p>' : ""}

      ${totalPages > 1 ? `
        <div class="dashboard-catalog-pagination">
          <button type="button" class="page-btn" id="dashboardPagePrev" ${adminCatalogPage === 1 ? "disabled" : ""}>Prev</button>
          <span class="page-indicator">Page ${adminCatalogPage} / ${totalPages}</span>
          <button type="button" class="page-btn" id="dashboardPageNext" ${adminCatalogPage === totalPages ? "disabled" : ""}>Next</button>
        </div>
      ` : ""}
    `;

    const searchInput = document.getElementById("dashboardCatalogSearch");
    const filterInput = document.getElementById("dashboardCatalogFilter");
    const prevBtn = document.getElementById("dashboardPagePrev");
    const nextBtn = document.getElementById("dashboardPageNext");

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        adminCatalogSearchTerm = event.target.value;
        adminCatalogPage = 1;
        renderCatalogProducts();
      });
    }

    if (filterInput) {
      filterInput.addEventListener("change", (event) => {
        adminCatalogFilterValue = event.target.value;
        adminCatalogPage = 1;
        renderCatalogProducts();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        adminCatalogPage = Math.max(1, adminCatalogPage - 1);
        renderCatalogProducts();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        adminCatalogPage = Math.min(totalPages, adminCatalogPage + 1);
        renderCatalogProducts();
      });
    }

    const editButtons = contentBody.querySelectorAll("[data-edit-product]");
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-edit-product");
        if (!id) return;
        const selectedProduct = products.find((product) => product.id === id);
        if (!selectedProduct) return;
        openEditorModal(selectedProduct);
      });
    });
  };

  const renderOrdersAccordion = (orders, emptyMessage = "No orders found.", options = {}) => {
    const {
      container = contentBody,
      showDispatchActions = false,
      showOrderUpdateAction = false
    } = options;

    primaryActionBtn.hidden = true;

    if (!container) return;

    if (!orders.length) {
      container.innerHTML = `<p class="dashboard-placeholder">${emptyMessage}</p>`;
      return;
    }

    container.innerHTML = `
      <div class="dashboard-orders-accordion" id="dashboardOrdersAccordion">
        ${orders
          .map((order, index) => {
            const isOpen = index === 0;
            const isGuestOrder = Boolean(order.isGuest);
            const hasAssignedSuperstockist = Boolean(
              order.referenceIds?.superstockistId && order.referenceIds.superstockistId !== "NA"
            );
            const refIds = isGuestOrder
              ? {
                  superstockistId: hasAssignedSuperstockist ? order.referenceIds.superstockistId : "NA",
                  stockistId: "NA",
                  dealerId: "NA"
                }
              : order.referenceIds;
            const superstockistUser = mockUsers.find(
              (user) => user.role === "Superstockist" && user.referenceNumber === refIds.superstockistId
            );
            const superstockistDisplay = showOrderUpdateAction
              ? (superstockistUser
                  ? `${superstockistUser.email} - ${superstockistUser.serviceAreaPincode ?? "NA"}`
                  : "NA")
              : refIds.superstockistId;
            const dispatchAt = order.dispatch?.completedAt ?? "";
            const dispatchComments = order.dispatch?.comments ?? "";
            const dispatchState = order.dispatch?.status ?? (dispatchAt ? "dispatched" : "pending");
            const dispatchInfo = dispatchState !== "pending"
              ? `
                <div class="dashboard-dispatch-details">
                  <p><strong>Dispatch Status:</strong> ${dispatchState === "cancelled" ? "Cancelled" : "Dispatched"}</p>
                  ${dispatchState === "dispatched" && dispatchAt ? `<p><strong>Dispatch Completed At:</strong> ${dispatchAt.replace("T", " ")}</p>` : ""}
                  ${dispatchComments ? `<p><strong>Comments:</strong> ${dispatchComments}</p>` : ""}
                </div>
              `
              : "";

            return `
              <article class="dashboard-order-accordion-item ${isOpen ? "open" : ""}" data-order-acc>
                <button type="button" class="dashboard-order-accordion-toggle" data-order-toggle aria-expanded="${isOpen ? "true" : "false"}">
                  <div class="dashboard-order-summary-left">
                    <strong>${order.id}</strong>
                    <p>${order.orderDate}</p>
                    ${isGuestOrder ? `<span class="dashboard-order-guest-chip">${hasAssignedSuperstockist ? "Guest Order - Assigned" : "Guest Order - Action Required"}</span>` : ""}
                  </div>
                  <div class="dashboard-order-summary-right">
                    <span class="dashboard-order-status">${order.status}</span>
                    <span class="dashboard-order-total">${formatCurrency(order.total)}</span>
                  </div>
                </button>

                <div class="dashboard-order-accordion-body" ${isOpen ? "" : "hidden"}>
                  <div class="dashboard-order-refs">
                    <span class="dashboard-order-ref-chip"><strong>Superstockist Assigned:</strong> ${superstockistDisplay}</span>
                    <span class="dashboard-order-ref-chip"><strong>Stockist ID:</strong> ${refIds.stockistId}</span>
                    <span class="dashboard-order-ref-chip"><strong>Dealer ID:</strong> ${refIds.dealerId}</span>
                  </div>

                  <div class="dashboard-order-customer">
                    <h4>Customer Details</h4>
                    <p>${order.customer.firstName} ${order.customer.lastName}</p>
                    <p>${order.customer.email}</p>
                    <p>${order.customer.phone}</p>
                    <p>${order.customer.address}</p>
                  </div>

                  <div class="dashboard-order-meta">
                    <span>${order.itemCount} items</span>
                    <strong>${formatCurrency(order.total)}</strong>
                  </div>

                  ${showOrderUpdateAction ? `
                    <div class="dashboard-dispatch-actions">
                      <button type="button" class="dashboard-primary-btn" data-update-order="${order.id}"><span aria-hidden="true">✎</span> Update Order</button>
                    </div>
                  ` : ""}

                  ${showDispatchActions ? `
                    <div class="dashboard-dispatch-actions">
                      <button type="button" class="dashboard-primary-btn" data-dispatch-complete-order="${order.id}"><span aria-hidden="true">✎</span> Update Status</button>
                    </div>
                  ` : ""}

                  ${dispatchInfo}
                </div>
              </article>
            `;
          })
          .join("")}
      </div>
    `;

    const accordionItems = Array.from(container.querySelectorAll("[data-order-acc]"));
    const toggleButtons = Array.from(container.querySelectorAll("[data-order-toggle]"));

    toggleButtons.forEach((toggleBtn, index) => {
      toggleBtn.addEventListener("click", () => {
        accordionItems.forEach((item, itemIndex) => {
          const body = item.querySelector(".dashboard-order-accordion-body");
          const btn = item.querySelector("[data-order-toggle]");
          if (!body || !btn) return;

          const shouldOpen = itemIndex === index && body.hidden;
          item.classList.toggle("open", shouldOpen);
          body.hidden = !shouldOpen;
          btn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        });
      });
    });

    const dispatchButtons = Array.from(container.querySelectorAll("[data-dispatch-complete-order]"));
    dispatchButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const orderId = button.getAttribute("data-dispatch-complete-order");
        if (!orderId) return;
        openDispatchCompleteFormModal(orderId);
      });
    });

    const updateOrderButtons = Array.from(container.querySelectorAll("[data-update-order]"));
    updateOrderButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const orderId = button.getAttribute("data-update-order");
        if (!orderId) return;
        openOrderUpdateFormModal(orderId);
      });
    });
  };

  const renderSuperstockistDispatchPanel = (ordersForSuperstockist) => {
    const getDispatchState = (order) => order.dispatch?.status ?? (order.dispatch?.completedAt ? "dispatched" : "pending");
    const pendingOrders = ordersForSuperstockist.filter((order) => getDispatchState(order) === "pending");
    const completedOrders = ordersForSuperstockist.filter((order) => getDispatchState(order) !== "pending");

    contentBody.innerHTML = `
      <div class="dashboard-dispatch-toggle" role="tablist" aria-label="Dispatch status filter">
        <button type="button" class="dashboard-dispatch-toggle-btn ${superstockistDispatchTab === "pending" ? "active" : ""}" data-dispatch-tab="pending">Pending Dispatch</button>
        <button type="button" class="dashboard-dispatch-toggle-btn ${superstockistDispatchTab === "completed" ? "active" : ""}" data-dispatch-tab="completed">Shipped</button>
      </div>
      <div id="superstockistDispatchOrders"></div>
    `;

    const dispatchTarget = document.getElementById("superstockistDispatchOrders");
    if (!dispatchTarget) return;

    if (superstockistDispatchTab === "pending") {
      renderOrdersAccordion(
        pendingOrders,
        "No pending dispatch orders for your Superstockist reference ID.",
        { container: dispatchTarget, showDispatchActions: true }
      );
    } else {
      renderOrdersAccordion(
        completedOrders,
        "No shipped orders for your Superstockist reference ID.",
        { container: dispatchTarget, showDispatchActions: false }
      );
    }

    const tabButtons = Array.from(contentBody.querySelectorAll("[data-dispatch-tab]"));
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedTab = button.getAttribute("data-dispatch-tab");
        if (!selectedTab || selectedTab === superstockistDispatchTab) return;
        superstockistDispatchTab = selectedTab;
        renderSuperstockistDispatchPanel(ordersForSuperstockist);
      });
    });
  };

  const renderPanelBody = () => {
    if (activeRole === "admin" && activeMenuItem === "Manage Product Catalog") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add New Product";
      renderCatalogProducts();
      return;
    }

    if (activeRole === "admin" && activeMenuItem === "User Management") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add User";

      const emailQuery = userMgmtSearchTerm.trim().toLowerCase();
      const filteredUsers = mockUsers.filter((user) => {
        const matchesEmail = !emailQuery || user.email.toLowerCase().includes(emailQuery);
        const matchesRole = userMgmtRoleFilter === "all" || user.role === userMgmtRoleFilter;
        return matchesEmail && matchesRole;
      });

      const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USER_TABLE_ITEMS_PER_PAGE));
      userManagementPage = Math.min(userManagementPage, totalUserPages);
      const userStart = (userManagementPage - 1) * USER_TABLE_ITEMS_PER_PAGE;
      const pageUsers = filteredUsers.slice(userStart, userStart + USER_TABLE_ITEMS_PER_PAGE);

      contentBody.innerHTML = `
        <div class="dashboard-catalog-controls">
          <input
            id="userMgmtSearch"
            class="dashboard-catalog-search"
            type="search"
            placeholder="Search by email"
            value="${userMgmtSearchTerm}"
            aria-label="Search users by email"
          />
          <div class="dashboard-catalog-filter-wrap">
            <label for="userMgmtRoleFilter">Role</label>
            <select id="userMgmtRoleFilter" class="dashboard-catalog-filter" aria-label="Filter by role">
              <option value="all" ${userMgmtRoleFilter === "all" ? "selected" : ""}>All Roles</option>
              <option value="Customer" ${userMgmtRoleFilter === "Customer" ? "selected" : ""}>Customer</option>
              <option value="Stockist" ${userMgmtRoleFilter === "Stockist" ? "selected" : ""}>Stockist</option>
              <option value="Superstockist" ${userMgmtRoleFilter === "Superstockist" ? "selected" : ""}>Superstockist</option>
              <option value="Admin" ${userMgmtRoleFilter === "Admin" ? "selected" : ""}>Admin</option>
            </select>
          </div>
        </div>

        <div class="dashboard-table-wrap">
          <table class="dashboard-table" aria-label="User management table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gmail ID</th>
                <th>Role</th>
                <th>Reference Number</th>
                <th>Service Area Pincode</th>
                <th>Commission %</th>
                <th>Update User</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              ${pageUsers.length === 0 ? `<tr><td colspan="9" class="dashboard-table-empty">No users match your search.</td></tr>` : pageUsers
                .map(
                  (user) => {
                    const hasCommission = ["Superstockist", "Stockist", "Dealer"].includes(user.role);
                    const commissionDisplay = hasCommission ? `${user.commission ?? 0}%` : "NA";
                    const refDisplay = ["Admin", "Superstockist", "Customer"].includes(user.role) ? "NA" : user.referenceNumber;
                    const serviceAreaPincodeDisplay = user.role === "Superstockist" ? (user.serviceAreaPincode ?? "NA") : "NA";
                    return `
                    <tr>
                      <td>${user.firstName}</td>
                      <td>${user.lastName}</td>
                      <td>${user.email}</td>
                      <td>${user.role}</td>
                      <td>${refDisplay}</td>
                      <td>${serviceAreaPincodeDisplay}</td>
                      <td>${commissionDisplay}</td>
                      <td>
                        <button type="button" class="dashboard-update-btn" data-update-user="${user.id}">Update</button>
                      </td>
                      <td>
                        <button type="button" class="dashboard-remove-btn" data-remove-user="${user.id}">Remove</button>
                      </td>
                    </tr>
                  `;
                  }
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="dashboard-catalog-pagination">
          <button type="button" class="page-btn" id="userPagePrev" ${userManagementPage === 1 ? "disabled" : ""}>Prev</button>
          <span class="page-indicator">Page ${userManagementPage} / ${totalUserPages}</span>
          <button type="button" class="page-btn" id="userPageNext" ${userManagementPage === totalUserPages ? "disabled" : ""}>Next</button>
        </div>
      `;

      const userSearchInput = document.getElementById("userMgmtSearch");
      const userRoleFilterInput = document.getElementById("userMgmtRoleFilter");

      if (userSearchInput) {
        userSearchInput.addEventListener("input", (e) => {
          userMgmtSearchTerm = e.target.value;
          userManagementPage = 1;
          renderPanelBody();
        });
      }

      if (userRoleFilterInput) {
        userRoleFilterInput.addEventListener("change", (e) => {
          userMgmtRoleFilter = e.target.value;
          userManagementPage = 1;
          renderPanelBody();
        });
      }

      const removeButtons = contentBody.querySelectorAll("[data-remove-user]");
      const updateButtons = contentBody.querySelectorAll("[data-update-user]");

      updateButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const userId = button.getAttribute("data-update-user");
          if (!userId) return;
          openUserRoleModal(userId);
        });
      });

      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const userId = button.getAttribute("data-remove-user");
          if (!userId) return;
          const user = mockUsers.find((item) => item.id === userId);
          const userLabel = user ? `${user.firstName} ${user.lastName}` : "this user";
          openDeleteModal(
            "Warning",
            `You are about to remove ${userLabel}. Click Proceed to continue to final confirmation.`,
            () => {
              mockUsers = mockUsers.filter((item) => item.id !== userId);
              renderPanelBody();
            }
          );
        });
      });

      const userPrevBtn = document.getElementById("userPagePrev");
      const userNextBtn = document.getElementById("userPageNext");

      if (userPrevBtn) {
        userPrevBtn.addEventListener("click", () => {
          userManagementPage = Math.max(1, userManagementPage - 1);
          renderPanelBody();
        });
      }

      if (userNextBtn) {
        userNextBtn.addEventListener("click", () => {
          userManagementPage = Math.min(totalUserPages, userManagementPage + 1);
          renderPanelBody();
        });
      }

      return;
    }

    if (activeRole === "admin" && activeMenuItem === "View Orders") {
      const orderQuery = adminOrderSearchTerm.trim().toLowerCase();
      const filteredOrders = mockDashboardOrders.filter((order) => {
        const matchesSearch = !orderQuery
          || order.id.toLowerCase().includes(orderQuery)
          || `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(orderQuery)
          || order.customer.email.toLowerCase().includes(orderQuery);
        const matchesFilter = adminOrderFilterValue === "all"
          || (adminOrderFilterValue === "guest" && Boolean(order.isGuest));
        return matchesSearch && matchesFilter;
      });

      contentBody.innerHTML = `
        <div class="dashboard-catalog-controls">
          <input
            id="adminOrderSearch"
            class="dashboard-catalog-search"
            type="search"
            placeholder="Search by order ID, customer, or email"
            value="${adminOrderSearchTerm}"
            aria-label="Search admin orders"
          />
          <div class="dashboard-catalog-filter-wrap">
            <label for="adminOrderFilter">Filter</label>
            <select id="adminOrderFilter" class="dashboard-catalog-filter" aria-label="Filter admin orders">
              <option value="all" ${adminOrderFilterValue === "all" ? "selected" : ""}>All Orders</option>
              <option value="guest" ${adminOrderFilterValue === "guest" ? "selected" : ""}>Guest Orders</option>
            </select>
          </div>
        </div>
        <div id="adminOrdersTarget"></div>
      `;

      const adminOrderSearch = document.getElementById("adminOrderSearch");
      const adminOrderFilter = document.getElementById("adminOrderFilter");
      const adminOrdersTarget = document.getElementById("adminOrdersTarget");

      if (adminOrderSearch) {
        adminOrderSearch.addEventListener("input", (event) => {
          adminOrderSearchTerm = event.target.value;
          renderPanelBody();
        });
      }

      if (adminOrderFilter) {
        adminOrderFilter.addEventListener("change", (event) => {
          adminOrderFilterValue = event.target.value;
          renderPanelBody();
        });
      }

      renderOrdersAccordion(filteredOrders, "No orders found.", {
        container: adminOrdersTarget,
        showOrderUpdateAction: true
      });
      return;
    }

    if (activeRole === "admin" && (activeMenuItem === "Earnings Summary" || activeMenuItem === "Analytics")) {
      renderAnalyticsPanel("admin");
      return;
    }

    if (activeRole === "superstockist" && activeMenuItem === "View Orders") {
      const superstockistReferenceId = roleReferenceIds.superstockist;
      const filteredOrders = mockDashboardOrders.filter(
        (order) => order.referenceIds.superstockistId === superstockistReferenceId
      );
      renderSuperstockistDispatchPanel(filteredOrders);

      return;
    }

    if (activeRole === "superstockist" && (activeMenuItem === "Earnings Summary" || activeMenuItem === "Analytics")) {
      renderAnalyticsPanel("superstockist");
      return;
    }

    if (activeRole === "superstockist" && activeMenuItem === "Invite Stockist or Dealers") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add Stockist or Dealer";

      contentBody.innerHTML = `
        <div class="dashboard-table-wrap">
          <table class="dashboard-table" aria-label="Stockist and dealer table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Stockist Reference ID</th>
                <th>Dealer Reference ID</th>
                <th>Gmail ID</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              ${mockStockistDealerUsers
                .map(
                  (user) => `
                    <tr>
                      <td>${user.firstName}</td>
                      <td>${user.lastName}</td>
                      <td>${user.stockistReferenceId || "-"}</td>
                      <td>${user.dealerReferenceId || "-"}</td>
                      <td>${user.email}</td>
                      <td>
                        <button type="button" class="dashboard-remove-btn" data-remove-sd-user="${user.id}">Remove</button>
                      </td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      const removeButtons = contentBody.querySelectorAll("[data-remove-sd-user]");
      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const userId = button.getAttribute("data-remove-sd-user");
          if (!userId) return;
          const user = mockStockistDealerUsers.find((item) => item.id === userId);
          const userLabel = user ? `${user.firstName} ${user.lastName}` : "this user";
          openDeleteModal(
            "Warning",
            `You are about to remove ${userLabel}. Click Proceed to continue to final confirmation.`,
            () => {
              mockStockistDealerUsers = mockStockistDealerUsers.filter((item) => item.id !== userId);
              renderPanelBody();
            }
          );
        });
      });

      return;
    }

    if (activeRole === "stockist" && activeMenuItem === "Invite Dealer") {
      primaryActionBtn.hidden = false;
      primaryActionBtn.textContent = "+ Add Dealer";

      contentBody.innerHTML = `
        <div class="dashboard-table-wrap">
          <table class="dashboard-table" aria-label="Dealer invite table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Stockist Reference ID</th>
                <th>Dealer Reference ID</th>
                <th>Gmail ID</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              ${mockDealerUsers
                .map(
                  (user) => `
                    <tr>
                      <td>${user.firstName}</td>
                      <td>${user.lastName}</td>
                      <td>${user.stockistReferenceId || "-"}</td>
                      <td>${user.dealerReferenceId || "-"}</td>
                      <td>${user.email}</td>
                      <td>
                        <button type="button" class="dashboard-remove-btn" data-remove-dealer-user="${user.id}">Remove</button>
                      </td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      const removeButtons = contentBody.querySelectorAll("[data-remove-dealer-user]");
      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const userId = button.getAttribute("data-remove-dealer-user");
          if (!userId) return;
          const user = mockDealerUsers.find((item) => item.id === userId);
          const userLabel = user ? `${user.firstName} ${user.lastName}` : "this user";
          openDeleteModal(
            "Warning",
            `You are about to remove ${userLabel}. Click Proceed to continue to final confirmation.`,
            () => {
              mockDealerUsers = mockDealerUsers.filter((item) => item.id !== userId);
              renderPanelBody();
            }
          );
        });
      });

      return;
    }

    if (activeRole === "stockist" && activeMenuItem === "View Orders") {
      const stockistReferenceId = roleReferenceIds.stockist;
      const filteredOrders = mockDashboardOrders.filter(
        (order) => order.referenceIds.stockistId === stockistReferenceId
      );
      renderOrdersAccordion(filteredOrders, "No orders found for your Stockist reference ID.");
      return;
    }

    if (activeRole === "stockist" && (activeMenuItem === "Earnings Summary" || activeMenuItem === "Analytics")) {
      renderAnalyticsPanel("stockist");
      return;
    }

    if (activeRole === "dealer" && activeMenuItem === "View Orders") {
      const dealerReferenceId = roleReferenceIds.dealer;
      const filteredOrders = mockDashboardOrders.filter(
        (order) => order.referenceIds.dealerId === dealerReferenceId
      );
      renderOrdersAccordion(filteredOrders, "No orders found for your Dealer reference ID.");
      return;
    }

    if (activeRole === "dealer" && (activeMenuItem === "Earnings Summary" || activeMenuItem === "Analytics")) {
      renderAnalyticsPanel("dealer");
      return;
    }

    primaryActionBtn.hidden = true;
    contentBody.innerHTML = `<p class="dashboard-placeholder">${activeMenuItem} section is ready for configuration.</p>`;
  };

  const setSelectedMenuItem = (itemName, label) => {
    activeMenuItem = itemName === "Analytics" ? "Earnings Summary" : itemName;

    const hideHeaderForAdminView =
      (activeRole === "admin" && (activeMenuItem === "Manage Product Catalog" || activeMenuItem === "User Management" || activeMenuItem === "View Orders" || activeMenuItem === "Earnings Summary"))
      || (activeRole === "superstockist" && (activeMenuItem === "Invite Stockist or Dealers" || activeMenuItem === "View Orders" || activeMenuItem === "Earnings Summary"))
      || (activeRole === "stockist" && (activeMenuItem === "Invite Dealer" || activeMenuItem === "View Orders" || activeMenuItem === "Earnings Summary"))
      || (activeRole === "dealer" && (activeMenuItem === "View Orders" || activeMenuItem === "Earnings Summary"));

    if (hideHeaderForAdminView) {
      contentTitle.textContent = "";
      contentCopy.textContent = "";
      contentTitle.hidden = true;
      contentCopy.hidden = true;
    } else {
      contentTitle.hidden = false;
      contentCopy.hidden = false;
      contentTitle.textContent = activeMenuItem;
      contentCopy.textContent = `${label} panel: ${activeMenuItem}.`;
    }

    const allMenuButtons = sidebarMenu.querySelectorAll(".dashboard-menu-btn");
    allMenuButtons.forEach((button) => {
      const isActive = button.dataset.menuItem === activeMenuItem || (activeMenuItem === "Earnings Summary" && button.dataset.menuItem === "Analytics");
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    renderPanelBody();
  };

  const setRole = (role) => {
    activeRole = role;
    const menuItems = roleMenuItems[role] ?? [];
    const label = roleLabel[role] ?? "Dashboard";

    sidebarTitle.textContent = label;
    if (sidebarRefChip) {
      const referenceId = roleReferenceIds[role];
      if (referenceId && role !== "superstockist") {
        sidebarRefChip.textContent = `Your reference number: ${referenceId}`;
        sidebarRefChip.hidden = false;
      } else {
        sidebarRefChip.textContent = "";
        sidebarRefChip.hidden = true;
      }
    }
    contentTitle.textContent = `${label} Workspace`;
    contentCopy.textContent = `Use the ${label.toLowerCase()} tools from the left sidebar.`;

    sidebarMenu.innerHTML = menuItems
      .map((item) => `<li><button type="button" class="dashboard-menu-btn" data-menu-item="${item}">${item}</button></li>`)
      .join("");

    const menuButtons = sidebarMenu.querySelectorAll(".dashboard-menu-btn");
    menuButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedItem = button.dataset.menuItem;
        if (!selectedItem) return;
        setSelectedMenuItem(selectedItem, label);
      });
    });

    if (menuItems.length > 0) {
      const defaultMenuItem = roleDefaultMenuItems[role] && menuItems.includes(roleDefaultMenuItems[role])
        ? roleDefaultMenuItems[role]
        : menuItems[0];
      setSelectedMenuItem(defaultMenuItem, label);
    } else {
      contentBody.innerHTML = "";
      primaryActionBtn.hidden = true;
    }

    roleTabs.forEach((tab) => {
      const isActive = tab.dataset.dashboardRole === role;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  primaryActionBtn.addEventListener("click", () => {
    if (activeRole === "admin" && activeMenuItem === "Manage Product Catalog") {
      openEditorModal();
      return;
    }

    if (activeRole === "admin" && activeMenuItem === "User Management") {
      openUserModal();
      return;
    }

    if (activeRole === "superstockist" && activeMenuItem === "Invite Stockist or Dealers") {
      openStockistDealerFormModal();
      return;
    }

    if (activeRole === "stockist" && activeMenuItem === "Invite Dealer") {
      openDealerFormModal();
    }
  });

  if (productEditorModal) {
    productEditorModal.addEventListener("click", (event) => {
      if (event.target === productEditorModal) closeEditorModal();
    });
  }

  if (userEditorModal) {
    userEditorModal.addEventListener("click", (event) => {
      if (event.target === userEditorModal) closeUserModal();
    });
  }

  if (userRoleEditorModal) {
    userRoleEditorModal.addEventListener("click", (event) => {
      if (event.target === userRoleEditorModal) closeUserRoleModal();
    });
  }

  if (stockistDealerModal) {
    stockistDealerModal.addEventListener("click", (event) => {
      if (event.target === stockistDealerModal) closeStockistDealerFormModal();
    });
  }

  if (dealerInviteModal) {
    dealerInviteModal.addEventListener("click", (event) => {
      if (event.target === dealerInviteModal) closeDealerFormModal();
    });
  }

  if (dispatchCompleteModal) {
    dispatchCompleteModal.addEventListener("click", (event) => {
      if (event.target === dispatchCompleteModal) closeDispatchCompleteFormModal();
    });
  }

  if (deleteConfirmModal) {
    deleteConfirmModal.addEventListener("click", (event) => {
      if (event.target === deleteConfirmModal) closeDeleteModal();
    });
  }

  if (orderUpdateModal) {
    orderUpdateModal.addEventListener("click", (event) => {
      if (event.target === orderUpdateModal) closeOrderUpdateFormModal();
    });
  }

  if (closeProductEditor) {
    closeProductEditor.addEventListener("click", closeEditorModal);
  }

  if (cancelProductEditor) {
    cancelProductEditor.addEventListener("click", closeEditorModal);
  }

  if (closeUserEditor) {
    closeUserEditor.addEventListener("click", closeUserModal);
  }

  if (cancelUserEditor) {
    cancelUserEditor.addEventListener("click", closeUserModal);
  }

  if (closeUserRoleEditor) {
    closeUserRoleEditor.addEventListener("click", closeUserRoleModal);
  }

  if (cancelUserRoleEditor) {
    cancelUserRoleEditor.addEventListener("click", closeUserRoleModal);
  }

  if (closeStockistDealerModal) {
    closeStockistDealerModal.addEventListener("click", closeStockistDealerFormModal);
  }

  if (cancelStockistDealerModal) {
    cancelStockistDealerModal.addEventListener("click", closeStockistDealerFormModal);
  }

  if (closeDealerInviteModal) {
    closeDealerInviteModal.addEventListener("click", closeDealerFormModal);
  }

  if (cancelDealerInviteModal) {
    cancelDealerInviteModal.addEventListener("click", closeDealerFormModal);
  }

  if (closeDispatchCompleteModal) {
    closeDispatchCompleteModal.addEventListener("click", closeDispatchCompleteFormModal);
  }

  if (cancelDispatchCompleteModal) {
    cancelDispatchCompleteModal.addEventListener("click", closeDispatchCompleteFormModal);
  }

  if (closeDeleteConfirmModal) {
    closeDeleteConfirmModal.addEventListener("click", closeDeleteModal);
  }

  if (cancelDeleteConfirmModal) {
    cancelDeleteConfirmModal.addEventListener("click", closeDeleteModal);
  }

  if (closeOrderUpdateModal) {
    closeOrderUpdateModal.addEventListener("click", closeOrderUpdateFormModal);
  }

  if (cancelOrderUpdateModal) {
    cancelOrderUpdateModal.addEventListener("click", closeOrderUpdateFormModal);
  }

  if (confirmDeleteConfirmModal) {
    confirmDeleteConfirmModal.addEventListener("click", () => {
      if (typeof pendingDeleteAction === "function") {
        pendingDeleteAction();
      }
      closeDeleteModal();
    });
  }

  if (productEditorForm) {
    if (mockUploadBtn) {
      mockUploadBtn.addEventListener("click", () => {
        const titleInput = document.getElementById("editorTitle");
        const categoryInput = document.getElementById("editorCategory");
        const imageInput = document.getElementById("editorImage");
        if (!imageInput) return;

        const titleValue = String(titleInput?.value ?? "Product").trim() || "Product";
        const categoryValue = String(categoryInput?.value ?? "grains").trim() || "grains";
        const generatedImage = createGroceryImage(titleValue, categoryValue, "#e8f0e3", "#8fb57d");

        imageInput.value = generatedImage;
        if (mockUploadFileName) {
          mockUploadFileName.textContent = getImageFileName(generatedImage);
        }
      });
    }

    productEditorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(productEditorForm);
      const title = String(formData.get("title") ?? "").trim();
      const category = String(formData.get("category") ?? "grains").trim();
      const description = String(formData.get("description") ?? "").trim();
      const mrp = Number(formData.get("mrp"));
      const discountedPrice = Number(formData.get("discountedPrice"));
      const stockCount = Number(formData.get("stockCount"));
      const customImage = String(formData.get("image") ?? "").trim();

      if (!title || !description || Number.isNaN(mrp) || Number.isNaN(discountedPrice) || Number.isNaN(stockCount) || mrp <= 0 || discountedPrice <= 0 || discountedPrice >= mrp || stockCount < 0) {
        return;
      }

      const fallbackImage = createGroceryImage(title, category, "#e8f0e3", "#8fb57d");
      const finalImage = customImage || fallbackImage;

      if (editingProductId) {
        const existingProduct = products.find((product) => product.id === editingProductId);
        if (existingProduct) {
          existingProduct.title = title;
          existingProduct.category = category;
          existingProduct.description = description;
          existingProduct.mrp = mrp;
          existingProduct.price = discountedPrice;
          existingProduct.stockCount = Math.floor(stockCount);
          existingProduct.image = finalImage;
        }
      } else {
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        let newId = baseSlug || "product";
        let duplicateCounter = 2;
        while (products.some((product) => product.id === newId)) {
          newId = `${baseSlug || "product"}-${duplicateCounter}`;
          duplicateCounter += 1;
        }

        products.push({
          id: newId,
          title,
          category,
          description,
          mrp,
          price: discountedPrice,
          stockCount: Math.floor(stockCount),
          image: finalImage
        });
      }

      closeEditorModal();
      renderPanelBody();
    });
  }

  if (userEditorForm) {
    const userRoleSelect = document.getElementById("userRole");
    const userReferenceRow = document.getElementById("userReferenceRow");
    const userPincodeRow = document.getElementById("userPincodeRow");
    const userPincodeInput = document.getElementById("userServiceAreaPincode");
    const userCommissionRow = document.getElementById("userCommissionRow");
    const userCommissionInput = document.getElementById("userCommission");

    const rolesWithoutRef = ["Admin", "Customer", "Superstockist"];
    const commissionRoles = ["Superstockist", "Stockist", "Dealer"];

    const toggleRoleDependentRows = (role) => {
      if (!userReferenceRow) return;
      userReferenceRow.hidden = rolesWithoutRef.includes(role);
      const needsPincode = role === "Superstockist";
      const needsCommission = commissionRoles.includes(role);
      if (userPincodeRow) userPincodeRow.hidden = !needsPincode;
      if (userPincodeInput) userPincodeInput.required = needsPincode;
      if (userCommissionRow) userCommissionRow.hidden = !needsCommission;
      if (userCommissionInput) userCommissionInput.required = needsCommission;
    };

    if (userRoleSelect) {
      userRoleSelect.addEventListener("change", () => {
        toggleRoleDependentRows(userRoleSelect.value);
      });
      toggleRoleDependentRows(userRoleSelect.value);
    }

    userEditorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(userEditorForm);
      const firstName = String(formData.get("firstName") ?? "").trim();
      const lastName = String(formData.get("lastName") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const role = String(formData.get("role") ?? "Stockist").trim();
      const referenceNumber = rolesWithoutRef.includes(role)
        ? "NA"
        : String(formData.get("referenceNumber") ?? "").trim();
      const serviceAreaPincode = role === "Superstockist"
        ? String(formData.get("serviceAreaPincode") ?? "").trim()
        : "";
      const commission = commissionRoles.includes(role)
        ? Number(formData.get("commission"))
        : null;

      if (!firstName || !lastName || !email) return;
      if (!rolesWithoutRef.includes(role) && !referenceNumber) return;
      if (role === "Superstockist" && !serviceAreaPincode) return;
      if (commissionRoles.includes(role) && (Number.isNaN(commission) || commission < 0 || commission > 100)) return;

      const newId = `usr-${Date.now()}`;
      const newUser = {
        id: newId,
        firstName,
        lastName,
        email,
        role,
        referenceNumber
      };
      if (role === "Superstockist") {
        newUser.serviceAreaPincode = serviceAreaPincode;
      }
      if (commissionRoles.includes(role)) {
        newUser.commission = commission;
      }

      mockUsers.unshift(newUser);

      userManagementPage = 1;
      closeUserModal();
      renderPanelBody();
    });
  }

  if (userRoleEditorForm) {
    userRoleEditorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(userRoleEditorForm);
      const userId = String(formData.get("userId") ?? editingUserId ?? "").trim();
      if (!userId) return;

      const matchedUser = mockUsers.find((user) => user.id === userId);
      if (!matchedUser) return;

      let role = String(formData.get("role") ?? "").trim();
      if (!role) role = matchedUser.role;

      const commissionRoles = ["Superstockist", "Stockist", "Dealer"];
      const commission = commissionRoles.includes(role)
        ? Number(formData.get("commission"))
        : null;
      const serviceAreaPincode = role === "Superstockist"
        ? String(formData.get("serviceAreaPincode") ?? "").trim()
        : "";

      if (commissionRoles.includes(role) && (Number.isNaN(commission) || commission < 0 || commission > 100)) return;
      if (role === "Superstockist" && !serviceAreaPincode) return;

      matchedUser.role = role;
      if (commissionRoles.includes(role)) {
        matchedUser.commission = commission;
      } else {
        delete matchedUser.commission;
      }

      if (role === "Superstockist") {
        matchedUser.serviceAreaPincode = serviceAreaPincode;
      } else {
        delete matchedUser.serviceAreaPincode;
      }

      closeUserRoleModal();
      renderPanelBody();
    });
  }

  if (stockistDealerForm) {
    stockistDealerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(stockistDealerForm);
      const firstName = String(formData.get("firstName") ?? "").trim();
      const lastName = String(formData.get("lastName") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const type = String(formData.get("type") ?? "stockist").trim().toLowerCase();
      const referenceId = String(formData.get("referenceId") ?? "").trim();

      if (!firstName || !lastName || !email || !referenceId) return;

      const newEntry = {
        id: `sd-${Date.now()}`,
        firstName,
        lastName,
        email,
        type,
        stockistReferenceId: type === "stockist" ? referenceId : "-",
        dealerReferenceId: type === "dealer" ? referenceId : "-"
      };

      mockStockistDealerUsers.unshift(newEntry);
      closeStockistDealerFormModal();
      renderPanelBody();
    });
  }

  if (dealerInviteForm) {
    dealerInviteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(dealerInviteForm);
      const firstName = String(formData.get("firstName") ?? "").trim();
      const lastName = String(formData.get("lastName") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const stockistReferenceId = String(formData.get("stockistReferenceId") ?? "").trim();
      const dealerReferenceId = String(formData.get("dealerReferenceId") ?? "").trim();

      if (!firstName || !lastName || !email || !stockistReferenceId || !dealerReferenceId) return;

      mockDealerUsers.unshift({
        id: `dl-${Date.now()}`,
        firstName,
        lastName,
        email,
        stockistReferenceId,
        dealerReferenceId
      });

      closeDealerFormModal();
      renderPanelBody();
    });
  }

  if (dispatchCompleteForm) {
    dispatchCompleteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(dispatchCompleteForm);
      const orderId = String(formData.get("orderId") ?? "").trim();
      const comments = String(formData.get("comments") ?? "").trim();
      const dispatchStatus = String(formData.get("dispatchStatus") ?? "dispatched").trim().toLowerCase();
      const completedAt = String(formData.get("completedAt") ?? "").trim();

      if (!orderId) return;
      if (dispatchStatus === "dispatched" && !completedAt) return;

      const matchedOrder = mockDashboardOrders.find((order) => order.id === orderId);
      if (!matchedOrder) return;

      matchedOrder.dispatch = {
        status: dispatchStatus === "cancelled" ? "cancelled" : "dispatched",
        completedAt: dispatchStatus === "dispatched" ? completedAt : "",
        comments
      };
      matchedOrder.status = dispatchStatus === "cancelled" ? "Cancelled" : "Dispatched";

      closeDispatchCompleteFormModal();
      renderPanelBody();
    });
  }

  if (orderUpdateForm) {
    orderUpdateForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(orderUpdateForm);
      const orderId = String(formData.get("orderId") ?? "").trim();
      const superstockistRef = String(formData.get("superstockistRef") ?? "").trim();

      if (!orderId || !superstockistRef) return;

      const matchedOrder = mockDashboardOrders.find((order) => order.id === orderId);
      if (!matchedOrder) return;

      matchedOrder.referenceIds.superstockistId = superstockistRef;

      closeOrderUpdateFormModal();
      renderPanelBody();
    });
  }

  if (dispatchStatusSelect) {
    dispatchStatusSelect.addEventListener("change", () => {
      toggleDispatchDateTimeField(dispatchStatusSelect.value);
    });
  }

  roleTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const role = tab.dataset.dashboardRole;
      if (!role) return;
      setRole(role);
    });
  });

  setRole("admin");
}

function initHomePage() {
  if (!document.getElementById("productGrid")) return;
  restoreCart();
  setupCatalogSearch();
  setupCatalogFilter();
  renderProducts();
  products.forEach((product) => updateQtyBadge(product.id));
  renderCart();
  setupCheckoutButton();
  setupSlideshow();
}

setupProfileDropdown();
setupAuthUi();
initHomePage();
renderCheckoutPage();
renderOrdersPage();
renderDashboardPage();
