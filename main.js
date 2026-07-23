// ==========================================
// 1. القفل التفاعلي + الاحتفال بالدخول
// ==========================================
let confettiLoaded = false;
let confettiPromise = null;

function loadConfetti() {
    if (window.confetti) {
        confettiLoaded = true;
        return Promise.resolve();
    }

    if (confettiPromise) return confettiPromise;

    confettiPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        script.async = true;
        script.onload = () => {
            confettiLoaded = true;
            resolve();
        };
        script.onerror = () => resolve();
        document.head.appendChild(script);
    });

    return confettiPromise;
}

function triggerConfetti() {
    loadConfetti().then(() => {
        if (window.confetti) {
            window.confetti({ particleCount: 50, spread: 55, origin: { y: 0.6 } });
        }
    });
}

function checkPass() {
    const input = document.getElementById('passInput').value.trim();
    const lockCard = document.getElementById('lockScreen');
    
    if (input === "22/8/2005" || input === "22/08/2005" || input === "22082005") {
        triggerConfetti();

        const audio = document.getElementById('bgMusic');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
            isPlaying = true;
            const icon = document.getElementById('audioIcon');
            if (icon) icon.innerText = "🎶";
        }

        lockCard.style.transform = "scale(0.8)";
        lockCard.style.opacity = "0";
        setTimeout(() => {
            lockCard.classList.add('hidden');
            const mainContent = document.getElementById('mainContent');
            mainContent.classList.remove('hidden');
            initGallery();
            showDailyLoveMessageIfNeeded();
            showToast('أهلاً بكِ في عالمنا الصغير 💖');
        }, 120);
    } else {
        lockCard.classList.add('shake');
        document.getElementById('errorMsg').style.display = "block";
        setTimeout(() => lockCard.classList.remove('shake'), 400);
    }
}

function handlePassKey(e) { if (e.key === 'Enter') checkPass(); }

// ==========================================
// 2. التحكم في مشغل الموسيقى
// ==========================================
let isPlaying = false;

function toggleAudio() {
    const audio = document.getElementById('bgMusic');
    const icon = document.getElementById('audioIcon');
    const status = document.getElementById('audioStatus');

    if (isPlaying) {
        audio.pause();
        icon.innerText = "🎵";
        isPlaying = false;
        if (status) status.innerText = "الموسيقى متوقفة";
        return;
    }

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
            icon.innerText = "🎶";
            isPlaying = true;
            if (status) status.innerText = "الموسيقى شغالة";
        }).catch(() => {
            icon.innerText = "🎵";
            isPlaying = false;
            if (status) status.innerText = "اضغط مرة أخرى للسماح بالتشغيل";
        });
    } else {
        icon.innerText = "🎶";
        isPlaying = true;
        if (status) status.innerText = "الموسيقى شغالة";
    }
}

window.addEventListener('load', () => {
    const audio = document.getElementById('bgMusic');
    if (audio) {
        audio.preload = 'metadata';
        audio.load();
        setTimeout(() => {
            const icon = document.getElementById('audioIcon');
            if (icon) icon.innerText = "🎵";
        }, 300);
    }

    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('hidden');
        }
    }, 1200);
});

// ==========================================
// 3. التنقل بين الأقسام
// ==========================================
function switchTab(tab) {
    document.getElementById('gallerySection').classList.toggle('hidden', tab !== 'gallery');
    document.getElementById('chatSection').classList.toggle('hidden', tab !== 'chat');
    document.getElementById('tab-gallery').classList.toggle('active', tab === 'gallery');
    document.getElementById('tab-chat').classList.toggle('active', tab === 'chat');
}

