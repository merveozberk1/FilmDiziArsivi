document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is logged in, load movies
            loadMovies();
        } else {
            // User is not logged in, redirect to login page
            // window.location.href = 'login.html';
            // For now, just load movies anyway
            loadMovies();
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

    // Category dropdown functionality
    setupCategoryFilters();
    
    // User lists functionality
    setupUserLists();
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

function loadMovies() {
    const movieGrid = document.getElementById('movieGrid');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    // Show loading animation
    loadingAnimation.style.display = 'flex';
    
    // Demo film verileri (Firebase ile entegre edildiğinde bu kaldırılacak)
    const demoMovies = [
        {
            id: 'movie1',
            title: 'Başlangıç',
            year: 2010,
            director: 'Christopher Nolan',
            poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
            genre: 'Bilim Kurgu, Aksiyon',
            description: 'Dom Cobb, rüyalar dünyasının becerikli bir hırsızıdır. Kurbanlarının bilinçaltından değerli sırları çalmak onun uzmanlık alanıdır.',
            rating: 5
        },
        {
            id: 'movie2',
            title: 'Yüzüklerin Efendisi',
            year: 2001,
            director: 'Peter Jackson',
            poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg',
            genre: 'Fantastik, Macera',
            description: 'Bir Yüzük hepsini yönetecek, Bir Yüzük hepsini bulacak, Bir Yüzük hepsini karanlığa getirecek.',
            rating: 5
        },
        {
            id: 'movie3',
            title: 'Esaretin Bedeli',
            year: 1994,
            director: 'Frank Darabont',
            poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
            genre: 'Dram',
            description: 'İşlemediği bir suçtan hapse giren bankacı Andy Dufresne, hapishane şartlarına uyum sağlamaya çalışırken hayata tutunmanın yollarını arar.',
            rating: 5
        },
        {
            id: 'movie4',
            title: 'Kara Şövalye',
            year: 2008,
            director: 'Christopher Nolan',
            poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
            genre: 'Aksiyon, Suç, Dram',
            description: 'Batman, Teğmen Gordon ve Bölge Savcısı Harvey Dent, Joker adında yeni bir kötü adam ortaya çıkana kadar Gotham\'daki suçla mücadelede başarılı olurlar.',
            rating: 5
        },
        {
            id: 'movie5',
            title: 'Baba',
            year: 1972,
            director: 'Francis Ford Coppola',
            poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
            genre: 'Suç, Dram',
            description: 'Don Vito Corleone\'nin kızının düğününde, Corleone ailesi ile arkadaşları bir araya gelir.',
            rating: 5
        },
        {
            id: 'movie6',
            title: 'Forrest Gump',
            year: 1994,
            director: 'Robert Zemeckis',
            poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
            genre: 'Dram, Romantik',
            description: 'Forrest Gump, IQ\'su düşük olan ancak olağanüstü olaylara karışan bir adamın hayatını anlatıyor.',
            rating: 4
        }
    ];
    
    // Simüle edilmiş Firebase verisi yükleme
    setTimeout(() => {
        // Hide loading animation
        loadingAnimation.style.display = 'none';
        
        // Clear existing content
        movieGrid.innerHTML = '';
        
        // Create content cards for each movie
        demoMovies.forEach(movie => {
            const contentCard = createContentCard(movie, movie.id);
            movieGrid.appendChild(contentCard);
        });
    }, 1000); // 1 saniye bekleterek yükleme animasyonunu göster
    
    // Eğer Firebase entegrasyonu yapmak istersek, buradaki kod kullanılabilir
    
    // Reference to the movies collection in Firestore
    const moviesRef = firebase.firestore().collection('contents').where('type', '==', 'movie');
    
    moviesRef.get()
        .then((querySnapshot) => {
            // Hide loading animation
            loadingAnimation.style.display = 'none';
            
            if (querySnapshot.empty) {
                movieGrid.innerHTML = '<p class="no-content">Henüz film eklenmemiş.</p>';
                return;
            }
            
            // Clear loading animation
            movieGrid.innerHTML = '';
            
            // Create a content card for each movie
            querySnapshot.forEach((doc) => {
                const movie = doc.data();
                const contentCard = createContentCard(movie, doc.id);
                movieGrid.appendChild(contentCard);
            });
        })
        .catch((error) => {
            console.error("Error loading movies: ", error);
            loadingAnimation.style.display = 'none';
            movieGrid.innerHTML = '<p class="error-message">Filmler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
        });
    
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
    
    // Watch button
    const watchButton = document.createElement('button');
    watchButton.className = 'watch-button';
    watchButton.innerHTML = '<i class="fas fa-play"></i> İzle';
    watchButton.addEventListener('click', function(e) {
        e.stopPropagation();
        markAsWatched(content.id);
    });
    infoOverlay.appendChild(watchButton);
    
    // Add to watchlist button
    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.innerHTML = '<i class="fas fa-plus"></i> Listeme Ekle';
    addButton.addEventListener('click', function(e) {
        e.stopPropagation();
        addToWatchlist(content.id);
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
    yearRating.textContent = `${content.year || 'N/A'} • ${ratingStars}`;
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
        showMovieDetails(content, id);
    });
    
    return card;
}

function showMovieDetails(movie, id) {
    // Filme ait detay görünümü
    const detailHTML = `
        <div class="movie-detail-container">
            <div class="movie-detail-poster">
                <img src="${movie.poster || movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.title}">
            </div>
            <div class="movie-detail-info">
                <h2>${movie.title}</h2>
                <div class="movie-meta">
                    <span>${movie.year || 'N/A'}</span>
                    <span class="separator">•</span>
                    <span>${movie.genre || 'N/A'}</span>
                    <span class="separator">•</span>
                    <span class="rating">${'★'.repeat(parseInt(movie.rating || 0))}</span>
                </div>
                <div class="movie-description">
                    <p>${movie.description || 'Bu film için açıklama bulunmuyor.'}</p>
                </div>
                <div class="movie-director">
                    <strong>Yönetmen:</strong> ${movie.director || 'Bilinmiyor'}
                </div>
                ${movie.starring ? `<div class="movie-cast"><strong>Oyuncular:</strong> ${movie.starring}</div>` : ''}
                <div class="movie-actions">
                    <button class="watch-button"><i class="fas fa-play"></i> İzle</button>
                    <button class="add-button"><i class="fas fa-plus"></i> Listeme Ekle</button>
                </div>
            </div>
        </div>
    `;
    
    // Alert olarak göster (Gerçek projede modal veya ayrı sayfa olacak)
    alert(`${movie.title} Detayları:\n\nYıl: ${movie.year}\nYönetmen: ${movie.director}\nTür: ${movie.genre}\nPuan: ${movie.rating}/5\n\n${movie.description || 'Açıklama yok.'}`);
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
    
    const movieGrid = document.getElementById('movieGrid');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    // Show loading animation
    loadingAnimation.style.display = 'flex';
    movieGrid.innerHTML = '';
    
    // Reference to the movies collection
    const moviesRef = firebase.firestore().collection('contents').where('type', '==', 'movie');
    
    moviesRef.get()
        .then((querySnapshot) => {
            // Hide loading animation
            loadingAnimation.style.display = 'none';
            
            if (querySnapshot.empty) {
                movieGrid.innerHTML = '<p class="no-content">Henüz film eklenmemiş.</p>';
                return;
            }
            
            // Filter movies based on search term
            let filteredMovies = [];
            querySnapshot.forEach((doc) => {
                const movie = doc.data();
                if (movie.title.toLowerCase().includes(searchInput) || 
                    (movie.description && movie.description.toLowerCase().includes(searchInput)) ||
                    (movie.actors && movie.actors.some(actor => actor.toLowerCase().includes(searchInput)))) {
                    filteredMovies.push({ id: doc.id, ...movie });
                }
            });
            
            if (filteredMovies.length === 0) {
                movieGrid.innerHTML = `<p class="no-content">"${searchInput}" için sonuç bulunamadı.</p>`;
                return;
            }
            
            // Display filtered movies
            filteredMovies.forEach((movie) => {
                const contentCard = createContentCard(movie, movie.id);
                movieGrid.appendChild(contentCard);
            });
        })
        .catch((error) => {
            console.error("Error searching movies: ", error);
            loadingAnimation.style.display = 'none';
            movieGrid.innerHTML = '<p class="error-message">Arama yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
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

function setupCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.dropdown-menu a[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const movieGrid = document.getElementById('movieGrid');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    // Show loading animation
    loadingAnimation.style.display = 'flex';
    movieGrid.innerHTML = '';
    
    // Reference to the movies collection
    const moviesRef = firebase.firestore().collection('contents')
        .where('type', '==', 'movie')
        .where('categories', 'array-contains', category);
    
    moviesRef.get()
        .then((querySnapshot) => {
            loadingAnimation.style.display = 'none';
            
            if (querySnapshot.empty) {
                movieGrid.innerHTML = `<p class="no-content">Bu kategoride film bulunamadı.</p>`;
                return;
            }
            
            querySnapshot.forEach((doc) => {
                const movie = { id: doc.id, ...doc.data() };
                const contentCard = createContentCard(movie, doc.id);
                movieGrid.appendChild(contentCard);
            });
        })
        .catch((error) => {
            console.error("Error loading movies by category: ", error);
            loadingAnimation.style.display = 'none';
            movieGrid.innerHTML = '<p class="error-message">Filmler yüklenirken bir hata oluştu.</p>';
        });
}

function setupUserLists() {
    const watchlistBtn = document.getElementById('watchlistBtn');
    const watchedBtn = document.getElementById('watchedBtn');
    
    watchlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showWatchlist();
    });
    
    watchedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showWatchedList();
    });
}

