import { events } from "./data.js";

const container = document.querySelector("#detay");
const baslik = document.querySelector("#sayfa-baslik");
const id = new URLSearchParams(location.search).get("id");

const event = events.find(e => e.id === id);

function formatTarih(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString("tr-TR", options);
}

if (!event) {
  baslik.textContent = "Etkinlik bulunamadı";
  document.title = "Etkinlik bulunamadı";
  container.innerHTML = `
    <div class="hata-kutu">
      "${id || 'Bilinmeyen'}" numaralı bir etkinlik yok. Listeden bir etkinlik seçin.
    </div>
    <br>
    <a href="etkinlikler.html">&larr; Listeye dön</a>
  `;
} else {
  baslik.textContent = event.title;
  document.title = event.title;
  container.innerHTML = `
    <div class="detay-grid">
      <div class="gorsel-alani">
        <img src="afis.jpeg" alt="${event.title} Afişi" class="afis" onerror="this.src='https://via.placeholder.com/300x400?text=Afis+Gorseli'">
        <p>Şekil 1: ${event.title} afişi</p>
      </div>
      <div class="kunye-alani">
        <h2>Etkinlik Künyesi</h2>
        <dl>
          <dt>Tarih</dt>
          <dd>${formatTarih(event.date)}, ${event.time}</dd>
          
          <dt>Yer</dt>
          <dd>${event.location}</dd>
          
          <dt>Kategori</dt>
          <dd>${event.category}</dd>
          
          <dt>Kontenjan</dt>
          <dd>${event.capacity || "Belirtilmemiş"} kişi</dd>
        </dl>
        <p><strong>Açıklama:</strong> ${event.description}</p>
        <br>
        <a href="etkinlikler.html">&larr; Listeye dön</a> | 
        <a href="etkinlik-guncelle.html?id=${event.id}">Bu etkinliği güncelle</a>
      </div>
    </div>
  `;
}
