import { events } from "./data.js";

const list = document.querySelector("#etkinlik-listesi");
const filtreFormu = document.querySelector("#filtre-formu");
const aramaInput = document.querySelector("#arama");
const kategoriSelect = document.querySelector("#kategori-filtre");
const sonucSatiri = document.querySelector("#sonuc");

function formatTarih(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString("tr-TR", options);
}

function createCard(event) {
  return `
    <article class="kart">
      <h3>${event.title}</h3>
      <p>${event.category}<br>Tarih: ${formatTarih(event.date)}, ${event.time}<br>Yer: ${event.location}<br>Kontenjan: ${event.capacity || "Belirtilmemiş"} kişi</p>
      <p>${event.description}</p>
      <a href="etkinlik-detay.html?id=${event.id}">Detayları gör &rarr;</a>
    </article>
  `;
}

function render(dizi) {
  if (dizi.length === 0) {
    list.innerHTML = "";
    if (sonucSatiri) sonucSatiri.textContent = "Aramanıza uygun etkinlik bulunamadı.";
    return;
  }
  list.innerHTML = dizi.map(createCard).join("");
  if (sonucSatiri) sonucSatiri.textContent = `${dizi.length} etkinlik listeleniyor.`;
}

// Ana Sayfa (limit varsa)
if (list && list.dataset.limit) {
  const yaklasan = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, Number(list.dataset.limit));
  render(yaklasan);
} 
// Etkinlikler Sayfası
else if (list) {
  // Kategorileri dinamik oluştur
  if (kategoriSelect) {
    const kategoriler = new Set(events.map(e => e.category));
    kategoriler.forEach(kat => {
      const option = document.createElement("option");
      option.value = kat;
      option.textContent = kat;
      kategoriSelect.appendChild(option);
    });
  }

  // Başlangıç listelemesi
  render(events);

  // Filtreleme
  if (filtreFormu) {
    filtreFormu.addEventListener("submit", e => e.preventDefault());
    
    function filtrele() {
      const aranan = aramaInput.value.toLocaleLowerCase("tr-TR");
      const seciliKat = kategoriSelect.value;
      
      const sonuc = events.filter(e => {
        const metinUyuyor = e.title.toLocaleLowerCase("tr-TR").includes(aranan) || 
                            e.description.toLocaleLowerCase("tr-TR").includes(aranan) ||
                            e.category.toLocaleLowerCase("tr-TR").includes(aranan);
        const kategoriUyuyor = seciliKat === "" || e.category === seciliKat;
        return metinUyuyor && kategoriUyuyor;
      });
      render(sonuc);
    }

    aramaInput.addEventListener("input", filtrele);
    kategoriSelect.addEventListener("change", filtrele);
  }
}
