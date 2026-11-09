"use strict";

/**
 * . Data Produk UMKM
 */
const produkUmkm = [
  { nama: "Arabika Gayo", kategori: "Kopi", harga: 85000, stok: 12, unggulan: true, diskonPersen: 10 },
  { nama: "Robusta Temanggung", kategori: "Kopi", harga: 65000, stok: 4, unggulan: false },
  { nama: "Paket Seduh", kategori: "Bundling", harga: 125000, stok: 0, unggulan: false },
  { nama: "Drip Bag Nusantara", kategori: "Kopi", harga: 45000, stok: 18, unggulan: false },
];

/**
 Function formatRupiah
 */
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

/**
 * Function statusStok
 */
function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "warning" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

/**
 Function hitungHargaPromo
 */
function hitungHargaPromo(produk) {
  if (
    typeof produk.diskonPersen === "number" &&
    produk.diskonPersen > 0 &&
    produk.diskonPersen <= 100
  ) {
    const nominalDiskon = (produk.harga * produk.diskonPersen) / 100;
    const hargaSetelahDiskon = Math.round(produk.harga - nominalDiskon);
    return Math.max(0, hargaSetelahDiskon);
  }
  return produk.harga;
}

/**Function formatRingkasanKategori
 */
function formatRingkasanKategori(daftarProduk) {
  const hitungan = daftarProduk.reduce((akumulator, produk) => {
    akumulator[produk.kategori] = (akumulator[produk.kategori] || 0) + 1;
    return akumulator;
  }, {});

  return Object.entries(hitungan)
    .map(([kategori, jumlah]) => `${kategori}: ${jumlah} produk`)
    .join(", ");
}

/**
 * 5. Function buatKartuProduk
 */
function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const hargaFinal = hitungHargaPromo(produk);

  let hargaMarkup = "";
  if (produk.diskonPersen && produk.diskonPersen > 0) {
    hargaMarkup = `
      <p class="price">
        <span class="price-promo">${formatRupiah(hargaFinal)}</span>
        <del class="price-original">${formatRupiah(produk.harga)}</del>
        <span class="discount-badge">-${produk.diskonPersen}%</span>
      </p>
    `;
  } else {
    hargaMarkup = `<p class="price">${formatRupiah(produk.harga)}</p>`;
  }

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p class="category-note">${produk.kategori}</p>
      ${hargaMarkup}
      <span class="stock-badge ${status.className}">${status.label}</span>
    </article>
  `;
}

/**
 *  Debugging terarah menggunakan forEach sebelum render
 */
produkUmkm.forEach((produk) => {
  console.log("Debug produk:", produk.nama, "stok:", produk.stok);
});

/**
 *  Function renderProduk
 */
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");
  const kategoriEl = document.querySelector("#kategori-ringkasan");

  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  // Array method: filter (mengambil hanya produk dengan stok > 0)
  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);

  // Array method: find (mengambil satu produk unggulan pertama)
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);

  // Array method: map (mengonversi setiap produk menjadi string HTML) & join("")
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");

  // Update DOM
  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";

  if (kategoriEl) {
    kategoriEl.textContent = `Ringkasan kategori: ${formatRingkasanKategori(produkUmkm)}`;
  }

  // Debugging log & table
  console.log("Ringkasan kategori:", formatRingkasanKategori(produkUmkm));
  console.table(produkUmkm);
}

document.addEventListener("DOMContentLoaded", renderProduk);
