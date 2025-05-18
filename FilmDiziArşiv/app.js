// DOM Referansları
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const contentGrid = document.getElementById('contentGrid');
const newContentGrid = document.getElementById('newContentGrid');
const modal = document.getElementById('modal');
const detailModal = document.getElementById('detailModal');
const closeButtons = document.querySelectorAll('.close');
const contentForm = document.getElementById('contentForm');
const modalTitle = document.getElementById('modalTitle');
const detailContent = document.getElementById('detailContent');
const heroSlider = document.getElementById('heroSlider');
const sliderDots = document.querySelector('.slider-dots');
const prevButton = document.querySelector('.slider-arrow.prev');
const nextButton = document.querySelector('.slider-arrow.next');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const darkModeToggle = document.getElementById('darkModeToggle');
const userProfileContainer = document.getElementById('userProfileContainer');

// Değişkenler
let currentFilter = 'all';
let currentEditId = null;
let currentSlide = 0;
let slideInterval;
let slides;
let currentUser = null;

// Demo film/dizi verileri
const demoMovies = [
    {
        id: 'movie1',
        title: 'Başlangıç',
        type: 'movie',
        year: 2010,
        director: 'Christopher Nolan',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        genre: 'Bilim Kurgu, Aksiyon',
        description: 'Dom Cobb, rüyalar dünyasının becerikli bir hırsızıdır. Kurbanlarının bilinçaltından değerli sırları çalmak onun uzmanlık alanıdır.',
        rating: 5
    },
    {
        id: 'movie2',
        title: 'Yüzüklerin Efendisi',
        type: 'movie',
        year: 2001,
        director: 'Peter Jackson',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg',
        genre: 'Fantastik, Macera',
        description: 'Bir Yüzük hepsini yönetecek, Bir Yüzük hepsini bulacak, Bir Yüzük hepsini karanlığa getirecek.',
        rating: 5
    },
    {
        id: 'movie3',
        title: 'Esaretin Bedeli',
        type: 'movie',
        year: 1994,
        director: 'Frank Darabont',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
        genre: 'Dram',
        description: 'İşlemediği bir suçtan hapse giren bankacı Andy Dufresne, hapishane şartlarına uyum sağlamaya çalışırken hayata tutunmanın yollarını arar.',
        rating: 5
    }
];

const demoSeries = [
    {
        id: 'series1',
        title: 'Breaking Bad',
        type: 'series',
        year: 2008,
        director: 'Vince Gilligan',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BYTU3NWI5OGMtZmZhNy00MjVmLTk1YzAtZjA3ZDA3NzcyNDUxXkEyXkFqcGdeQXVyODY5Njk4Njc@._V1_.jpg',
        genre: 'Suç, Dram',
        description: 'Kanser teşhisi konan bir kimya öğretmeni, ailesinin geleceğini korumak için metamfetamin üretmeye ve satmaya başlar.',
        rating: 5,
        seasons: 5
    },
    {
        id: 'series2',
        title: 'Game of Thrones',
        type: 'series',
        year: 2011,
        director: 'David Benioff, D.B. Weiss',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg',
        genre: 'Aksiyon, Macera, Dram',
        description: 'Westeros ve Essos kıtalarında, yedi krallığı yönetmek için mücadele eden aileler ve karakterlerin hikayesi.',
        rating: 4,
        seasons: 8
    },
    {
        id: 'series3',
        title: 'Stranger Things',
        type: 'series',
        year: 2016,
        director: 'The Duffer Brothers',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
        genre: 'Dram, Fantezi, Korku',
        description: '1980\'lerin başlarında küçük bir kasabada bir çocuğun esrarengiz kayboluşu, doğaüstü olayları, gizli hükümet deneylerini ve tuhaf bir kızı gün yüzüne çıkarır.',
        rating: 4,
        seasons: 4
    }
];

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJ92KAKVbLN1A0YUeuxMJwbC-qxT38Mm4",
    authDomain: "filmdiziarsivis.firebaseapp.com",
    projectId: "filmdiziarsivis",
    storageBucket: "filmdiziarsivis.appspot.com",
    messagingSenderId: "795643873947",
    appId: "1:795643873947:web:e3e6a23776eab43bbb9cef"
};

