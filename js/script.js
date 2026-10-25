const promoButton = document.querySelector("#promoButton");

if (promoButton) {
    promoButton.addEventListener("click", () => {
        promoButton.textContent = "Beli 10 gratis 1!";
        promoButton.classList.add("is-promo");
        console.log("Selamat, Anda mendapatkan promo beli 10 gratis 1");
    });
  }

const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#menu-utama");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("is-open")) {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }
});