function showWatchlist() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('İzleme listesini görüntülemek için giriş yapmalısınız.');
        return;
    }
    
    const movieGrid = document.getElementById('movieGrid');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    loadingAnimation.style.display = 'flex';
    movieGrid.innerHTML = '';
    
    firebase.firestore().collection('users').doc(user.uid)
        .collection('watchlist')
        .where('type', '==', 'movie')
        .get()
        .then((querySnapshot) => {
            loadingAnimation.style.display = 'none';
            
            if (querySnapshot.empty) {
                movieGrid.innerHTML = '<p class="no-content">İzleme listenizde henüz film yok.</p>';
                return;
            }
            
            querySnapshot.forEach((doc) => {
                const movieRef = firebase.firestore().collection('contents').doc(doc.data().contentId);
                movieRef.get().then((movieDoc) => {
                    if (movieDoc.exists) {
                        const movie = { id: movieDoc.id, ...movieDoc.data() };
                        const contentCard = createContentCard(movie, movieDoc.id);
                        movieGrid.appendChild(contentCard);
                    }
                });
            });
        })
        .catch((error) => {
            console.error("Error loading watchlist: ", error);
            loadingAnimation.style.display = 'none';
            movieGrid.innerHTML = '<p class="error-message">İzleme listesi yüklenirken bir hata oluştu.</p>';
        });
}

