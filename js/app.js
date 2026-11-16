"use strict";

/**
 * Data Produk UMKM
 */
const produkUmkm = [
  { nama: "Arabika Gayo", kategori: "Kopi", harga: 85000, stok: 12, unggulan: true, diskonPersen: 10 },
  { nama: "Robusta Temanggung", kategori: "Kopi", harga: 65000, stok: 4, unggulan: false },
  { nama: "Paket Seduh", kategori: "Bundling", harga: 125000, stok: 0, unggulan: false },
  { nama: "Drip Bag Nusantara", kategori: "Kopi", harga: 45000, stok: 18, unggulan: false },
];

/**
 * Format angka menjadi mata uang Rupiah (IDR).
 */
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

/**
 * Menentukan label dan class badge berdasarkan jumlah stok.
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
 * Menghitung harga akhir setelah diskon jika produk memiliki diskonPersen valid.
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

/**
 * Menyusun ringkasan jumlah produk per kategori.
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
 * Seleksi target DOM untuk katalog produk dinamis.
 */
const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const produkUnggulanEl = document.querySelector("#produk-unggulan");
const kategoriRingkasanEl = document.querySelector("#kategori-ringkasan");
const tombolFilter = document.querySelectorAll("[data-filter]");
const tombolFilterStok = document.querySelectorAll("[data-stok]");

/**
 * State filter aktif.
 */
let kategoriTerpilih = "Semua";
let stokTerpilih = "Semua";

/**
 * Membuat elemen DOM kartu produk tanpa mencampur string HTML.
 */
function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  if (typeof produk.diskonPersen === "number" && produk.diskonPersen > 0) {
    const hargaFinal = hitungHargaPromo(produk);

    const promoPrice = document.createElement("span");
    promoPrice.classList.add("price-promo");
    promoPrice.textContent = formatRupiah(hargaFinal);

    const originalPrice = document.createElement("del");
    originalPrice.classList.add("price-original");
    originalPrice.textContent = formatRupiah(produk.harga);

    const discountBadge = document.createElement("span");
    discountBadge.classList.add("discount-badge");
    discountBadge.textContent = `-${produk.diskonPersen}%`;

    price.append(promoPrice, " ", originalPrice, " ", discountBadge);
  } else {
    price.textContent = formatRupiah(produk.harga);
  }

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
  });

  card.append(title, category, price, stock, removeButton);
  return card;
}

/**
 * Membuat elemen empty state ketika filter tidak menghasilkan produk.
 */
function buatEmptyState(kategori, stok = "Semua") {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  if (stok === "Semua") {
    empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  } else {
    empty.textContent = `Belum ada produk pada kategori ${kategori} dengan status stok "${stok}".`;
  }
  return empty;
}

/**
 * Merender daftar produk berdasarkan filter kategori dan filter stok aktif.
 */
function renderProduk(kategoriAktif = kategoriTerpilih, stokAktif = stokTerpilih) {
  kategoriTerpilih = kategoriAktif;
  stokTerpilih = stokAktif;

  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  console.log("Render kategori:", kategoriAktif, "stok:", stokAktif);

  const produkTampil = produkUmkm.filter((produk) => {
    const cocokKategori =
      kategoriAktif === "Semua" || produk.kategori === kategoriAktif;
    const infoStok = statusStok(produk.stok);
    const cocokStok =
      stokAktif === "Semua" || infoStok.label === stokAktif;

    return cocokKategori && cocokStok;
  });

  produkGrid.replaceChildren();

  if (produkUnggulanEl) {
    const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
    produkUnggulanEl.textContent = produkUnggulan
      ? `Produk unggulan: ${produkUnggulan.nama}`
      : "Belum ada produk unggulan.";
  }

  if (kategoriRingkasanEl) {
    kategoriRingkasanEl.textContent = `Ringkasan kategori: ${formatRingkasanKategori(produkUmkm)}`;
  }

  // Challenge: teks penghitung kategori aktif dinamis dan tetap benar saat hasil kosong
  const labelStatus =
    stokAktif === "Semua"
      ? `Kategori ${kategoriAktif} menampilkan ${produkTampil.length} produk dari ${produkUmkm.length} total produk.`
      : `Kategori ${kategoriAktif} (Stok: ${stokAktif}) menampilkan ${produkTampil.length} produk dari ${produkUmkm.length} total produk.`;

  produkStatus.textContent = labelStatus;

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif, stokAktif));
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });
}

/**
 * Pasang event listener untuk setiap tombol filter kategori.
 */
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori, stokTerpilih);
  });
});

/**
 * Pengayaan: Pasang event listener untuk setiap tombol filter status stok.
 */
tombolFilterStok.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const stok = tombolAktif.dataset.stok;

    tombolFilterStok.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategoriTerpilih, stok);
  });
});

if (produkGrid) {
  console.log("Ringkasan kategori:", formatRingkasanKategori(produkUmkm));
  console.table(produkUmkm);
}

renderProduk();
