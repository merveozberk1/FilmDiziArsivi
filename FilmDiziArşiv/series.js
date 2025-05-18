document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is logged in, load series
            loadSeries();
        } else {
            // User is not logged in, redirect to login page
            // window.location.href = 'login.html';
            // For now, just load series anyway
            loadSeries();
        }
    });

    // Load theme preference
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            document.getElementById('checkbox').checked = true;
        }
    } else {
        // Set default theme to dark if not set
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    
    // Update the theme icon to match current theme
    updateThemeIcon();

    // Theme switch functionality
    const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', switchTheme, false);
    }
    
    // Dark mode toggle button
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Login modal
    setupLoginModal();
});

function switchTheme(e) {
    const isDark = e.target.checked;
    const newTheme = isDark ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log("Tema değiştiriliyor:", currentTheme, "->", newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update checkbox state
    const themeCheckbox = document.getElementById('checkbox');
    if (themeCheckbox) {
        themeCheckbox.checked = newTheme === 'dark';
    }
    
    // Update icon
    updateThemeIcon();
}

function loadSeries() {
    const seriesGrid = document.getElementById('seriesGrid');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    // Show loading animation
    loadingAnimation.style.display = 'flex';
    
    // Demo dizi verileri (Firebase ile entegre edildiğinde bu kaldırılacak)
    const demoSeries = [
        {
            id: 'series1',
            title: 'Breaking Bad',
            year: 2008,
            director: 'Vince Gilligan',
            poster: 'https://m.media-amazon.com/images/M/MV5BYTU3NWI5OGMtZmZhNy00MjVmLTk1YzAtZjA3ZDA3NzcyNDUxXkEyXkFqcGdeQXVyODY5Njk4Njc@._V1_.jpg',
            genre: 'Suç, Dram',
            description: 'Kanser teşhisi konan bir kimya öğretmeni, ailesinin geleceğini korumak için metamfetamin üretmeye ve satmaya başlar.',
            rating: 5,
            seasons: 5
        },
        {
            id: 'series2',
            title: 'Game of Thrones',
            year: 2011,
            director: 'David Benioff, D.B. Weiss',
            poster: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg',
            genre: 'Aksiyon, Macera, Dram',
            description: 'Westeros ve Essos kıtalarında, yedi krallığı yönetmek için mücadele eden aileler ve karakterlerin hikayesi.',
            rating: 4,
            seasons: 8
        },
        {
            id: 'series3',
            title: 'Stranger Things',
            year: 2016,
            director: 'The Duffer Brothers',
            poster: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
            genre: 'Dram, Fantezi, Korku',
            description: '1980\'lerin başlarında küçük bir kasabada bir çocuğun esrarengiz kayboluşu, doğaüstü olayları, gizli hükümet deneylerini ve tuhaf bir kızı gün yüzüne çıkarır.',
            rating: 4,
            seasons: 4
        },
        {
            id: 'series4',
            title: 'The Crown',
            year: 2016,
            director: 'Peter Morgan',
            poster: 'https://m.media-amazon.com/images/M/MV5BZmY0MzBlNjctNTRmNy00Njk3LWFjMzctMWQwZDAwMGJmY2MyXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
            genre: 'Biyografi, Dram, Tarih',
            description: 'Kraliçe II. Elizabeth\'in hayatı ve İngiltere\'deki saltanatı anlatılıyor.',
            rating: 4,
            seasons: 6
        },
        {
            id: 'series5',
            title: 'Friends',
            year: 1994,
            director: 'David Crane, Marta Kauffman',
            poster: 'https://m.media-amazon.com/images/M/MV5BNDVkYjU0MzctMWRmZi00NTkxLTgwZWEtOWVhYjZlYjllYmU4XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg',
            genre: 'Komedi, Romantik',
            description: 'Manhattan\'da yaşayan altı yakın arkadaşın hayatını konu alan sitcom.',
            rating: 5,
            seasons: 10
        },
        {
            id: 'series6',
            title: 'The Mandalorian',
            year: 2019,
            director: 'Jon Favreau',
            poster: 'https://m.media-amazon.com/images/M/MV5BZDhlMzY0ZGItZTcyNS00ZTAxLWIyMmYtZGQ2ODg5OWZiYmJkXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_.jpg',
            genre: 'Aksiyon, Macera, Fantastik',
            description: 'Star Wars evreninde geçen, Yeni Cumhuriyet\'in doğuşu ve İmparatorluğun düşüşünden sonra bir Mandalorian\'ın maceralarını konu alan dizi.',
            rating: 4,
            seasons: 3
        }
    ];
    
    // Simüle edilmiş Firebase verisi yükleme
    setTimeout(() => {
        // Hide loading animation
        loadingAnimation.style.display = 'none';
        
        // Clear existing content
        seriesGrid.innerHTML = '';
        
        // Create content cards for each series
        demoSeries.forEach(series => {
            const contentCard = createContentCard(series, series.id);
            seriesGrid.appendChild(contentCard);
        });
    }, 1000); // 1 saniye bekleterek yükleme animasyonunu göster
    
    // Eğer Firebase entegrasyonu yapmak istersek, buradaki kod kullanılabilir
    /*
    // Reference to the series collection in Firestore
    const seriesRef = firebase.firestore().collection('contents').where('type', '==', 'series');
    
    seriesRef.get()
        .then((querySnapshot) => {
            // Hide loading animation
            loadingAnimation.style.display = 'none';
            
            if (querySnapshot.empty) {
                seriesGrid.innerHTML = '<p class="no-content">Henüz dizi eklenmemiş.</p>';
                return;
            }
            
            // Clear loading animation
            seriesGrid.innerHTML = '';
            
            // Create a content card for each series
            querySnapshot.forEach((doc) => {
                const series = doc.data();
                const contentCard = createContentCard(series, doc.id);
                seriesGrid.appendChild(contentCard);
            });
        })
        .catch((error) => {
            console.error("Error loading series: ", error);
            loadingAnimation.style.display = 'none';
            seriesGrid.innerHTML = '<p class="error-message">Diziler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
        });
    */
}

function createContentCard(content, id) {
    // Create content card element
    const card = document.createElement('div');
    card.className = 'content-card';
    card.dataset.id = id;
    
    // Create image container
    const imgContainer = document.createElement('div');
    imgContainer.className = 'content-img';
    
    // Create image element
    const img = document.createElement('img');
    img.src = content.poster || content.imageUrl || 'https://via.placeholder.com/300x450?text=No+Poster';
    img.alt = content.title;
    imgContainer.appendChild(img);
    
    // Create info overlay
    const infoOverlay = document.createElement('div');
    infoOverlay.className = 'content-info-overlay';
    
    // Create watch button
    const watchButton = document.createElement('button');
    watchButton.className = 'watch-button';
    watchButton.innerHTML = '<i class="fas fa-play"></i> İzle';
    watchButton.addEventListener('click', function(e) {
        e.stopPropagation();
        // Handle watch action
        alert(`${content.title} dizisi izleniyor...`);
    });
    infoOverlay.appendChild(watchButton);
    
    // Create add to list button
    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.innerHTML = '<i class="fas fa-plus"></i> Listeme Ekle';
    addButton.addEventListener('click', function(e) {
        e.stopPropagation();
        // Handle add to list action
        alert(`${content.title} listenize eklendi.`);
    });
    infoOverlay.appendChild(addButton);
    
    imgContainer.appendChild(infoOverlay);
    card.appendChild(imgContainer);
    
    // Create content info
    const contentInfo = document.createElement('div');
    contentInfo.className = 'content-info';
    
    // Create title
    const title = document.createElement('h3');
    title.className = 'content-title';
    title.textContent = content.title;
    contentInfo.appendChild(title);
    
    // Create year and rating info
    const yearRating = document.createElement('div');
    yearRating.className = 'year-rating';
    const ratingStars = '★'.repeat(parseInt(content.rating || 0)) + '☆'.repeat(5 - parseInt(content.rating || 0));
    const seasonText = content.seasons ? `${content.seasons} Sezon • ` : '';
    yearRating.textContent = `${content.year || 'N/A'} • ${seasonText}${ratingStars}`;
    contentInfo.appendChild(yearRating);
    
    // Add genre if available
    if (content.genre) {
        const genre = document.createElement('div');
        genre.className = 'content-genre';
        genre.textContent = content.genre;
        contentInfo.appendChild(genre);
    }
    
    card.appendChild(contentInfo);
    
    // Add click event to open content details
    card.addEventListener('click', function() {
        showSeriesDetails(content, id);
    });
    
    return card;
}

function showSeriesDetails(series, id) {
    // Diziye ait detay görünümü
    const detailHTML = `
        <div class="series-detail-container">
            <div class="series-detail-poster">
                <img src="${series.poster || series.imageUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${series.title}">
            </div>
            <div class="series-detail-info">
                <h2>${series.title}</h2>
                <div class="series-meta">
                    <span>${series.year || 'N/A'}</span>
                    <span class="separator">•</span>
                    <span>${series.seasons} Sezon</span>
                    <span class="separator">•</span>
                    <span>${series.genre || 'N/A'}</span>
                    <span class="separator">•</span>
                    <span class="rating">${'★'.repeat(parseInt(series.rating || 0))}</span>
                </div>
                <div class="series-description">
                    <p>${series.description || 'Bu dizi için açıklama bulunmuyor.'}</p>
                </div>
                <div class="series-director">
                    <strong>Yaratıcı:</strong> ${series.director || 'Bilinmiyor'}
                </div>
                ${series.starring ? `<div class="series-cast"><strong>Oyuncular:</strong> ${series.starring}</div>` : ''}
                <div class="series-actions">
                    <button class="watch-button"><i class="fas fa-play"></i> İzle</button>
                    <button class="add-button"><i class="fas fa-plus"></i> Listeme Ekle</button>
                </div>
            </div>
        </div>
    `;
    
    // Alert olarak göster (Gerçek projede modal veya ayrı sayfa olacak)
    alert(`${series.title} Detayları:\n\nYıl: ${series.year}\nSezon: ${series.seasons}\nYaratıcı: ${series.director}\nTür: ${series.genre}\nPuan: ${series.rating}/5\n\n${series.description || 'Açıklama yok.'}`);
}

// Search functionality
document.getElementById('searchButton').addEventListener('click', searchContent);
document.getElementById('searchInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchContent();
    }
});