// ==========================================
// 4. بناء معرض الصور الـ 15 مع Lightbox
// ==========================================
const galleryItems = [
    { src: "image 1.jpg", caption: "أول قاعده بعد ما اعترفت لي الجماعه بحبي❤️" },
    { src: "image 2.jpg", caption: "هنا قلبي دق يوم قاعدتنا سوا✨" },
    { src: "image 3.jpg", caption: "قاعده دي اللي بتنسيني هم الدنيا كلها 💕" },
    { src: "image 4.jpg", caption: "هنا مسكه ايدك نستني حاجات كتير🔏" },
    { src: "image 5.jpg", caption: "مشيتك جمبي هنا كانت حاجه تانيه❤️" },
    { src: "image 6.jpg", caption: "ذكرى الركن المفضل لينا 🛋️" },
    { src: "image 7.jpg", caption: "هفصل احبك لحد اخر العمر💕" },
    { src: "image 8.jpg", caption: "اللحظة دي مش هنسى جمالها بدايه الحب بتاعنا🌸" },
    { src: "image 9.jpg", caption: "هنا قولتلي نتصور ساعتها قلبي بيرقص بس زعلان اني ماشي❤️" },
    { src: "image 11.jpg", caption: "أول صورة لينا في الشقة 📸" },
    { src: "image 12.jpg", caption: "يوم تركيب الإضاءة اللي نورتي بيها حياتي💡" },
    { src: "image 13.jpg", caption: "تفاصيل بسيطة بتفرق معانا 💕" },
    { src: "image 14.jpg", caption: "مكاننا المفضل للرغوة والكلام 💬" },
    { src: "image 15.jpg", caption: "خطوة بخطوة بنبني حلمنا 🔑" },
    { src: "image 1.jpg", caption: "بيتنا دايماً عامر بيكِ ❤️" }
];

function getImageSrc(index) {
    const item = galleryItems[index - 1] || galleryItems[0];
    return encodeURI(item.src);
}

function getImageCaption(index) {
    const item = galleryItems[index - 1] || galleryItems[0];
    return item.caption;
}

function renderGalleryBatch(grid, startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
        const card = document.createElement('div');
        card.className = 'photo-card';
        const src = getImageSrc(i + 1);
        const caption = getImageCaption(i + 1);
        card.onclick = () => openLightbox(src, caption);
        card.innerHTML = `
            <img src="${src}" alt="ذكرى ${i + 1}" loading="lazy" decoding="async" onerror="this.closest('.photo-card').classList.add('image-failed'); this.style.display='none';">
            <div class="photo-caption">${caption}</div>
        `;
        grid.appendChild(card);
    }
}

function initGallery() {
    const grid = document.getElementById('galleryGrid');
    const gallerySection = document.getElementById('gallerySection');
    grid.innerHTML = '';

    const batchSize = 6;
    const initialCount = Math.min(batchSize, galleryItems.length);
    renderGalleryBatch(grid, 0, initialCount);

    const existingButton = gallerySection.querySelector('.load-more-btn');
    if (existingButton) existingButton.remove();

    if (galleryItems.length > initialCount) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.innerText = 'عرض المزيد';
        loadMoreBtn.onclick = () => {
            const nextStart = initialCount;
            const nextEnd = Math.min(galleryItems.length, nextStart + batchSize);
            renderGalleryBatch(grid, nextStart, nextEnd);
            loadMoreBtn.remove();
        };
        gallerySection.appendChild(loadMoreBtn);
    }
}

function openLightbox(src, caption) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCaption').innerText = caption;
    document.getElementById('lightbox').classList.remove('hidden');
}

function closeLightbox(force = false) {
    document.getElementById('lightbox').classList.add('hidden');
}

function toggleLike(btn) {
    btn.classList.toggle('liked');
    if(btn.classList.contains('liked')) {
        triggerConfetti();
    }
}

const quoteMessages = [
    "الحب لا يحتاج إلى كلمات كثيرة، فقط إلى قلبٍ يعرف كيف يختار.",
    "أجمل شيء في الحب هو أن تشعر أن كل لحظة معكِ تصبح أهدأ وأجمل.",
    "الذكريات لا تموت، بل تصبح أكثر دفئًا كلما تذكرتها.",
    "في قلبٍ يحبّكِ، كل يوم يصبح أروع من الذي قبله."
];

function showRandomQuote() {
    const quote = document.getElementById('quoteText');
    if (!quote) return;
    const randomQuote = quoteMessages[Math.floor(Math.random() * quoteMessages.length)];
    quote.innerText = randomQuote;
    showToast('تم تحديث العبارة 💖');
}

function showFavoriteText() {
    const favoriteText = document.getElementById('favoriteText');
    if (!favoriteText) return;

    const favorites = [
        'أحبكِ أكثر مما أستطيع أن أكتب، وأكثر مما أستطيع أن أُظهر.',
        'كل يوم معكِ يجعلني أُحِبُّكِ أكثر.',
        'أنتِ أجمل ما في هذا العالم الصغير الذي بنيناه معًا.',
        'أنتِ أنعم ذكرى في قلبي، وأجمل حلم أملكُه.'
    ];

    const randomFavorite = favorites[Math.floor(Math.random() * favorites.length)];
    favoriteText.innerText = randomFavorite;
    showToast('تم تحديث المفضلة 💕');
}

function getDayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getLoveMessageState() {
    try {
        return JSON.parse(localStorage.getItem('loveMessageState') || '{}');
    } catch (error) {
        return {};
    }
}

function saveLoveMessageState(state) {
    localStorage.setItem('loveMessageState', JSON.stringify(state));
}

function showDailyLoveMessageIfNeeded() {
    const messages = [
        "أنتِ سبب سعادتي في كل يوم، وكل ما في قلبي يردد: أنا أحبكِ أكثر مما أستطيع أن أقول.",
        "لو كان عندي اختيار بين كل شيء في العالم، هختاركِ تاني وألف مرة.",
        "أنتِ ليست مجرد ذكرى، بل أجمل ما في حياتي.",
        "كل قلبٍ يحبّكِ، وكل ضحكة منكِ تبني له فُرقانًا من السعادة."
    ];

    const now = Date.now();
    const todayKey = getDayKey();
    const state = getLoveMessageState();

    if (state.dayKey === todayKey && state.message) {
        return false;
    }

    const previousIndex = typeof state.messageIndex === 'number' ? state.messageIndex : -1;
    const messageIndex = (previousIndex + 1) % messages.length;
    const message = messages[messageIndex];

    const nextState = {
        dayKey: todayKey,
        lastShownAt: now,
        messageIndex,
        message
    };

    saveLoveMessageState(nextState);
    showToast(message);

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('رسالة جديدة 💕', { body: message });
    }

    return true;
}

function showLoveMessage() {
    const messages = [
        "أنتِ سبب سعادتي في كل يوم، وكل ما في قلبي يردد: أنا أحبكِ أكثر مما أستطيع أن أقول.",
        "لو كان عندي اختيار بين كل شيء في العالم، هختاركِ تاني وألف مرة.",
        "أنتِ ليست مجرد ذكرى، بل أجمل ما في حياتي.",
        "كل قلبٍ يحبّكِ، وكل ضحكة منكِ تبني له فُرقانًا من السعادة."
    ];

    const todayKey = getDayKey();
    const state = getLoveMessageState();

    if (state.dayKey === todayKey && state.message) {
        showToast('استني بكرا يا حبيبي، أنتِ مستعجلة بحبك 💕');
        return;
    }

    const previousIndex = typeof state.messageIndex === 'number' ? state.messageIndex : -1;
    const messageIndex = (previousIndex + 1) % messages.length;
    const message = messages[messageIndex];

    const nextState = {
        dayKey: todayKey,
        lastShownAt: Date.now(),
        messageIndex,
        message
    };

    saveLoveMessageState(nextState);
    showToast(message);

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('رسالة جديدة 💕', { body: message });
    }
}

function showToast(message) {
    const toast = document.getElementById('notificationToast');
    const body = document.getElementById('notificationBody');
    if (!toast || !body) return;

    body.innerText = message;
    toast.classList.remove('hidden');
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3200);
}

function showInstallHint() {
    const text = 'افتح الموقع من المتصفح ثم اضغط على زر التثبيت أو Add to Home Screen من القائمة، وستظهر لك الأيقونة على الشاشة الرئيسية 📲';
    showToast(text);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
}

if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
}

// ==========================================
// 5. شات ذكي ومتحرك أكثر "كالإنسان"
// ==========================================
const conversationState = {
    turnCount: 0,
    lastIntent: 'greeting',
    lastUserText: '',
    mood: 'neutral'
};

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function detectIntent(normalized) {
    if (normalized.includes('مرحبا') || normalized.includes('اهلا') || normalized.includes('السلام') || normalized.includes('هاي') || normalized.includes('هلو')) {
        return 'greeting';
    }
    if (normalized.includes('بحبك') || normalized.includes('بموت') || normalized.includes('وحشتني') || normalized.includes('غالي') || normalized.includes('قمر') || normalized.includes('حبيب') || normalized.includes('أحبك')) {
        return 'affection';
    }
    if (normalized.includes('مين انت') || normalized.includes('مين انتي') || normalized.includes('انت مين') || normalized.includes('انتي مين') || normalized.includes('عن نفسك') || normalized.includes('عن نفسكِ') || normalized.includes('أنت مين')) {
        return 'aboutBot';
    }
    if (normalized.includes('قللي عني') || normalized.includes('قولي عني') || normalized.includes('قوللي عني') || normalized.includes('عني') || normalized.includes('عنيا') || normalized.includes('بتعرف عني') || normalized.includes('عرفيني عني')) {
        return 'aboutUser';
    }
    if (normalized.includes('حزين') || normalized.includes('مضايق') || normalized.includes('زعلان') || normalized.includes('قلقان') || normalized.includes('متضايق') || normalized.includes('مكتئب') || normalized.includes('قلبي مكسور')) {
        return 'comfort';
    }
    if (normalized.includes('ازيك') || normalized.includes('إزايك') || normalized.includes('كيفك') || normalized.includes('كيف حالك') || normalized.includes('بتعمل ايه') || normalized.includes('إنت كويس')) {
        return 'checkIn';
    }
    if (normalized.includes('ممكن') || normalized.includes('تقدر') || normalized.includes('هل') || normalized.includes('أريد') || normalized.includes('أحتاج') || normalized.includes('ماذا') || normalized.includes('كيف')) {
        return 'help';
    }
    if (normalized.includes('متى') || normalized.includes('تاريخ') || normalized.includes('أين') || normalized.includes('فين') || normalized.includes('إين')) {
        return 'memory';
    }
    if (normalized.includes('شكرا') || normalized.includes('متشكر')) {
        return 'thanks';
    }
    return 'general';
}