// Initialize Firebase
let db, auth;
try {
    // Initialize Firebase - using modern SDK pattern
    const app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    console.log("Firebase başarıyla başlatıldı");
} catch (error) {
    console.error("Firebase başlatma hatası:", error);
}

// Uygulama Başlangıcı
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM yüklendi, uygulama başlatılıyor...");
    
    // Giriş modalını doğrudan HTML'den al
    const loginModalDirect = document.getElementById('loginModal');
    console.log("Login modal elementi:", loginModalDirect);
    
    // Direkt olay ata (ilk başta bir kez)
    if (loginBtn && loginModalDirect) {
        loginBtn.onclick = function(e) {
            e.preventDefault();
            console.log("Giriş butonuna tıklandı, modal açılıyor");
            loginModalDirect.style.display = 'block';
        };
    }
    
    // Tema değiştirme işlevi
    if (darkModeToggle) {
        darkModeToggle.onclick = function() {
            toggleTheme();
        };
    }
    
    // Modal kapatma butonu
    if (closeLoginModal) {
        closeLoginModal.onclick = function() {
            if (loginModalDirect) {
                loginModalDirect.style.display = 'none';
            }
        };
    }
    
    // Tema tercihini yükle
    loadThemePreference();
    
    // Diğer fonksiyonları çağır
    try {
        checkAuthState();
        setActiveNavItem();
        setupHeroSlider();
        loadContents();
    } catch (error) {
        console.error("Hata:", error);
    }
});

function checkAuthState() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            // Update UI for signed-in user
            updateUIForSignedInUser(user);
        } else {
            // No user is signed in
            console.log('No user is signed in');
            // For demo purposes, we're not redirecting to the login page
            // updateUIForSignedOutUser();
        }
    });
}

function updateUIForSignedInUser(user) {
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.innerHTML = '';
        const profileImg = document.createElement('img');
        profileImg.src = user.photoURL || 'https://via.placeholder.com/40';
        profileImg.alt = user.displayName || user.email;
        profileImg.className = 'profile-img';
        profileIcon.appendChild(profileImg);
        
        // Add click event for user dropdown menu
        profileIcon.addEventListener('click', function() {
            // Show user dropdown menu
            alert('User menu: Profile, Settings, Logout');
        });
    }
}

function updateUIForSignedOutUser() {
    // Redirect to login page or show login modal
    window.location.href = 'login.html';
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkHref === 'index.html') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Tema tercihini yükle
function loadThemePreference() {
    let theme = localStorage.getItem('theme');
    
    // Varsayılan tema (eğer tercih yoksa veya sistem teması karanlık ise)
    if (!theme) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    console.log("Yüklenen tema tercihi:", theme);
    
    // İkonu güncelle
    updateThemeIcon(theme);
    
    // Sistem tema değişikliğini dinle
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

// Tema ikonunu güncelle
function updateThemeIcon(theme) {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        if (theme === 'dark') {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeToggle.setAttribute('title', 'Aydınlık Moda Geç');
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.setAttribute('title', 'Karanlık Moda Geç');
        }
    }
}

// Tema değiştir
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log("Tema değiştiriliyor:", currentTheme, "->", newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeIcon(newTheme);
}

// Demo içerik ekle
function checkAndLoadDemoContent() {
    DB.getAllContents()
        .then(contents => {
            if (contents.length === 0) {
                // Veritabanında içerik yoksa demo içeriği ekle
                const addPromises = [...demoMovies, ...demoSeries].map(content => DB.addContent(content));
                return Promise.all(addPromises);
            }
        })
        .catch(error => {
            console.error('Demo içerik yükleme hatası:', error);
        });
}

// Hero slider kurulumu
function setupHeroSlider() {
    slides = document.querySelectorAll('.slide');
    
    // Slider noktalarını oluştur
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        sliderDots.appendChild(dot);
    });
    
    // Otomatik slider başlat
    startSlideInterval();
    
    // Slider ok tuşlarını ayarla
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
}

