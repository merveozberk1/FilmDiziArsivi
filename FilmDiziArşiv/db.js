// Firebase Konfigürasyonu
const firebaseConfig = {
    apiKey: "AIzaSyCJ92KAKVbLN1A0YUeuxMJwbC-qxT38Mm4",
    authDomain: "filmdiziarsivis.firebaseapp.com",
    projectId: "filmdiziarsivis",
    storageBucket: "filmdiziarsivis.appspot.com",
    messagingSenderId: "795643873947",
    appId: "1:795643873947:web:e3e6a23776eab43bbb9cef"
};

// Veritabanı İşlemleri
const DB = {
    // Veritabanı ve kimlik doğrulama referansları
    db: null,
    auth: null,
    user: null,
    
    // Firebase'i başlat
    init() {
        return new Promise((resolve, reject) => {
            try {
                // Firebase uygulamasını başlat
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                
                // Firestore ve Auth referanslarını al
                this.db = firebase.firestore();
                this.auth = firebase.auth();
                
                // Auth durumu değişikliklerini dinle
                this.auth.onAuthStateChanged(user => {
                    this.user = user;
                    console.log('Auth durumu değişti:', user ? 'Giriş yapıldı' : 'Çıkış yapıldı');
                });
                
                console.log('Firebase başarıyla başlatıldı');
                resolve(this.db);
                
                // Demo içerikleri kontrol et ve ekle
                this.checkAndLoadDemoContent();
                
            } catch (error) {
                console.error('Firebase başlatma hatası:', error);
                reject(error);
                
                // Hata durumunda IndexedDB'ye geri dön
                this.initIndexedDB()
                    .then(resolve)
                    .catch(reject);
            }
        });
    },
    
    // IndexedDB'yi başlat (yedek olarak)
    initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('FilmDiziArsiv', 1);
            
            // Veritabanı ilk kez oluşturulduğunda veya sürüm yükseltildiğinde çalışır
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // İçerik store'u oluştur
                if (!db.objectStoreNames.contains('contents')) {
                    const contentStore = db.createObjectStore('contents', { keyPath: 'id', autoIncrement: true });
                    
                    // İndeksler oluştur
                    contentStore.createIndex('title', 'title', { unique: false });
                    contentStore.createIndex('type', 'type', { unique: false });
                    contentStore.createIndex('year', 'year', { unique: false });
                    contentStore.createIndex('genre', 'genre', { unique: false });
                }
                
                // İzlenen içerik store'u oluştur
                if (!db.objectStoreNames.contains('watched')) {
                    const watchedStore = db.createObjectStore('watched', { keyPath: 'id' });
                    watchedStore.createIndex('contentId', 'contentId', { unique: true });
                    watchedStore.createIndex('watchedDate', 'watchedDate', { unique: false });
                }
            };
            
            // Başarılı bağlantı
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB veritabanına başarıyla bağlanıldı (yedek)');
                resolve(this.db);
            };
            
            // Hata durumu
            request.onerror = (event) => {
                console.error('IndexedDB hatası:', event.target.error);
                reject(event.target.error);
            };
        });
    },
    
    // Demo içerikleri kontrol et ve ekle (bir kerelik)
    checkAndLoadDemoContent() {
        // Firebase kullanılıyorsa koleksiyonu kontrol et
        if (this.db && typeof this.db.collection === 'function') {
            this.db.collection('contents').get().then(snapshot => {
                if (snapshot.empty) {
                    console.log('Hiç kayıt bulunamadı, demo içerikler ekleniyor...');
                    this.loadDemoContents();
                } else {
                    console.log('Mevcut kayıtlar bulundu, demo içerikler yüklenmeyecek.');
                }
            }).catch(error => {
                console.error('Firestore erişim hatası:', error);
                // Hata durumunda offline demo içerikleri yükle
                this.loadDemoContents(true);
            });
        } else if (this.db) {
            // IndexedDB için kontrol
            const transaction = this.db.transaction(['contents'], 'readonly');
            const store = transaction.objectStore('contents');
            const countRequest = store.count();
            
            countRequest.onsuccess = () => {
                if (countRequest.result === 0) {
                    console.log('IndexedDB boş, demo içerikler ekleniyor...');
                    this.loadDemoContents(true);
                } else {
                    console.log('IndexedDB\'de içerikler mevcut.');
                }
            };
        }
    },
    
    // Demo içeriklerini yükle
    loadDemoContents(useIndexedDB = false) {
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

        const allContent = [...demoMovies, ...demoSeries];
        
        if (useIndexedDB) {
            // IndexedDB'ye ekle
            const transaction = this.db.transaction(['contents'], 'readwrite');
            const store = transaction.objectStore('contents');
            
            allContent.forEach(content => {
                store.put(content);
            });
            
            console.log('Demo içerikler IndexedDB\'ye yüklendi.');
        } else {
            // Firestore'a ekle
            const batch = this.db.batch();
            
            allContent.forEach(content => {
                const docRef = this.db.collection('contents').doc(content.id);
                batch.set(docRef, content);
            });
            
            batch.commit()
                .then(() => console.log('Demo içerikler Firestore\'a yüklendi.'))
                .catch(error => console.error('Demo içerik yükleme hatası:', error));
        }
    },
    
    // Tüm içerikleri getir
    getAllContents() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            // Firebase kullanılıyorsa
            if (typeof this.db.collection === 'function') {
                this.db.collection('contents').get()
                    .then(snapshot => {
                        const contents = [];
                        snapshot.forEach(doc => {
                            contents.push(doc.data());
                        });
                        resolve(contents);
                    })
                    .catch(error => {
                        console.error('Firestore veri alma hatası:', error);
                        reject(error);
                    });
            } else {
                // IndexedDB kullanılıyorsa
                const transaction = this.db.transaction(['contents'], 'readonly');
                const store = transaction.objectStore('contents');
                const request = store.getAll();
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = (event) => {
                    reject(event.target.error);
                };
            }
        });
    },
    
    // Belirli bir türe göre içerikleri getir (film, dizi veya tümü)
    getContentsByType(type) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            if (type === 'all') {
                this.getAllContents().then(resolve).catch(reject);
                return;
            }
            
            const transaction = this.db.transaction(['contents'], 'readonly');
            const store = transaction.objectStore('contents');
            const index = store.index('type');
            const request = index.getAll(type);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    },
    
    // Arama yap
    searchContents(query) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            this.getAllContents()
                .then(contents => {
                    const lowerQuery = query.toLowerCase();
                    const results = contents.filter(content => {
                        return (
                            content.title.toLowerCase().includes(lowerQuery) ||
                            (content.director && content.director.toLowerCase().includes(lowerQuery)) ||
                            (content.starring && content.starring.toLowerCase().includes(lowerQuery)) ||
                            (content.genre && content.genre.toLowerCase().includes(lowerQuery))
                        );
                    });
                    resolve(results);
                })
                .catch(reject);
        });
    },
    
    // İçerik ekle
    addContent(content) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            const transaction = this.db.transaction(['contents'], 'readwrite');
            const store = transaction.objectStore('contents');
            const request = store.add(content);
            
            request.onsuccess = () => {
                resolve(request.result); // Eklenen içeriğin ID'sini döndürür
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    },
    
    // İçerik güncelle
    updateContent(content) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            const transaction = this.db.transaction(['contents'], 'readwrite');
            const store = transaction.objectStore('contents');
            const request = store.put(content);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    },
    
    // İçerik sil
    deleteContent(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            // Firebase kullanılıyorsa
            if (typeof this.db.collection === 'function') {
                this.db.collection('contents').doc(id).delete()
                    .then(() => {
                        // İzlenenler listesinden de sil
                        return this.db.collection('watched').where('contentId', '==', id).get();
                    })
                    .then(snapshot => {
                        const batch = this.db.batch();
                        snapshot.forEach(doc => batch.delete(doc.ref));
                        return batch.commit();
                    })
                    .then(() => resolve(true))
                    .catch(error => {
                        console.error('Firestore silme hatası:', error);
                        reject(error);
                    });
            } else {
                // IndexedDB kullanılıyorsa
                const transaction = this.db.transaction(['contents', 'watched'], 'readwrite');
                const contentStore = transaction.objectStore('contents');
                const watchedStore = transaction.objectStore('watched');
                const watchedIndex = watchedStore.index('contentId');
                
                // İçeriği sil
                const deleteRequest = contentStore.delete(id);
                
                // İzlenenler listesinden de sil
                const watchedRequest = watchedIndex.getKey(id);
                watchedRequest.onsuccess = () => {
                    if (watchedRequest.result) {
                        watchedStore.delete(watchedRequest.result);
                    }
                };
                
                transaction.oncomplete = () => {
                    resolve(true);
                };
                
                transaction.onerror = (event) => {
                    reject(event.target.error);
                };
            }
        });
    },
    
    // İçerik detayı getir
    getContent(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            // Firebase kullanılıyorsa
            if (typeof this.db.collection === 'function') {
                this.db.collection('contents').doc(id).get()
                    .then(doc => {
                        if (doc.exists) {
                            resolve(doc.data());
                        } else {
                            resolve(null);
                        }
                    })
                    .catch(error => {
                        console.error('Firestore veri alma hatası:', error);
                        reject(error);
                    });
            } else {
                // IndexedDB kullanılıyorsa
                const transaction = this.db.transaction(['contents'], 'readonly');
                const store = transaction.objectStore('contents');
                const request = store.get(id);
                
                request.onsuccess = () => {
                    resolve(request.result);
                };
                
                request.onerror = (event) => {
                    reject(event.target.error);
                };
            }
        });
    },
    // İzlenen içerik ekle
    addToWatched(contentId, rating, notes) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            // Önce içerik var mı kontrol et
            this.getContent(contentId)
                .then(content => {
                    if (!content) {
                        throw new Error('İçerik bulunamadı!');
                    }
                    
                    const watchedItem = {
                        id: `watched_${contentId}`,
                        contentId: contentId,
                        watchedDate: new Date().toISOString(),
                        rating: rating || content.rating || 0,
                        notes: notes || ''
                    };
                    
                    // Firebase kullanılıyorsa
                    if (typeof this.db.collection === 'function') {
                        // Kullanıcı giriş yapmış mı kontrol et
                        if (this.user) {
                            watchedItem.userId = this.user.uid;
                        }
                        
                        return this.db.collection('watched').doc(watchedItem.id).set(watchedItem);
                    } else {
                        // IndexedDB kullanılıyorsa
                        const transaction = this.db.transaction(['watched'], 'readwrite');
                        const store = transaction.objectStore('watched');
                        return new Promise((resolve, reject) => {
                            const request = store.put(watchedItem);
                            request.onsuccess = () => resolve();
                            request.onerror = event => reject(event.target.error);
                        });
                    }
                })
                .then(() => resolve(true))
                .catch(error => reject(error));
        });
    },
    
    // İzlenen içeriği çıkar
    removeFromWatched(contentId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            const watchedId = `watched_${contentId}`;
            
            // Firebase kullanılıyorsa
            if (typeof this.db.collection === 'function') {
                this.db.collection('watched').doc(watchedId).delete()
                    .then(() => resolve(true))
                    .catch(error => {
                        console.error('Firestore silme hatası:', error);
                        reject(error);
                    });
            } else {
                // IndexedDB kullanılıyorsa
                const transaction = this.db.transaction(['watched'], 'readwrite');
                const store = transaction.objectStore('watched');
                const request = store.delete(watchedId);
                
                request.onsuccess = () => resolve(true);
                request.onerror = event => reject(event.target.error);
            }
        });
    },
    
    // Tüm izlenen içerikleri getir
    getAllWatched() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            // Firebase kullanılıyorsa
            if (typeof this.db.collection === 'function') {
                // Kullanıcı giriş yapmışsa sadece kendi içeriklerini getir
                let query = this.db.collection('watched');
                if (this.user) {
                    query = query.where('userId', '==', this.user.uid);
                }
                
                query.get()
                    .then(snapshot => {
                        const watchedItems = [];
                        snapshot.forEach(doc => watchedItems.push(doc.data()));
                        return watchedItems;
                    })
                    .then(watchedItems => {
                        // İzlenen içerikler için içerik detaylarını al
                        const contentPromises = watchedItems.map(item => 
                            this.getContent(item.contentId).then(content => ({
                                ...content,
                                watchedDate: item.watchedDate,
                                watchedId: item.id,
                                watchedRating: item.rating,
                                watchedNotes: item.notes
                            }))
                        );
                        
                        return Promise.all(contentPromises);
                    })
                    .then(contents => {
                        // null değerleri filtrele (silinmiş içerikler)
                        resolve(contents.filter(content => content !== null));
                    })
                    .catch(error => {
                        console.error('Firestore izlenen içerik alma hatası:', error);
                        reject(error);
                    });
            } else {
                // IndexedDB kullanılıyorsa
                const transaction = this.db.transaction(['watched', 'contents'], 'readonly');
                const watchedStore = transaction.objectStore('watched');
                const contentStore = transaction.objectStore('contents');
                const watchedRequest = watchedStore.getAll();
                
                watchedRequest.onsuccess = () => {
                    const watchedItems = watchedRequest.result;
                    const contentPromises = watchedItems.map(item => 
                        new Promise((resolve, reject) => {
                            const contentRequest = contentStore.get(item.contentId);
                            contentRequest.onsuccess = () => {
                                if (contentRequest.result) {
                                    resolve({
                                        ...contentRequest.result,
                                        watchedDate: item.watchedDate,
                                        watchedId: item.id,
                                        watchedRating: item.rating,
                                        watchedNotes: item.notes
                                    });
                                } else {
                                    resolve(null);
                                }
                            };
                            contentRequest.onerror = event => reject(event.target.error);
                        })
                    );
                    
                    Promise.all(contentPromises)
                        .then(contents => {
                            // null değerleri filtrele (silinmiş içerikler)
                            resolve(contents.filter(content => content !== null));
                        })
                        .catch(error => reject(error));
                };
                
                watchedRequest.onerror = event => reject(event.target.error);
            }
        });
    },
    
    // QR kod önerisi için benzer içerikleri getir
    getRecommendations(contentId) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Veritabanı henüz başlatılmadı!'));
                return;
            }
            
            // Önce seçilen içeriği al
            this.getContent(contentId)
                .then(content => {
                    if (!content) {
                        throw new Error('İçerik bulunamadı!');
                    }
                    
                    // Tüm içerikleri getir ve benzerlik hesapla
                    return this.getAllContents().then(allContents => {
                        // Aynı ID'ye sahip içeriği çıkar
                        const otherContents = allContents.filter(c => c.id !== contentId);
                        
                        // Benzerlik puanlarını hesapla
                        return otherContents.map(c => {
                            let similarityScore = 0;
                            
                            // Aynı türse (film veya dizi) +1 puan
                            if (c.type === content.type) similarityScore += 1;
                            
                            // Aynı yönetmense +2 puan
                            if (c.director && content.director && c.director === content.director) 
                                similarityScore += 2;
                            
                            // Kategori benzerliği (ortak kategori sayısına göre puan)
                            const contentGenres = content.genre ? content.genre.split(/,\s*/) : [];
                            const cGenres = c.genre ? c.genre.split(/,\s*/) : [];
                            
                            const commonGenres = contentGenres.filter(g => 
                                cGenres.some(cg => cg.toLowerCase() === g.toLowerCase())
                            );
                            
                            similarityScore += commonGenres.length * 2;
                            
                            // Yıl yakınlığı (10 yıl içindeyse +1 puan)
                            if (Math.abs(c.year - content.year) <= 10) 
                                similarityScore += 1;
                            
                            return {
                                content: c,
                                score: similarityScore
                            };
                        });
                    });
                })
                .then(scoredContents => {
                    // Benzerlik puanına göre sırala ve en benzer 3 içeriği döndür
                    const sortedContents = scoredContents.sort((a, b) => b.score - a.score);
                    const recommendations = sortedContents.slice(0, 3).map(sc => sc.content);
                    resolve(recommendations);
                })
                .catch(error => reject(error));
        });
    },
    
    // Giriş yap
    login(email, password) {
        return new Promise((resolve, reject) => {
            if (!this.auth) {
                reject(new Error('Auth henüz başlatılmadı!'));
                return;
            }
            
            this.auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    this.user = userCredential.user;
                    resolve(userCredential.user);
                })
                .catch(error => {
                    console.error('Giriş hatası:', error);
                    reject(error);
                });
        });
    },
    
    // Kayıt ol
    register(email, password) {
        return new Promise((resolve, reject) => {
            if (!this.auth) {
                reject(new Error('Auth henüz başlatılmadı!'));
                return;
            }
            
            this.auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    this.user = userCredential.user;
                    resolve(userCredential.user);
                })
                .catch(error => {
                    console.error('Kayıt hatası:', error);
                    reject(error);
                });
        });
    },
    
    // Çıkış yap
    logout() {
        return new Promise((resolve, reject) => {
            if (!this.auth) {
                reject(new Error('Auth henüz başlatılmadı!'));
                return;
            }
            
            this.auth.signOut()
                .then(() => {
                    this.user = null;
                    resolve(true);
                })
                .catch(error => {
                    console.error('Çıkış hatası:', error);
                    reject(error);
                });
        });
    }
}; 