function searchContent() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    if (!searchInput.trim()) return;
    
    const seriesGrid = document.getElementById('seriesGrid');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    // Show loading animation
    loadingAnimation.style.display = 'flex';
    seriesGrid.innerHTML = '';
    
    // Reference to the series collection
    const seriesRef = firebase.firestore().collection('contents').where('type', '==', 'series');
    
    seriesRef.get()
        .then((querySnapshot) => {
            // Hide loading animation
            loadingAnimation.style.display = 'none';
            
            if (querySnapshot.empty) {
                seriesGrid.innerHTML = '<p class="no-content">Henüz dizi eklenmemiş.</p>';
                return;
            }
            
            // Filter series based on search term
            let filteredSeries = [];
            querySnapshot.forEach((doc) => {
                const series = doc.data();
                if (series.title.toLowerCase().includes(searchInput) || 
                    (series.description && series.description.toLowerCase().includes(searchInput)) ||
                    (series.actors && series.actors.some(actor => actor.toLowerCase().includes(searchInput)))) {
                    filteredSeries.push({ id: doc.id, ...series });
                }
            });
            
            if (filteredSeries.length === 0) {
                seriesGrid.innerHTML = `<p class="no-content">"${searchInput}" için sonuç bulunamadı.</p>`;
                return;
            }
            
            // Display filtered series
            filteredSeries.forEach((series) => {
                const contentCard = createContentCard(series, series.id);
                seriesGrid.appendChild(contentCard);
            });
        })
        .catch((error) => {
            console.error("Error searching series: ", error);
            loadingAnimation.style.display = 'none';
            seriesGrid.innerHTML = '<p class="error-message">Arama yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
        });
}

