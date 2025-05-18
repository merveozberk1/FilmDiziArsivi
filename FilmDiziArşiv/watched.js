// İzlediklerim (Watched) Sayfası JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log("İzlediklerim sayfası yükleniyor...");
    
    // DOM Referansları
    const watchedGrid = document.getElementById('watchedGrid');
    const emptyWatchedState = document.getElementById('emptyWatchedState');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const sortSelect = document.getElementById('sortSelect');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalWatchedElement = document.getElementById('totalWatched');
    const totalMoviesElement = document.getElementById('totalMovies');
    const totalSeriesElement = document.getElementById('totalSeries');
    const avgRatingElement = document.getElementById('avgRating');
    const detailModal = document.getElementById('detailModal');
    const closeButtons = document.querySelectorAll('.close');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const generateRecommendationQRBtn = document.getElementById('generateRecommendationQR');
    const closeQrCodeBtn = document.getElementById('closeQrCode');
    const removeFromWatchedBtn = document.getElementById('removeFromWatched');
    
    // Değişkenler
    let watchedItems = [];
    let currentFilter = 'all';
    let currentSortBy = 'date-desc';
    let currentDetailId = null;
    
    // Tüm izlenen içerikleri yükle
    function loadWatchedContent() {
        DB.init()
            .then(() => DB.getAllWatched())
            .then(items => {
                watchedItems = items;
                console.log(`${items.length} izlenen içerik yüklendi.`);
                
                if (items.length === 0) {
                    showEmptyState();
                } else {
                    hideEmptyState();
                    updateStatistics(items);
                    renderWatchedGrid(items);
                }
            })
            .catch(error => {
                console.error('İzlenen içerikleri yükleme hatası:', error);
                showEmptyState();
            });
    }
    
    // İçerikleri görüntüle
    function renderWatchedGrid(items) {
        // Filtre ve sıralama uygula
        const filteredItems = applyFilter(items, currentFilter);
        const sortedItems = applySorting(filteredItems, currentSortBy);
        
        // Grid'i temizle
        watchedGrid.innerHTML = '';
        
        // İçerik yoksa boş durum göster
        if (sortedItems.length === 0) {
            watchedGrid.innerHTML = `
                <div class="empty-filter-result">
                    <p>Bu filtreye uygun izlenen içerik bulunmamaktadır.</p>
                </div>
            `;
            return;
        }
        
        // Her bir içerik için kart oluştur
        sortedItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'content-card watched-item';
            card.dataset.id = item.id;
            
            // İzleme tarihi
            const watchedDate = new Date(item.watchedDate);
            const formattedDate = watchedDate.toLocaleDateString('tr-TR', {
                year: 'numeric', 
                month: 'short', 
                day: 'numeric'
            });
            
            // Yıldız ikonları ile puanlama
            const ratingStars = Array(5).fill(0).map((_, index) => {
                return `<i class="fas fa-star ${index < item.watchedRating ? 'active' : ''}"></i>`;
            }).join('');
            
            card.innerHTML = `
                <div class="card-poster">
                    <img src="${item.imageUrl || 'https://via.placeholder.com/300x450/152642/ffffff?text=Poster+Yok'}" alt="${item.title}">
                    <div class="card-overlay">
                        <button class="watch-button" data-id="${item.id}" aria-label="İçerik Detayı">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                    <div class="watched-badge">İzlendi</div>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">${item.year} • ${item.type === 'movie' ? 'Film' : 'Dizi'}</div>
                    <div class="rating-date">
                        <div class="rating">${ratingStars}</div>
                        <div class="watched-date">${formattedDate}</div>
                    </div>
                </div>
            `;
            
            watchedGrid.appendChild(card);
            
            // İçerik detayı için olay ekle
            card.querySelector('.watch-button').addEventListener('click', function() {
                openDetailModal(this.dataset.id);
            });
        });
    }
    
    // İstatistikleri güncelle
    function updateStatistics(items) {
        const totalWatched = items.length;
        const movies = items.filter(item => item.type === 'movie').length;
        const series = items.filter(item => item.type === 'series').length;
        
        // Ortalama puanı hesapla
        let totalRating = 0;
        items.forEach(item => {
            totalRating += item.watchedRating || 0;
        });
        const avgRating = totalWatched > 0 ? (totalRating / totalWatched).toFixed(1) : '0.0';
        
        // İstatistikleri güncelle
        totalWatchedElement.textContent = totalWatched;
        totalMoviesElement.textContent = movies;
        totalSeriesElement.textContent = series;
        avgRatingElement.textContent = avgRating;
    }
    
    // Filtre uygula
    function applyFilter(items, filter) {
        if (filter === 'all') return items;
        return items.filter(item => item.type === filter);
    }
    
    // Sıralama uygula
    function applySorting(items, sortBy) {
        const sortedItems = [...items];
        
        switch(sortBy) {
            case 'date-desc': // Yeni-Eski
                sortedItems.sort((a, b) => new Date(b.watchedDate) - new Date(a.watchedDate));
                break;
            case 'date-asc': // Eski-Yeni
                sortedItems.sort((a, b) => new Date(a.watchedDate) - new Date(b.watchedDate));
                break;
            case 'rating-desc': // Puan (Yüksek-Düşük)
                sortedItems.sort((a, b) => (b.watchedRating || 0) - (a.watchedRating || 0));
                break;
            case 'rating-asc': // Puan (Düşük-Yüksek)
                sortedItems.sort((a, b) => (a.watchedRating || 0) - (b.watchedRating || 0));
                break;
        }
        
        return sortedItems;
    }
    
    // Boş durumu göster
    function showEmptyState() {
        emptyWatchedState.style.display = 'flex';
        watchedGrid.style.display = 'none';
    }
    
    // Boş durumu gizle
    function hideEmptyState() {
        emptyWatchedState.style.display = 'none';
        watchedGrid.style.display = 'grid';
    }
    
    // Arama işlevi
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length === 0) {
            // Tüm içerikleri göster
            renderWatchedGrid(watchedItems);
            return;
        }
        
        // İçeriklerde ara
        const searchResults = watchedItems.filter(item => {
            return (
                item.title.toLowerCase().includes(query) ||
                (item.director && item.director.toLowerCase().includes(query)) ||
                (item.genre && item.genre.toLowerCase().includes(query)) ||
                (item.watchedNotes && item.watchedNotes.toLowerCase().includes(query))
            );
        });
        
        renderWatchedGrid(searchResults);
    }
    
    // İçerik detayını aç
    function openDetailModal(id) {
        currentDetailId = id;
        
        // İçerik bilgilerini al
        const item = watchedItems.find(item => item.id === id);
        if (!item) return;
        
        // İçerik HTML'i oluştur
        let contentHTML = `
            <div class="detail-header">
                <div class="detail-poster">
                    <img src="${item.imageUrl || 'https://via.placeholder.com/300x450/152642/ffffff?text=Poster+Yok'}" alt="${item.title}">
                </div>
                <div class="detail-info">
                    <h2 class="detail-title">${item.title}</h2>
                    <div class="detail-meta">
                        <span class="year">${item.year}</span>
                        <span class="type">${item.type === 'movie' ? 'Film' : 'Dizi'}</span>
                        ${item.seasons ? `<span class="seasons">${item.seasons} Sezon</span>` : ''}
                    </div>
                    <div class="detail-genre">${item.genre || 'Kategori belirtilmemiş'}</div>
                    <div class="detail-director">
                        <strong>Yönetmen:</strong> ${item.director || 'Belirtilmemiş'}
                    </div>
                    ${item.starring ? `<div class="detail-cast"><strong>Oyuncular:</strong> ${item.starring}</div>` : ''}
                    <div class="detail-description">${item.description || 'Açıklama bulunmuyor.'}</div>
                    
                    <div class="watched-info">
                        <div class="watched-meta">
                            <div class="watched-date-display">
                                <strong>İzlenme Tarihi:</strong> ${new Date(item.watchedDate).toLocaleDateString('tr-TR')}
                            </div>
                            <div class="watched-rating-display">
                                <strong>Puanınız:</strong> 
                                <div class="rating-stars">
                                    ${Array(5).fill(0).map((_, index) => {
                                        return `<i class="fas fa-star ${index < item.watchedRating ? 'active' : ''}"></i>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                        ${item.watchedNotes ? `
                        <div class="watched-notes">
                            <strong>Notlarınız:</strong>
                            <p>${item.watchedNotes}</p>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Modal içeriğini güncelle
        document.getElementById('detailContent').innerHTML = contentHTML;
        
        // Modalı göster
        detailModal.style.display = 'block';
    }
    
    // QR kod önerisi oluştur
    function generateRecommendationQR() {
        if (!currentDetailId) return;
        
        // QR kod container'ı göster
        qrCodeContainer.style.display = 'block';
        
        // Seçilen içerik için benzer içerikleri al
        DB.getRecommendations(currentDetailId)
            .then(recommendations => {
                if (recommendations.length === 0) {
                    document.getElementById('qrDescription').textContent = 
                        "Üzgünüz, bu içerik için öneri bulunamadı.";
                    return;
                }
                
                // Önerileri metin olarak göster
                const recTitles = recommendations.map(rec => rec.title).join(", ");
                document.getElementById('qrDescription').textContent = 
                    `Sizin için öneriler: ${recTitles}`;
                
                // QR kod içeriği oluştur
                const qrContent = {
                    type: "recommendation",
                    sourceId: currentDetailId,
                    recommendations: recommendations.map(rec => ({
                        id: rec.id,
                        title: rec.title,
                        type: rec.type,
                        year: rec.year
                    }))
                };
                
                // QR kodu oluştur
                const qrCodeElement = document.getElementById('qrcode');
                qrCodeElement.innerHTML = ''; // Önceki QR kodu temizle
                
                // qrcode-generator kütüphanesi ile QR kod oluştur
                const qr = qrcode(0, 'M');
                qr.addData(JSON.stringify(qrContent));
                qr.make();
                qrCodeElement.innerHTML = qr.createImgTag(5);
            })
            .catch(error => {
                console.error('QR kod önerisi oluşturma hatası:', error);
                document.getElementById('qrDescription').textContent = 
                    "Öneri oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.";
            });
    }
    
    // İzlenenlerden çıkar
    function removeFromWatched() {
        if (!currentDetailId) return;
        
        if (confirm('Bu içeriği izlediklerinizden çıkarmak istediğinize emin misiniz?')) {
            DB.removeFromWatched(currentDetailId)
                .then(() => {
                    // Modalı kapat
                    detailModal.style.display = 'none';
                    
                    // İçeriği listeden çıkar
                    watchedItems = watchedItems.filter(item => item.id !== currentDetailId);
                    
                    // Listeyi güncelle
                    if (watchedItems.length === 0) {
                        showEmptyState();
                    } else {
                        updateStatistics(watchedItems);
                        renderWatchedGrid(watchedItems);
                    }
                    
                    // Başarı mesajı göster
                    alert('İçerik izlediklerinizden çıkarıldı.');
                })
                .catch(error => {
                    console.error('İçeriği izlenenlerden çıkarma hatası:', error);
                    alert('İçerik çıkarılırken bir hata oluştu. Lütfen tekrar deneyin.');
                });
        }
    }
    
    // Olay dinleyicileri
    function setupEventListeners() {
        // Filtre butonları
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aktif butonu güncelle
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtreyi uygula
                currentFilter = this.dataset.filter;
                renderWatchedGrid(watchedItems);
            });
        });
        
        // Sıralama değişikliği
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                currentSortBy = this.value;
                renderWatchedGrid(watchedItems);
            });
        }
        
        // Arama
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
        
        // Modal kapatma
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    
                    // QR kod containerını gizle
                    if (qrCodeContainer) {
                        qrCodeContainer.style.display = 'none';
                    }
                }
            });
        });
        
        // QR kod önerisi oluştur butonu
        if (generateRecommendationQRBtn) {
            generateRecommendationQRBtn.addEventListener('click', generateRecommendationQR);
        }
        
        // QR kodu kapat butonu
        if (closeQrCodeBtn) {
            closeQrCodeBtn.addEventListener('click', function() {
                qrCodeContainer.style.display = 'none';
            });
        }
        
        // İzlenenlerden çıkar butonu
        if (removeFromWatchedBtn) {
            removeFromWatchedBtn.addEventListener('click', removeFromWatched);
        }
        
        // Modal dışına tıklayınca kapat
        window.addEventListener('click', function(event) {
            if (event.target === detailModal) {
                detailModal.style.display = 'none';
                
                // QR kod containerını gizle
                if (qrCodeContainer) {
                    qrCodeContainer.style.display = 'none';
                }
            }
        });
        
        // Tema değişikliğini dinle
        document.addEventListener('themeChanged', function(event) {
            // İçerikleri tekrar render et
            renderWatchedGrid(watchedItems);
        });
    }
    
    // Sayfa başlangıcı
    loadWatchedContent();
    setupEventListeners();
    console.log("İzlediklerim sayfası başlatıldı.");
});