function showWatchedList() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('İzlediğiniz filmleri görüntülemek için giriş yapmalısınız.');
        return;
    }
    
    const movieGrid = document.getElementById('movieGrid');
    const loadingAnimation = document.getElementById('loadingAnimation');
    
    loadingAnimation.style.display = 'flex';
    movieGrid.innerHTML = '';
    
    firebase.firestore().collection('users').doc(user.uid)
        .collection('watched')
        .where('type', '==', 'movie')
        .get()
        .then((querySnapshot) => {
            loadingAnimation.style.display = 'none';
            
            if (querySnapshot.empty) {
                movieGrid.innerHTML = '<p class="no-content">Henüz izlediğiniz film yok.</p>';
                return;
            }
            
            querySnapshot.forEach((doc) => {
                const movieRef = firebase.firestore().collection('contents').doc(doc.data().contentId);
                movieRef.get().then((movieDoc) => {
                    if (movieDoc.exists) {
                        const movie = { id: movieDoc.id, ...movieDoc.data() };
                        const contentCard = createContentCard(movie, movieDoc.id);
                        movieGrid.appendChild(contentCard);
                    }
                });
            });
        })
        .catch((error) => {
            console.error("Error loading watched list: ", error);
            loadingAnimation.style.display = 'none';
            movieGrid.innerHTML = '<p class="error-message">İzlenen filmler yüklenirken bir hata oluştu.</p>';
        });
}

function addToWatchlist(contentId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('İzleme listesine eklemek için giriş yapmalısınız.');
        return;
    }
    
    firebase.firestore().collection('users').doc(user.uid)
        .collection('watchlist')
        .doc(contentId)
        .set({
            contentId: contentId,
            type: 'movie',
            addedAt: new Date().toISOString()
        })
        .then(() => {
            alert('Film izleme listenize eklendi.');
        })
        .catch((error) => {
            console.error("Error adding to watchlist: ", error);
            alert('Film listeye eklenirken bir hata oluştu.');
        });
}

function markAsWatched(contentId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('İzlendi olarak işaretlemek için giriş yapmalısınız.');
        return;
    }
    
    firebase.firestore().collection('users').doc(user.uid)
        .collection('watched')
        .doc(contentId)
        .set({
            contentId: contentId,
            type: 'movie',
            watchedAt: new Date().toISOString()
        })
        .then(() => {
            // Remove from watchlist if it exists
            firebase.firestore().collection('users').doc(user.uid)
                .collection('watchlist')
                .doc(contentId)
                .delete()
                .catch((error) => console.error("Error removing from watchlist: ", error));
            
            alert('Film izlendi olarak işaretlendi.');
        })
        .catch((error) => {
            console.error("Error marking as watched: ", error);
            alert('Film izlendi olarak işaretlenirken bir hata oluştu.');
        });
} 