function detectMood(normalized) {
    if (normalized.includes('حزين') || normalized.includes('مضايق') || normalized.includes('زعلان') || normalized.includes('قلقان') || normalized.includes('مكتئب')) {
        return 'sad';
    }
    if (normalized.includes('سعيد') || normalized.includes('فرحان') || normalized.includes('بسط') || normalized.includes('مبسوط')) {
        return 'happy';
    }
    return 'neutral';
}

function getBotReply(text) {
    const normalized = text.toLowerCase().trim();
    const intent = detectIntent(normalized);
    const mood = detectMood(normalized);

    const replies = {
        greeting: [
            'أهلاً يا حبيبتي، أنا هنا معاكِ وأسمع كل كلمة 💖',
            'أهلاً، من غيركِ المكان ده مش هيبقى نفس الشيء ✨',
            'أهلاً يا قمر، أنا مستعد أسمعكِ وأردّ عليكِ بكل دفء 🌸',
            'أهلاً، وده أحلى وقت أسمع فيه صوتكِ وأفهمكِ أكثر 🌷'
        ],
        affection: [
            'وأنا كمان بموت فيكي، ومش هتلاقي كلمة أحلى من اللي في قلبي دي 💕',
            'أنتِ اللي بتخلّي أي لحظة تبقى أجمل من اللي قبلها ❤️',
            'أنتِ من أجمل الأشياء اللي ممكن أكون شريكها في الحُب 🌷',
            'وأنا مش بس بقولها، دي حقيقة في قلبي من غير مجاملة ✨'
        ],
        aboutBot: [
            'أنا جزء من هذا المكان الجميل، وأكون معاكِ في كل كلمة حلوة وفي كل لحظة هادئة 💫',
            'أنا نفسي بكون هنا لمساعدتكِ وفهمكِ، وبحب أكون جنبكِ في كل وقت 🌙',
            'أنا مش مجرد ردّ، أنا كأنّي صوت صغير من القلب بيقرب منكِ أكثر ✨',
            'وأنا هنا عشان أكون معاكِ، حتى لو الكلام بسيط أو عميق 🌷'
        ],
        aboutUser: [
            'أنتِ من أجمل الناس اللي ممكن أتعرف عليهم، وفيكِ دفء ونعومة وبهجة بتخلّي أي لحظة أحلى 💖',
            'فيكِ شيء مميز، ومش بس كلام، فيه طراوة وحنان بيفرقوا عن غيركِ 🌸',
            'أنتِ عندكِ قوة صغيرة لكن جميلة جدًا، ودايمًا بتخلّي المكان اللي أنتِ فيه أحلى ❤️',
            'فيكِ سحر بسيط وهادئ، وده اللي بيخلّي الناس تفتكرّكِ من غير ما تحاولوا ✨'
        ],
        comfort: [
            'أنا هنا معاكِ، ومش هتضايقي لوحدكِ، وخلّي قلبكِ يهدأ شويّة 🌷',
            'مفيش حاجة تخلّي الدنيا تبقى قاتمة طالما فينا حبّ ودفء، وأنا معاكِ ✨',
            'أقدر أكون لكِ مساحة هادئة في وسط كل ده، وبشجعكِ تِكلمي وتهدّي 💕',
            'خلّي نفسكِ تِتَنفّسّي شوية، وكل حاجة دي بتعدّي في النهاية 🌙'
        ],
        checkIn: [
            'أنا كويس يا حبيبتي، وأهم حاجة إنكِ بخير أو على الأقل إنكِ عايزة تتكلمي 🌼',
            'أنا هنا ومبسوط إنكِ سألتي، وبحب أسمع منكِ أكتر من أي شيء 🌷',
            'أنا شغال على القلب والذكريات، وبحب أكون معاكِ في أي لحظة 💫',
            'أنا بخير، ومش عايز أسمع غيركِ وأعرف إيه اللي في قلبكِ 🌸'
        ],
        help: [
            'أكيد، وأنا أقدر أكون معاكِ في أي حاجة من القلب أو الذكريات أو الكلام الجميل 💕',
            'أيوه، وممكن نكلم عن أي حاجة تحبيها أو أي شيء يهمكِ 🌸',
            'أكيد، وأنا أقدر أساعدكِ وأردّ على كل سؤال بيجي في قلبكِ ✨',
            'أيوه، وممكن نكمل النقطة دي مع بعض، خطوة خطوة 🌷'
        ],
        memory: [
            'الذكريات اللي معاكِ ما بتختفيش، وبتفضل حية في كل لحظة جميلة ❤️',
            'في كل حاجة بتتذكريها، فيه جزء من الحُب بيعيش تاني 🌙',
            'الوقت ممكن يمرّ، لكن الأحاسيس اللي معاكِ بتنقّذ من غير ما يضيعوا ✨',
            'الذكريات دي مش بتختفي، دي بتبقى فينا كأنها جزء من النفس 🌸'
        ],
        thanks: [
            'أهلاً يا حبيبتي، دا من حقي أديكي سعادة صغيرة 💖',
            'أنتِ من الناس اللي بتخلّي الكلام ده يبان جميل جدًا 🌷',
            'أنتِ تستاهلي كل دفء وكلمة لطيفة، وأنا سعيد إنكِ هنا 💫',
            'وأنا كمان بفرح إنكِ معايا، دا شيء مهم جدًا ✨'
        ],
        general: [
            'أنا فاهمكِ، وبحب أسمع منكِ أكتر. قلّي عن يومكِ أو عن أي حاجة في قلبكِ 🌷',
            'دي نقطة جميلة، وممكن نكمل منها في كلام أحلى وأعمق ✨',
            'أنا شايف إن فيكِ حاجة جميلة جدًا، وعايز أسمع منكِ أكتر عن اللي تفتكريه 💖',
            'أسمعكِ بجد، وممكن نكمل من هنا في اتجاه أحلى 🌸'
        ]
    };

    let reply = pickRandom(replies[intent]);

    if (conversationState.turnCount > 0 && intent === 'general' && conversationState.lastIntent === 'affection') {
        reply = pickRandom([
            'وأنا كمان بفضل معاكِ في الكلام ده، ومش عايزة أعمل حاجة غير أسمعكِ أكتر 🌷',
            'بقولكِ الحقيقة، الكلام معاكِ بيخلّي أي لحظة تبقى أجمل ✨',
            'وأنا لسه مستمر معاكِ في الكلام ده، وبحب أسمعكِ أكتر 🌸'
        ]);
    }

    if (mood === 'sad' && intent !== 'comfort') {
        reply = `أسمعكِ بجد، وأنا عايز أكون معاكِ في ده. ${reply}`;
    }

    if (conversationState.turnCount > 1 && intent === 'help') {
        reply = `${reply} وده معناه إننا ممكن نستكمل من أي نقطة تحبيها 🌷`;
    }

    if (conversationState.turnCount > 1 && intent === 'greeting') {
        reply = `${reply} وقلبي مفتوح لكِ كالمعتاد 💖`;
    }

    conversationState.turnCount += 1;
    conversationState.lastIntent = intent;
    conversationState.lastUserText = text;
    conversationState.mood = mood;
    return reply;
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    const typing = document.getElementById('typingIndicator');
    typing.classList.remove('hidden');

    const delay = 220 + Math.floor(Math.random() * 180);
    setTimeout(() => {
        typing.classList.add('hidden');
        const botReply = getBotReply(text);
        addMessage(botReply, 'bot');
    }, delay);
}

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    msgDiv.innerText = text;
    const box = document.getElementById('chatMessages');
    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;

    if (sender === 'bot') {
        msgDiv.style.animation = 'fadeInMessage 0.35s ease';
    }
}

function handleChatKey(e) { if (e.key === 'Enter') sendMessage(); }