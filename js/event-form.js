import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const mesajDiv = document.querySelector("#form-mesaj");

if (form) {
  // Güncelleme Modu Kontrolü
  if (form.dataset.mode === "guncelle") {
    const id = new URLSearchParams(location.search).get("id");
    const etkinlik = events.find(e => e.id === id);

    if (etkinlik) {
      form.elements.ad.value = etkinlik.title;
      form.elements.kategori.value = etkinlik.category;
      form.elements.tarih.value = etkinlik.date;
      form.elements.saat.value = etkinlik.time;
      form.elements.yer.value = etkinlik.location;
      form.elements.kontenjan.value = etkinlik.capacity;
      form.elements.aciklama.value = etkinlik.description;
    } else {
      form.outerHTML = `
        <div class="hata-kutu">
          Güncellenecek etkinlik seçilmedi. Önce listeden bir etkinlik seçin, detay sayfasındaki "Bu etkinliği güncelle" butonunu kullanın.
        </div>
        <br>
        <a href="etkinlikler.html">Etkinliklere git &rarr;</a>
      `;
    }
  }

  // Form Gönderimi ve Doğrulama
  if (document.querySelector("#etkinlik-formu")) {
    document.querySelector("#etkinlik-formu").addEventListener("submit", (e) => {
      e.preventDefault();
      
      const fd = new FormData(form);
      const data = {
        title: fd.get("ad").trim(),
        category: fd.get("kategori"),
        date: fd.get("tarih"),
        time: fd.get("saat"),
        location: fd.get("yer").trim(),
        capacity: fd.get("kontenjan") ? Number(fd.get("kontenjan")) : null,
        description: fd.get("aciklama").trim()
      };

      const errors = {};

      // Doğrulama kuralları
      if (data.title.length < 3) errors.ad = "Etkinlik adı en az 3 karakter olmalı.";
      if (!data.category) errors.kategori = "Bir kategori seçin.";
      if (!data.date) errors.tarih = "Tarih seçin.";
      if (!data.time) errors.saat = "Saat seçin.";
      if (!data.location) errors.yer = "Yer bilgisini yazın.";
      if (data.capacity !== null && (data.capacity < 1 || data.capacity > 1000)) {
        errors.kontenjan = "Kontenjan 1 ile 1000 arasında olmalıdır.";
      }

      // Hata mesajlarını temizle
      form.querySelectorAll(".hata-mesaji").forEach(el => el.textContent = "");
      form.querySelectorAll("input, select, textarea").forEach(el => el.removeAttribute("aria-invalid"));
      mesajDiv.innerHTML = "";

      // Hataları ekrana bas
      if (Object.keys(errors).length > 0) {
        for (const [key, msg] of Object.entries(errors)) {
          const alan = form.elements[key];
          if (alan) {
            alan.setAttribute("aria-invalid", "true");
            document.querySelector(`#${key}-hata`).textContent = msg;
          }
        }
        mesajDiv.innerHTML = `<div class="hata-kutu">Formda hatalı alanlar var, lütfen kontrol edin.</div>`;
        return;
      }

      // Başarılı
      data.id = form.dataset.mode === "guncelle" 
        ? new URLSearchParams(location.search).get("id") 
        : "event-" + (events.length + 1);

      mesajDiv.innerHTML = `
        <div class="basari-kutu">
          Etkinlik ${form.dataset.mode === "guncelle" ? "güncellendi" : "oluşturuldu"} (bu sprintte veri kalıcı olarak kaydedilmez):
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      `;
    });
  }
}
