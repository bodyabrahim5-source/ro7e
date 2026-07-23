const CACHE_NAME = 'love-app-v2';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './icon.png'
];

// تثبيت ملفات الـ Shell الأساسية فقط لضمان سرعة ونجاح التثبيت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.log('Cache install error:', err))
  );
});

// تفعيل وتحديث الكاش
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// التعامل مع الطلبات والملفات
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // بالنسبة لصفحة الـ Navigation الرئيسية
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // بالنسبة لباقي الملفات (الصور، الصوت، الخ)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // عدم تخزين ملفات الفيديو/الصوت الضخمة لتفادي المشاكل
        if (response.status === 200 && !event.request.url.includes('song.')) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});