// Slider otomatik geçişini başlat
function startSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// Sonraki slide'a geç
function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
}

// Önceki slide'a geç
function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
}

// Belirli bir slide'a git
function goToSlide(slideIndex) {
    // Mevcut slide'ı deaktif et
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.slider-dot')[currentSlide].classList.remove('active');
    
    // Yeni slide'ı aktif et
    currentSlide = slideIndex;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.slider-dot')[currentSlide].classList.add('active');
    
    // Otomatik geçişi yeniden başlat
    startSlideInterval();
}

// Giriş işlemlerini yönet
function setupLoginModal() {
    console.log("Login modal ayarlanıyor...");
    
    // Giriş butonuna tıklandığında modalı göster
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Login butonuna tıklandı, modal açılıyor");
            if (loginModal) {
                loginModal.style.display = 'block';
            } else {
                console.error("Login modal elementi bulunamadı!");
            }
        });
    } else {
        console.error("Login butonu bulunamadı!");
    }
    
    // Modal kapatma butonu
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            console.log("Login modal kapatılıyor");
            loginModal.style.display = 'none';
        });
    } else {
        console.error("Login modal kapatma butonu bulunamadı!");
    }
    
    // Auth tab geçişleri
    if (authTabs && authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Tüm tabları pasif yap
                authTabs.forEach(t => t.classList.remove('active'));
                // Tıklanan tabı aktif yap
                tab.classList.add('active');
                
                // Tüm formları gizle
                document.querySelectorAll('.auth-form').forEach(form => {
                    form.classList.remove('active');
                });
                
                // İlgili formu göster
                const tabName = tab.getAttribute('data-tab');
                if (tabName === 'login') {
                    loginForm.classList.add('active');
                } else if (tabName === 'register') {
                    registerForm.classList.add('active');
                }
            });
        });
    }
    
    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Demo giriş işlemi
            console.log("Giriş denemesi:", email);
            
            // Loading göster
            loginForm.classList.add('loading');
            
            // Demo giriş işlemi
            setTimeout(() => {
                console.log('Demo giriş yapıldı:', email);
                alert('Başarıyla giriş yapıldı!');
                loginModal.style.display = 'none';
                
                // Demo kullanıcı oluştur
                currentUser = {
                    email: email,
                    displayName: 'Demo Kullanıcı'
                };
                
                // Login butonunu güncelle
                updateLoginButtonText();
                
                // Loading kaldır
                loginForm.classList.remove('loading');
                
                // Kullanıcı giriş olayını tetikle
                document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: currentUser }));
            }, 1000);
        });
    }
    
    // Register form submit işlemleri...
}

// Olay Dinleyicilerini Ayarla
function setupEventListeners() {
    // Arama işlemi
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // Gece/Gündüz modu
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }
    
    // Giriş modal işlemleri
    setupLoginModal();
    
    // Modalları kapat
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'none';
            detailModal.style.display = 'none';
        });
    });
    
    // Dışarı tıklama ile modalı kapat
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === detailModal) {
            detailModal.style.display = 'none';
        }
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Form gönderimi
    contentForm.addEventListener('submit', saveContent);
}

// Login buton metnini güncelle
function updateLoginButtonText() {
    if (loginBtn) {
        if (currentUser) {
            loginBtn.textContent = 'Hesabım';
            // Profil ikonunu göster, login butonunu gizle
            if (userProfileContainer) {
                userProfileContainer.style.display = 'block';
                loginBtn.style.display = 'none';
            }
        } else {
            loginBtn.textContent = 'Giriş Yap';
            loginBtn.style.display = 'block';
            if (userProfileContainer) {
                userProfileContainer.style.display = 'none';
            }
        }
    }
}

