"use strict";

const produkUmkm = [
  {
    nama: "Arabika Gayo",
    kategori: "Kopi",
    harga: 85000,
    stok: 12,
    unggulan: true,
    diskonPersen: 10,
    deskripsi: "Kopi beraroma floral dan asam segar khas dataran tinggi Gayo.",
  },
  {
    nama: "Robusta Temanggung",
    kategori: "Kopi",
    harga: 65000,
    stok: 4,
    unggulan: false,
    diskonPersen: 0,
    deskripsi: "Rasa cokelat karamel yang pekat dengan body kopi yang mantap.",
  },
  {
    nama: "Paket Seduh Rumahan",
    kategori: "Bundling",
    harga: 125000,
    stok: 0,
    unggulan: false,
    diskonPersen: 0,
    deskripsi: "Paket hemat alat drip praktis dan bubuk kopi untuk kebutuhan seduh harian.",
  },
  {
    nama: "Cold Brew Signature",
    kategori: "Kopi",
    harga: 35000,
    stok: 8,
    unggulan: true,
    diskonPersen: 0,
    deskripsi: "Seduh dingin 12 jam, rasa manis alami, lembut di lambung, dan siap minum.",
  },
];

console.table(produkUmkm);

const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi":
      return "Produk kopi pilihan";
    case "Bundling":
      return "Paket hemat";
    default:
      return "Produk UMKM";
  }
}

function hitungHargaDiskon(harga, diskonPersen) {
  if (typeof diskonPersen === "number" && diskonPersen > 0 && diskonPersen <= 100) {
    const nominalDiskon = (harga * diskonPersen) / 100;
    const hargaFinal = Math.round(harga - nominalDiskon);
    return Math.max(0, hargaFinal);
  }
  return harga;
}
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");

  if (!grid || !ringkasan) {
    return;
  }

  let jumlahTersedia = 0;
  let markup = "";

  for (const produk of produkUmkm) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);

    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

    const badgeUnggulanMarkup = produk.unggulan
      ? `<span class="featured-badge">Produk Unggulan</span>`
      : "";

    let hargaMarkup = "";
    if (produk.diskonPersen && produk.diskonPersen > 0) {
      const hargaPromo = hitungHargaDiskon(produk.harga, produk.diskonPersen);
      hargaMarkup = `
        <p class="price">
          <span class="price-promo">${formatRupiah.format(hargaPromo)}</span>
          <del class="price-original">${formatRupiah.format(produk.harga)}</del>
          <span class="discount-badge">-${produk.diskonPersen}%</span>
        </p>
      `;
    } else {
      hargaMarkup = `<p class="price">${formatRupiah.format(produk.harga)}</p>`;
    }

    if (produk.stok > 0) {
      jumlahTersedia = jumlahTersedia + 1;
    }

    markup = markup + `
      <article class="js-product-card">
        ${badgeUnggulanMarkup}
        <h3>${produk.nama}</h3>
        <p class="product-category">${kategori}</p>
        <p class="product-desc">${produk.deskripsi}</p>
        ${hargaMarkup}
        <div>
          <span class="stock-badge ${status.className}">${status.label}</span>
        </div>
        <p class="card-action">${labelAksi}</p>
      </article>
    `;
  }

  grid.innerHTML = markup;
  ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data lokal.`;
}

document.addEventListener("DOMContentLoaded", renderProduk);