// Setup Login Modal behaviors
function setupLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Open login modal
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
    
    // Close login modal
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            authTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all forms
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            
            // Show form based on tab
            const tabName = tab.getAttribute('data-tab');
            if (tabName === 'login') {
                loginForm.classList.add('active');
            } else if (tabName === 'register') {
                registerForm.classList.add('active');
            }
        });
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Show loading state
        loginForm.classList.add('loading');
        
        // Firebase authentication
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Successful login
                const user = userCredential.user;
                console.log('Logged in:', user.email);
                // Close modal
                loginModal.style.display = 'none';
                // Update login button
                loginBtn.textContent = 'Hesabım';
            })
            .catch((error) => {
                console.error('Login error:', error.message);
                alert(`Giriş hatası: ${error.message}`);
            })
            .finally(() => {
                // Hide loading state
                loginForm.classList.remove('loading');
            });
    });
    
    // Register form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        
        // Validate passwords
        if (password !== passwordConfirm) {
            alert('Şifreler eşleşmiyor!');
            return;
        }
        
        // Show loading state
        registerForm.classList.add('loading');
        
        // Firebase registration
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Successful registration
                const user = userCredential.user;
                
                // Save user data to Firestore
                return firebase.firestore().collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    createdAt: new Date().toISOString()
                }).then(() => {
                    console.log('User data saved to Firestore');
                    return user;
                });
            })
            .then((user) => {
                console.log('Registered:', user.email);
                alert('Başarıyla kayıt oldunuz!');
                
                // Switch to login tab
                authTabs.forEach(t => t.classList.remove('active'));
                authTabs[0].classList.add('active');
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
            })
            .catch((error) => {
                console.error('Registration error:', error.message);
                alert(`Kayıt hatası: ${error.message}`);
            })
            .finally(() => {
                // Hide loading state
                registerForm.classList.remove('loading');
            });
    });
}

// Update theme icon based on current theme
function updateThemeIcon() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeCheckbox = document.getElementById('checkbox');
    
    if (darkModeToggle) {
        if (currentTheme === 'dark') {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Keep checkbox in sync
    if (themeCheckbox) {
        themeCheckbox.checked = currentTheme === 'dark';
    }
} 