// İçerikleri Yükle
function loadContents() {
    // IndexedDB'den içerikleri getir, hata olursa demo içeriği göster
    try {
        DB.getAllContents()
            .then(contents => {
                // İçerik yoksa demo içeriği göster
                if (!contents || contents.length === 0) {
                    contents = [...demoMovies, ...demoSeries];
                }
                
                // Filmler
                const movies = contents.filter(content => content.type === 'movie');
                const featuredMovies = movies.slice(0, 6);
                
                // Diziler
                const series = contents.filter(content => content.type === 'series');
                const featuredSeries = series.slice(0, 6);
                
                // Öne çıkanlar için film ve dizileri karıştır
                const featuredContents = [...featuredMovies, ...featuredSeries]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 6);
                
                renderContentGrid(contentGrid, featuredContents);
                
                // Yeni eklenenler için içerikleri göster
                renderContentGrid(newContentGrid, contents.slice(0, 6));
            })
            .catch(error => {
                console.error('İçerik yükleme hatası:', error);
                // Hata durumunda demo içerikleri göster
                loadDemoContents();
            });
    } catch (error) {
        console.error('İçerik yükleme hatası:', error);
        // Hata durumunda demo içerikleri göster
        loadDemoContents();
    }
}

// İçerikleri Görüntüle
function renderContentGrid(gridElement, contents) {
    if (!gridElement) return;
    gridElement.innerHTML = '';
    
    if (!contents || contents.length === 0) {
        gridElement.innerHTML = '<p class="no-content">Henüz içerik bulunmuyor.</p>';
        return;
    }
    
    contents.forEach(content => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.setAttribute('data-id', content.id);
        
        // Resim URL'sini düzelt (hata durumunda placeholder göster)
        const imageUrl = content.imageUrl || content.poster || 'https://via.placeholder.com/300x450/122235/ffffff?text=No+Image';
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${imageUrl}" alt="${content.title}" class="card-img" onerror="this.src='https://via.placeholder.com/300x450/122235/ffffff?text=${encodeURIComponent(content.title)}'">
            </div>
            <div class="card-body">
                <h3 class="card-title">${content.title}</h3>
                <p class="card-info">${content.year || ''}</p>
                ${content.genre ? `<p class="card-info">${content.genre}</p>` : ''}
                ${content.rating ? `<div class="rating">${'★'.repeat(parseInt(content.rating))}</div>` : ''}
                <span class="card-type ${content.type}">${content.type === 'movie' ? 'Film' : 'Dizi'}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            openDetailModal(content.id);
        });
        
        gridElement.appendChild(card);
    });
}

// Arama İşlemi
function performSearch() {
    const query = searchInput.value.trim();
    
    if (query === '') {
        loadContents();
        return;
    }
    
    DB.searchContents(query)
        .then(results => {
            renderContentGrid(contentGrid, results);
            newContentGrid.innerHTML = '<p class="no-content">Arama sonuçları yukarıda gösteriliyor.</p>';
        })
        .catch(error => {
            console.error('Arama hatası:', error);
            alert('Arama sırasında bir hata oluştu!');
        });
}

// Ekleme Modalını Aç
function openAddModal() {
    modalTitle.textContent = 'Yeni İçerik Ekle';
    contentForm.reset();
    currentEditId = null;
    modal.style.display = 'block';
}

// Düzenleme Modalını Aç
function openEditModal(id) {
    DB.getContent(id)
        .then(content => {
            modalTitle.textContent = 'İçerik Düzenle';
            
            // Form alanlarını doldur
            document.getElementById('contentId').value = content.id;
            document.getElementById('title').value = content.title;
            document.getElementById('type').value = content.type;
            document.getElementById('year').value = content.year;
            document.getElementById('genre').value = content.genre || '';
            document.getElementById('director').value = content.director || '';
            document.getElementById('starring').value = content.starring || '';
            document.getElementById('imageUrl').value = content.imageUrl || '';
            document.getElementById('rating').value = content.rating || '';
            document.getElementById('notes').value = content.notes || '';
            
            currentEditId = content.id;
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('İçerik yükleme hatası:', error);
            alert('İçerik yüklenirken bir hata oluştu!');
        });
}

// Detay Modalını Aç
function openDetailModal(id) {
    DB.getContent(id)
        .then(content => {
            detailContent.innerHTML = `
                <div class="detail-container">
                    <div class="detail-image">
                        <img src="${content.imageUrl || content.poster || 'https://via.placeholder.com/300x450/122235/ffffff?text=No+Image'}" alt="${content.title}">
                    </div>
                    <div class="detail-info">
                        <h2 class="detail-title">${content.title}</h2>
                        <p class="detail-meta">${content.year} · ${content.genre || 'Kategori belirtilmemiş'}</p>
                        <span class="detail-type ${content.type}">${content.type === 'movie' ? 'Film' : 'Dizi'}</span>
                        
                        ${content.director ? `
                        <div class="detail-section">
                            <h3>Yönetmen/Yapımcı</h3>
                            <p>${content.director}</p>
                        </div>` : ''}
                        
                        ${content.starring ? `
                        <div class="detail-section">
                            <h3>Oyuncular</h3>
                            <p>${content.starring}</p>
                        </div>` : ''}
                        
                        ${content.rating ? `
                        <div class="detail-section">
                            <h3>Puanınız</h3>
                            <div class="rating">${'★'.repeat(parseInt(content.rating))}</div>
                        </div>` : ''}
                        
                        ${content.notes ? `
                        <div class="detail-section">
                            <h3>Özet</h3>
                            <p>${content.notes}</p>
                        </div>` : ''}
                        
                        <div class="action-buttons">
                            <a href="#" class="btn btn-play"><i class="fas fa-play"></i> Oynat</a>
                            <button class="edit-btn" data-id="${content.id}"><i class="fas fa-edit"></i> Düzenle</button>
                            <button class="delete-btn" data-id="${content.id}"><i class="fas fa-trash"></i> Sil</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Düzenle butonu
            detailContent.querySelector('.edit-btn').addEventListener('click', () => {
                detailModal.style.display = 'none';
                openEditModal(content.id);
            });
            
            // Sil butonu
            detailContent.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
                    DB.deleteContent(content.id)
                        .then(() => {
                            detailModal.style.display = 'none';
                            loadContents();
                        })
                        .catch(error => {
                            console.error('Silme hatası:', error);
                            alert('İçerik silinirken bir hata oluştu!');
                        });
                }
            });
            
            detailModal.style.display = 'block';
        })
        .catch(error => {
            console.error('İçerik yükleme hatası:', error);
            alert('İçerik yüklenirken bir hata oluştu!');
        });
}

// İçerik Kaydetme
function saveContent(event) {
    event.preventDefault();
    
    // Form verilerini topla
    const content = {
        title: document.getElementById('title').value,
        type: document.getElementById('type').value,
        year: parseInt(document.getElementById('year').value),
        genre: document.getElementById('genre').value,
        director: document.getElementById('director').value,
        starring: document.getElementById('starring').value,
        imageUrl: document.getElementById('imageUrl').value,
        rating: document.getElementById('rating').value,
        notes: document.getElementById('notes').value
    };
    
    // ID varsa güncelleme yap
    if (currentEditId !== null) {
        content.id = currentEditId;
        
        DB.updateContent(content)
            .then(() => {
                modal.style.display = 'none';
                loadContents();
            })
            .catch(error => {
                console.error('Güncelleme hatası:', error);
                alert('İçerik güncellenirken bir hata oluştu!');
            });
    } else {
        // Yeni içerik ekle
        DB.addContent(content)
            .then(() => {
                modal.style.display = 'none';
                loadContents();
            })
            .catch(error => {
                console.error('Ekleme hatası:', error);
                alert('İçerik eklenirken bir hata oluştu!');
            });
    }
}

// Demo içerikleri doğrudan yükle (IndexedDB olmadan)
function loadDemoContents() {
    const allDemoContents = [...demoMovies, ...demoSeries];
    renderContentGrid(contentGrid, allDemoContents.slice(0, 6));
    renderContentGrid(newContentGrid, allDemoContents.slice(0, 6));
    setupHeroSlider();
} 