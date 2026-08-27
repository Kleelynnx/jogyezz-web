// =============================================
//  MENUNGGU HTML SELESAI DIMUAT
// =============================================
document.addEventListener('DOMContentLoaded', function () {

    // =========================================
    // 1. AMBIL SEMUA ELEMEN YANG DIBUTUHKAN
    // =========================================
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const sideDrawer = document.getElementById('side-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-links a');
    const searchInput = document.querySelector('.search-input');
    const menuCards = document.querySelectorAll('.menu-card');
    const menuSections = document.querySelectorAll('.menu-section');
    const aboutSection = document.querySelector('.about-section');

    // === ELEMEN FITUR BARU ===
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const languageToggle = document.getElementById('languageToggle');
    const languageOverlay = document.getElementById('languageOverlay');
    const closeLanguageBtn = document.getElementById('closeLanguagePopup');
    const languageItems = document.querySelectorAll('.language-item');

    // === ELEMEN TUTORIAL ===
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    const tutorialSkip = document.getElementById('tutorialSkip');
    const tutorialShow = document.getElementById('tutorialShow');
    const tutorialPointer = document.getElementById('tutorialPointer');

    // === KUMPULKAN SEMUA NAMA MENU ===
    const menuNames = [];
    menuCards.forEach(function (card) {
        const nameEl = card.querySelector('.item-name');
        if (nameEl) {
            const name = nameEl.textContent.trim();
            if (name && !menuNames.includes(name)) {
                menuNames.push(name);
            }
        }
    });
    console.log('📋 Daftar menu:', menuNames);

    // === BUAT KOTAK SUGGESTION (Dropdown) ===
    let suggestionBox = document.getElementById('autocomplete-suggestions');
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'autocomplete-suggestions';
        suggestionBox.style.cssText = `
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            right: 0;
            background: #ffffff;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            max-height: 260px;
            overflow-y: auto;
            display: none;
            z-index: 9999;
            color: #000000;
        `;
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(suggestionBox);
            console.log('✅ Suggestion box siap.');
        }
    }

    let overlay = document.querySelector('.drawer-overlay');
    if (!hamburgerIcon || !sideDrawer) {
        console.warn('⚠️ Elemen penting tidak ditemukan.');
        return;
    }

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        document.body.appendChild(overlay);
    }

    // =========================================
    // 2. FUNGSI BUKA TUTUP DRAWER
    // =========================================
    function toggleDrawer() {
        const isOpen = sideDrawer.classList.contains('open');
        if (isOpen) {
            sideDrawer.classList.remove('open');
            overlay.classList.remove('open');
        } else {
            sideDrawer.classList.add('open');
            overlay.classList.add('open');
        }
    }

    hamburgerIcon.addEventListener('click', toggleDrawer);
    overlay.addEventListener('click', toggleDrawer);

    drawerLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            drawerLinks.forEach(function (l) { l.classList.remove('highlight'); });
            this.classList.add('highlight');
            sideDrawer.classList.remove('open');
            overlay.classList.remove('open');
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && sideDrawer.classList.contains('open')) {
            sideDrawer.classList.remove('open');
            overlay.classList.remove('open');
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            if (sideDrawer.classList.contains('open')) {
                sideDrawer.classList.remove('open');
                overlay.classList.remove('open');
            }
            if (languageOverlay && languageOverlay.classList.contains('active')) {
                languageOverlay.classList.remove('active');
            }
            if (tutorialOverlay && tutorialOverlay.classList.contains('active')) {
                closeTutorial();
            }
        }
    });

    // =========================================
    // 3. FUNGSI TOAST NOTIFICATION (OPSI A)
    // =========================================
    function showToast(message, duration = 2500) {
        const oldToast = document.querySelector('.toast-notification');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 12px 28px;
            border-radius: 30px;
            font-size: 15px;
            font-weight: 500;
            z-index: 99999;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.4s ease, transform 0.4s ease;
            transform: translateX(-50%) translateY(20px);
            font-family: 'Helvetica Neue', Arial, sans-serif;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // =========================================
    // 4. FUNGSI FILTER MENU (SAAT KLIK SARAN)
    // =========================================
    function filterMenuByKeyword(keyword) {
        const kw = keyword.toLowerCase().trim();

        menuCards.forEach(function (card) {
            const name = card.querySelector('.item-name')?.textContent?.toLowerCase() || '';
            const desc = card.querySelector('.item-desc')?.textContent?.toLowerCase() || '';
            const isMatch = name.includes(kw) || desc.includes(kw);

            if (kw === '' || isMatch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        menuSections.forEach(function (section) {
            const visibleCards = section.querySelectorAll('.menu-card[style*="display: flex"]');
            if (kw !== '' && visibleCards.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });

        if (aboutSection) {
            aboutSection.style.display = 'block';
        }

        if (kw === '') {
            menuSections.forEach(function (sec) {
                sec.style.display = 'block';
            });
        }
    }

    // =========================================
    // 5. FITUR SEARCH (TANPA FILTER SAAT KETIK)
    // =========================================
    if (searchInput) {

        function showSuggestions(keyword) {
            const kw = keyword.toLowerCase().trim();
            suggestionBox.innerHTML = '';

            if (kw === '') {
                suggestionBox.style.display = 'none';
                return;
            }

            const matched = menuNames.filter(function (name) {
                return name.toLowerCase().includes(kw);
            });

            if (matched.length > 0) {
                matched.forEach(function (item) {
                    const div = document.createElement('div');
                    div.textContent = item;
                    div.style.cssText = `
                        padding: 10px 14px;
                        cursor: pointer;
                        font-size: 14px;
                        color: #000000 !important;
                        background-color: #ffffff;
                        border-bottom: 1px solid #f0f0f0;
                        transition: background 0.15s;
                    `;
                    div.addEventListener('mouseenter', function () {
                        this.style.backgroundColor = '#f5f5f5';
                    });
                    div.addEventListener('mouseleave', function () {
                        this.style.backgroundColor = '#ffffff';
                    });
                    div.addEventListener('click', function () {
                        const selected = this.textContent;
                        searchInput.value = selected;
                        suggestionBox.style.display = 'none';
                        filterMenuByKeyword(selected);
                        console.log('🔍 Filter menu dengan:', selected);
                    });
                    suggestionBox.appendChild(div);
                });
                suggestionBox.style.display = 'block';
            } else {
                const notFound = document.createElement('div');
                notFound.textContent = '😢 Produk tidak ditemukan.';
                notFound.style.cssText = `
                    padding: 16px 14px;
                    font-size: 14px;
                    color: #666666;
                    text-align: center;
                    background-color: #ffffff;
                    border-radius: 8px;
                `;
                suggestionBox.appendChild(notFound);
                suggestionBox.style.display = 'block';
            }
        }

        searchInput.addEventListener('input', function () {
            const keyword = this.value;
            showSuggestions(keyword);
            if (keyword.trim() === '') {
                filterMenuByKeyword('');
            }
        });

        searchInput.addEventListener('focus', function () {
            const keyword = this.value;
            if (keyword.trim() !== '') {
                showSuggestions(keyword);
            }
        });

        searchInput.addEventListener('blur', function () {
            setTimeout(function () {
                suggestionBox.style.display = 'none';
            }, 300);
        });

    } else {
        console.warn('⚠️ .search-input tidak ditemukan.');
    }

    // =========================================
    // 6. FITUR TEMA (LIGHT / DARK)
    // =========================================
    if (themeToggle && themeIcon) {
        let currentTheme = localStorage.getItem('jogyezz-theme') || 'light';
        applyTheme(currentTheme);

        themeToggle.addEventListener('click', function () {
            const isDark = document.body.classList.contains('dark-mode');
            const newTheme = isDark ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('jogyezz-theme', newTheme);
        });

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
                themeIcon.className = 'fas fa-moon';
            } else {
                document.body.classList.remove('dark-mode');
                themeIcon.className = 'fas fa-sun';
            }
            localStorage.setItem('jogyezz-theme', theme);
            console.log('🌓 Tema:', theme);
        }
    } else {
        console.warn('⚠️ Elemen tema tidak ditemukan.');
    }

    // =========================================
    // 7. FITUR BAHASA (DENGAN TERJEMAHAN NYATA!)
    // =========================================
    // --- Data Terjemahan Semua Konten ---
    const translations = {
        'id': {
            'brand': 'JogYezz',
            'search_placeholder': 'Cari produk',
            'drawer_ayam': 'Ayam + Nasi',
            'drawer_indomie': 'Indomie Goreng JogYezz',
            'drawer_minuman': 'Minuman JogYezz',
            'drawer_frozen': 'Frozen Food JogYezz',
            'nav_ayam': 'AYAM + NASI',
            'nav_indomie': 'INDOMIE GORENG JOGYEZZ',
            'nav_minuman': 'MINUMAN JOGYEZZ',
            'nav_frozen': 'FROZEN FOOD JOGYEZZ',
            'about_title': 'ABOUT US',
            'about_sub1': 'Mengenal Ayam Geprek JogYezz Brajan',
            'about_p1': 'Ayam Geprek JogYezz Brajan merupakan cabang ketiga dari JogYezz, yang hadir sejak November 2025 di Dusun Brajan, Tamantirto, Kasihan, Bantul, Daerah Istimewa Yogyakarta. Berawal dari keinginan untuk memperluas kehadiran JogYezz dari cabang utama di JogYezz Suryodiningratan, JogYezz Brajan hadir dengan konsep yang lebih sederhana, dekat, dan fleksibel.',
            'about_p2': 'Berbeda dari restoran pada umumnya, JogYezz Brajan beroperasi dari rumah pribadi dan tidak menyediakan area makan di tempat. Konsep ini memungkinkan kami untuk tetap menghadirkan makanan yang lezat dengan harga yang lebih terjangkau, sekaligus menjadi bagian dari usaha untuk mendukung perekonomian keluarga.',
            'about_sub2': 'Ayam Geprek Khas Jogja',
            'about_p3': 'Menu utama kami adalah ayam geprek dengan pilihan level pedas 0–5 yang dapat disesuaikan dengan selera. Selain ayam geprek klasik, tersedia pula Ayam Geprek Mozzarella dan Ayam Geprek Bakar dengan pilihan level yang sama. Setiap menu memiliki pasangan minuman yang berbeda, mulai dari Es Teh, Es Susu Putih, hingga Es Milo.',
            'about_p4': 'Bagi kami, makanan yang baik tidak harus selalu mahal. Karena itu, kualitas bahan dan harga yang terjangkau menjadi dua hal yang terus kami perhatikan dalam menghadirkan setiap menu.',
            'about_sub3': 'Pesan dengan Cara yang Lebih Fleksibel',
            'about_p5': 'JogYezz Brajan tersedia melalui GoFood, ShopeeFood, dan GrabFood. Kami juga melayani pengambilan langsung di lokasi serta pengantaran dengan harga yang lebih terjangkau karena tidak melalui potongan biaya administrasi platform makanan. Layanan pengantaran ini khusus tersedia untuk wilayah Jogja.',
            'about_p6': 'Konsep tanpa dine-in juga membuat JogYezz Brajan menjadi pilihan bagi mereka yang ingin menikmati makanan di rumah, di kos, atau di tempat lain tanpa harus datang ke restoran.',
            'about_p7': 'Dari sebuah rumah di Brajan, kami ingin menghadirkan sesuatu yang sederhana: makanan yang enak, harga yang bersahabat, dan pilihan yang mudah dijangkau kapan pun dibutuhkan—termasuk ketika malam sudah larut.',
            'lang_title': '🌐 Pilih Bahasa',
            'close_btn': '✕ Tutup',
            'theme_tooltip': 'Ganti Tema',
            'lang_tooltip': 'Pilih Bahasa',
            'discord_tooltip': 'Hubungi via Discord',
            'tutorial_title': 'Welcome to JogYezz!',
            'tutorial_desc': 'To change the <strong>theme</strong> (light/dark) or <strong>language</strong>, tap the <strong>☰ menu</strong> in the top-right corner.',
            'tutorial_skip': 'Got it',
            'tutorial_show': 'Show me'
        },
        'en': {
            'brand': 'JogYezz',
            'search_placeholder': 'Search products',
            'drawer_ayam': 'Chicken + Rice',
            'drawer_indomie': 'Indomie Fried Noodle JogYezz',
            'drawer_minuman': 'JogYezz Beverages',
            'drawer_frozen': 'JogYezz Frozen Food',
            'nav_ayam': 'CHICKEN + RICE',
            'nav_indomie': 'INDOMIE FRIED NOODLE JOGYEZZ',
            'nav_minuman': 'JOGYEZZ BEVERAGES',
            'nav_frozen': 'JOGYEZZ FROZEN FOOD',
            'about_title': 'ABOUT US',
            'about_sub1': 'About Ayam Geprek JogYezz Brajan',
            'about_p1': 'Ayam Geprek JogYezz Brajan is the third branch of JogYezz, established in November 2025 in Dusun Brajan, Tamantirto, Kasihan, Bantul, Yogyakarta. Starting from the desire to expand JogYezz\'s presence from the main branch at JogYezz Suryodiningratan, JogYezz Brajan comes with a simpler, closer, and more flexible concept.',
            'about_p2': 'Unlike typical restaurants, JogYezz Brajan operates from a private home and does not provide a dine-in area. This concept allows us to still serve delicious food at more affordable prices, while also supporting the family economy.',
            'about_sub2': 'Authentic Jogja-Style Chicken Geprek',
            'about_p3': 'Our main menu is chicken geprek with a spiciness level of 0–5 that can be customized. In addition to the classic chicken geprek, we also offer Chicken Geprek Mozzarella and Grilled Chicken Geprek with the same level options. Each menu has a different beverage pairing, ranging from Sweet Tea, Sweetened Condensed Milk, to Milo.',
            'about_p4': 'For us, good food doesn\'t have to always be expensive. Therefore, quality ingredients and affordable prices are two things we always pay attention to in every menu item.',
            'about_sub3': 'Order in a More Flexible Way',
            'about_p5': 'JogYezz Brajan is available through GoFood, ShopeeFood, and GrabFood. We also serve takeaway directly at the location and delivery at a more affordable price because there are no platform administration fees. This delivery service is specifically available for the Jogja area.',
            'about_p6': 'The no-dine-in concept also makes JogYezz Brajan a choice for those who want to enjoy food at home, in a boarding house, or elsewhere without having to go to a restaurant.',
            'about_p7': 'From a house in Brajan, we want to present something simple: delicious food, friendly prices, and options that are easy to reach whenever needed—including when it\'s late at night.',
            'lang_title': '🌐 Select Language',
            'close_btn': '✕ Close',
            'theme_tooltip': 'Change Theme',
            'lang_tooltip': 'Select Language',
            'discord_tooltip': 'Contact via Discord',
            'tutorial_title': 'Welcome to JogYezz!',
            'tutorial_desc': 'To change the <strong>theme</strong> (light/dark) or <strong>language</strong>, tap the <strong>☰ menu</strong> in the top-right corner.',
            'tutorial_skip': 'Got it',
            'tutorial_show': 'Show me'
        },
        'zh': {
            'brand': 'JogYezz',
            'search_placeholder': '搜索产品',
            'drawer_ayam': '鸡肉 + 米饭',
            'drawer_indomie': 'JogYezz 印尼炒面',
            'drawer_minuman': 'JogYezz 饮料',
            'drawer_frozen': 'JogYezz 冷冻食品',
            'nav_ayam': '鸡肉 + 米饭',
            'nav_indomie': 'JOGYEZZ 印尼炒面',
            'nav_minuman': 'JOGYEZZ 饮料',
            'nav_frozen': 'JOGYEZZ 冷冻食品',
            'about_title': '关于我们',
            'about_sub1': '关于 Ayam Geprek JogYezz Brajan',
            'about_p1': 'Ayam Geprek JogYezz Brajan 是 JogYezz 的第三家分店，于 2025 年 11 月在日惹特区班图尔 Tamantirto 的 Brajan 村落开业。源于想要从 JogYezz Suryodiningratan 主分店扩展 JogYezz 存在感的愿望，JogYezz Brajan 以更简单、更亲近、更灵活的概念呈现。',
            'about_p2': '与普通餐厅不同，JogYezz Brajan 在私人住宅中经营，不提供堂食区域。这种概念使我们能够以更实惠的价格提供美味的食物，同时也能支持家庭经济。',
            'about_sub2': '正宗日惹风味炸鸡',
            'about_p3': '我们的主打菜单是炸鸡，辣度可选择 0–5 级。除了经典的炸鸡，我们还提供马苏里拉炸鸡和烤炸鸡，同样有辣度选择。每道菜单都有不同的饮品搭配，从甜茶、炼乳到美禄。',
            'about_p4': '对我们来说，好的食物不一定要昂贵。因此，优质的食材和实惠的价格是我们始终关注的两件事。',
            'about_sub3': '以更灵活的方式订购',
            'about_p5': 'JogYezz Brajan 可通过 GoFood、ShopeeFood 和 GrabFood 订购。我们也提供到店自取，以及更实惠价格的外送服务（因为没有平台管理费）。此配送服务仅适用于日惹地区。',
            'about_p6': '无堂食概念也使 JogYezz Brajan 成为那些想在家、在宿舍或任何地方享受美食的人的选择，无需去餐厅。',
            'about_p7': '从 Brajan 的一所房子，我们想呈现一些简单的东西：美味的食物，友好的价格，以及在需要时（包括深夜）都能轻松获取的选择。',
            'lang_title': '🌐 选择语言',
            'close_btn': '✕ 关闭',
            'theme_tooltip': '切换主题',
            'lang_tooltip': '选择语言',
            'discord_tooltip': '通过 Discord 联系',
            'tutorial_title': '欢迎来到 JogYezz！',
            'tutorial_desc': '要更改 <strong>主题</strong>（亮色/暗色）或 <strong>语言</strong>，请点击右上角的 <strong>☰ 菜单</strong>。',
            'tutorial_skip': '知道了',
            'tutorial_show': '演示给我看'
        },
        'ko': {
            'brand': 'JogYezz',
            'search_placeholder': '제품 검색',
            'drawer_ayam': '치킨 + 라이스',
            'drawer_indomie': 'JogYezz 인도미 고랭',
            'drawer_minuman': 'JogYezz 음료',
            'drawer_frozen': 'JogYezz 냉동 식품',
            'nav_ayam': '치킨 + 라이스',
            'nav_indomie': 'JOGYEZZ 인도미 고랭',
            'nav_minuman': 'JOGYEZZ 음료',
            'nav_frozen': 'JOGYEZZ 냉동 식품',
            'about_title': '회사 소개',
            'about_sub1': 'Ayam Geprek JogYezz Brajan 소개',
            'about_p1': 'Ayam Geprek JogYezz Brajan은 JogYezz의 세 번째 지점으로, 2025년 11월 욕야카르타 반툴 타만티르토 브라잔 마을에 문을 열었습니다. JogYezz Suryodiningratan 본점에서 입지를 확장하려는 열망에서 시작하여, JogYezz Brajan은 더 간단하고 친근하며 유연한 콘셉트로 찾아왔습니다.',
            'about_p2': '일반 식당과 달리 JogYezz Brajan은 개인 주택에서 운영되며 홀 식사 공간을 제공하지 않습니다. 이 콘셉트를 통해 저렴한 가격으로 맛있는 음식을 제공하면서도 가족 경제를 지원할 수 있습니다.',
            'about_sub2': '정통 족자식 치킨 게프레크',
            'about_p3': '메인 메뉴는 매운맛 레벨 0–5를 선택할 수 있는 치킨 게프레크입니다. 클래식 치킨 게프레크 외에도 모짜렐라 치킨 게프레크와 구운 치킨 게프레크도 같은 레벨 옵션으로 제공됩니다. 각 메뉴는 단맛 차, 연유, 밀로 등 다양한 음료와 함께 제공됩니다.',
            'about_p4': '우리에게 좋은 음식은 항상 비싸지 않아도 됩니다. 따라서 품질 좋은 재료와 합리적인 가격은 모든 메뉴에서 항상 신경 쓰는 두 가지입니다.',
            'about_sub3': '더 유연한 주문 방법',
            'about_p5': 'JogYezz Brajan은 GoFood, ShopeeFood, GrabFood를 통해 이용할 수 있습니다. 또한 현장 직접 픽업과 플랫폼 관리 수수료가 없는 더 저렴한 배달 서비스를 제공합니다. 이 배달 서비스는 족자 지역에서만 이용 가능합니다.',
            'about_p6': '홀 식사가 없는 콘셉트는 JogYezz Brajan을 식당에 가지 않고 집이나 기숙사에서 음식을 즐기고 싶은 사람들에게 좋은 선택이 되게 합니다.',
            'about_p7': '브라잔의 한 집에서 우리는 간단한 무언가를 선사하고 싶습니다: 맛있는 음식, 친절한 가격, 그리고 필요할 때마다 (심지어 늦은 밤에도) 쉽게 접근할 수 있는 선택지.',
            'lang_title': '🌐 언어 선택',
            'close_btn': '✕ 닫기',
            'theme_tooltip': '테마 변경',
            'lang_tooltip': '언어 선택',
            'discord_tooltip': 'Discord로 연락',
            'tutorial_title': 'JogYezz에 오신 것을 환영합니다!',
            'tutorial_desc': '<strong>테마</strong>(라이트/다크)나 <strong>언어</strong>를 변경하려면 오른쪽 상단의 <strong>☰ 메뉴</strong>를 탭하세요.',
            'tutorial_skip': '알겠어요',
            'tutorial_show': '보여주세요'
        },
        'ja': {
            'brand': 'JogYezz',
            'search_placeholder': '商品を検索',
            'drawer_ayam': 'チキン + ライス',
            'drawer_indomie': 'JogYezz インドミー焼きそば',
            'drawer_minuman': 'JogYezz ドリンク',
            'drawer_frozen': 'JogYezz 冷凍食品',
            'nav_ayam': 'チキン + ライス',
            'nav_indomie': 'JOGYEZZ インドミー焼きそば',
            'nav_minuman': 'JOGYEZZ ドリンク',
            'nav_frozen': 'JOGYEZZ 冷凍食品',
            'about_title': '私たちについて',
            'about_sub1': 'Ayam Geprek JogYezz Brajan について',
            'about_p1': 'Ayam Geprek JogYezz Brajan は JogYezz の3号店で、2025年11月にジョグジャカルタ特別州バントゥル県タマンティルトのブラジャン村にオープンしました。JogYezz Suryodiningratan 本店から存在感を広げたいという願いから、JogYezz Brajan はよりシンプルで親しみやすく柔軟なコンセプトで登場しました。',
            'about_p2': '一般的なレストランとは異なり、JogYezz Brajan は個人宅で運営されており、イートインスペースはありません。このコンセプトにより、手頃な価格で美味しい料理を提供しつつ、家族経営を支えることができます。',
            'about_sub2': '本格ジョグジャ風チキンゲプレク',
            'about_p3': 'メインメニューは、辛さレベル0～5を選べるチキンゲプレクです。クラシックなチキンゲプレクに加え、モッツァレラチキンゲプレクや焼きチキンゲプレクも同じレベルのオプションでご用意しています。各メニューには、甘いお茶、コンデンスミルク、ミロなど様々なドリンクがペアリングされています。',
            'about_p4': '私たちにとって、良い料理は必ずしも高価である必要はありません。だからこそ、良質な食材と手頃な価格は、すべてのメニューで常に心がけている2つのことです。',
            'about_sub3': 'より柔軟な注文方法',
            'about_p5': 'JogYezz Brajan は GoFood、ShopeeFood、GrabFood でご利用いただけます。また、店舗での直接受け取りや、プラットフォーム管理手数料がかからないお得なデリバリーサービスも行っています。このデリバリーサービスはジョグジャ地域限定です。',
            'about_p6': 'イートインなしのコンセプトは、レストランに行かなくても自宅や寮で食事を楽しみたい人にとって、JogYezz Brajan を良い選択肢にしています。',
            'about_p7': 'ブラジャンの一軒家から、私たちはシンプルなものを届けたいと思っています：美味しい料理、フレンドリーな価格、そして必要なときにいつでも（深夜でも）簡単に手に入る選択肢。',
            'lang_title': '🌐 言語を選択',
            'close_btn': '✕ 閉じる',
            'theme_tooltip': 'テーマ変更',
            'lang_tooltip': '言語を選択',
            'discord_tooltip': 'Discordで連絡',
            'tutorial_title': 'JogYezzへようこそ！',
            'tutorial_desc': '<strong>テーマ</strong>（ライト/ダーク）または<strong>言語</strong>を変更するには、右上の<strong>☰ メニュー</strong>をタップしてください。',
            'tutorial_skip': '了解',
            'tutorial_show': '見せて'
        }
    };

    // --- FUNGSI UNTUK MENERAPKAN BAHASA ---
    function applyLanguage(lang) {
        if (!translations[lang]) return;

        const t = translations[lang];

        // 1. Brand Logo
        const brandLogo = document.querySelector('.brand-logo');
        if (brandLogo) brandLogo.textContent = t.brand;

        // 2. Search placeholder
        const searchInputEl = document.querySelector('.search-input');
        if (searchInputEl) searchInputEl.placeholder = t.search_placeholder;

        // 3. Drawer links
        const drawerLinksEl = document.querySelectorAll('.drawer-links a');
        if (drawerLinksEl.length >= 4) {
            drawerLinksEl[0].textContent = t.drawer_ayam;
            drawerLinksEl[1].textContent = t.drawer_indomie;
            drawerLinksEl[2].textContent = t.drawer_minuman;
            drawerLinksEl[3].textContent = t.drawer_frozen;
        }

        // 4. Horizontal nav links
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks.length >= 4) {
            navLinks[0].textContent = t.nav_ayam;
            navLinks[1].textContent = t.nav_indomie;
            navLinks[2].textContent = t.nav_minuman;
            navLinks[3].textContent = t.nav_frozen;
        }

        // 5. About Us
        const aboutTitle = document.querySelector('.about-title');
        if (aboutTitle) aboutTitle.textContent = t.about_title;

        const aboutSubtitles = document.querySelectorAll('.about-subtitle');
        if (aboutSubtitles.length >= 3) {
            aboutSubtitles[0].textContent = t.about_sub1;
            aboutSubtitles[1].textContent = t.about_sub2;
            aboutSubtitles[2].textContent = t.about_sub3;
        }

        const aboutTexts = document.querySelectorAll('.about-text');
        if (aboutTexts.length >= 7) {
            aboutTexts[0].textContent = t.about_p1;
            aboutTexts[1].textContent = t.about_p2;
            aboutTexts[2].textContent = t.about_p3;
            aboutTexts[3].textContent = t.about_p4;
            aboutTexts[4].textContent = t.about_p5;
            aboutTexts[5].textContent = t.about_p6;
            aboutTexts[6].textContent = t.about_p7;
        }

        // 6. Language popup
        const langTitle = document.querySelector('.language-title');
        if (langTitle) langTitle.textContent = t.lang_title;

        const closeBtn = document.querySelector('.close-language-btn');
        if (closeBtn) closeBtn.textContent = t.close_btn;

        // 7. Tooltips (title attribute)
        const themeToggleEl = document.getElementById('themeToggle');
        if (themeToggleEl) themeToggleEl.title = t.theme_tooltip;

        const langToggleEl = document.getElementById('languageToggle');
        if (langToggleEl) langToggleEl.title = t.lang_tooltip;

        const discordLink = document.querySelector('a.drawer-icon[href*="discord"]');
        if (discordLink) discordLink.title = t.discord_tooltip;

        // 8. Tutorial teks
        const tutorialTitle = document.querySelector('.tutorial-title');
        if (tutorialTitle) tutorialTitle.textContent = t.tutorial_title;

        const tutorialDesc = document.querySelector('.tutorial-desc');
        if (tutorialDesc) tutorialDesc.innerHTML = t.tutorial_desc;

        const tutorialSkipBtn = document.getElementById('tutorialSkip');
        if (tutorialSkipBtn) tutorialSkipBtn.textContent = t.tutorial_skip;

        const tutorialShowBtn = document.getElementById('tutorialShow');
        if (tutorialShowBtn) tutorialShowBtn.textContent = t.tutorial_show;

        // Simpan preferensi bahasa
        localStorage.setItem('jogyezz-lang', lang);
        console.log('🌐 Bahasa diterapkan:', lang);
    }

    // --- BACA PREFERENSI BAHASA DARI LOCALSTORAGE ---
    const savedLang = localStorage.getItem('jogyezz-lang') || 'id';
    applyLanguage(savedLang);

    // --- EVENT LISTENER UNTUK POPUP BAHASA ---
    if (languageToggle && languageOverlay) {
        languageToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            languageOverlay.classList.add('active');
            console.log('🌐 Popup bahasa dibuka');
        });

        if (closeLanguageBtn) {
            closeLanguageBtn.addEventListener('click', function () {
                languageOverlay.classList.remove('active');
                console.log('🌐 Popup bahasa ditutup');
            });
        }

        languageOverlay.addEventListener('click', function (e) {
            if (e.target === languageOverlay) {
                languageOverlay.classList.remove('active');
                console.log('🌐 Popup bahasa ditutup (klik overlay)');
            }
        });

        languageItems.forEach(function (item) {
            item.addEventListener('click', function () {
                const lang = this.getAttribute('data-lang');
                applyLanguage(lang);
                languageOverlay.classList.remove('active');
                const langNames = {
                    'id': '🇮🇩 Bahasa Indonesia',
                    'en': '🇬🇧 English',
                    'zh': '🇨🇳 中文 (Mandarin)',
                    'ko': '🇰🇷 한국어',
                    'ja': '🇯🇵 日本語'
                };
                showToast('🌐 Bahasa diubah ke: ' + (langNames[lang] || lang));
                console.log('🌐 Bahasa dipilih:', lang);
            });
        });
    } else {
        console.warn('⚠️ Elemen bahasa tidak ditemukan.');
    }

    // =========================================
    // 8. TUTORIAL / ONBOARDING WALKTHROUGH
    // =========================================
    // Fungsi untuk menutup tutorial (digunakan di banyak tempat)
    function closeTutorial() {
        if (tutorialOverlay) {
            tutorialOverlay.classList.remove('active');
        }
        if (tutorialPointer) {
            tutorialPointer.classList.remove('active');
        }
        localStorage.setItem('jogyezz-tutorial', 'true');
        console.log('📖 Tutorial ditutup.');
    }

    // Cek apakah tutorial sudah pernah ditampilkan
    const tutorialSeen = localStorage.getItem('jogyezz-tutorial');

    if (tutorialOverlay && !tutorialSeen) {
        // Tampilkan tutorial setelah 0.8 detik (biar website selesai load)
        setTimeout(() => {
            tutorialOverlay.classList.add('active');
        }, 800);
    }

    // --- Tombol "Got it" ---
    if (tutorialSkip) {
        tutorialSkip.addEventListener('click', closeTutorial);
    }

    // --- Tombol "Show me" ---
    if (tutorialShow) {
        tutorialShow.addEventListener('click', function () {
            // Tampilkan pointer ke hamburger
            if (tutorialPointer) {
                tutorialPointer.classList.add('active');
            }
            // Sembunyikan tombol "Show me" setelah diklik
            this.style.display = 'none';
            // Beri efek highlight ke hamburger
            const hamburger = document.getElementById('hamburgerIcon');
            if (hamburger) {
                hamburger.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                hamburger.style.transform = 'scale(1.2)';
                hamburger.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.6)';
                setTimeout(() => {
                    hamburger.style.transform = 'scale(1)';
                    hamburger.style.boxShadow = 'none';
                }, 600);
            }
            console.log('📖 Tutorial: Show me diklik, pointer muncul.');
        });
    }

    // --- Jika user mengklik hamburger, tutorial otomatis tutup ---
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', function () {
            if (tutorialOverlay && tutorialOverlay.classList.contains('active')) {
                closeTutorial();
            }
        });
    }

    // --- Jika user mengklik di luar card, tutorial tutup (opsional) ---
    if (tutorialOverlay) {
        tutorialOverlay.addEventListener('click', function (e) {
            if (e.target === tutorialOverlay) {
                closeTutorial();
            }
        });
    }

    // =========================================
    // 9. KONFIRMASI SCRIPT BERJALAN
    // =========================================
    console.log('✅ Script JogYezz dengan terjemahan, toast, & tutorial siap!');
    console.log('📌 Klik ikon ☰ untuk membuka menu.');
    console.log('📌 Klik ikon tema (☀️/🌙) untuk ganti tema.');
    console.log('📌 Klik ikon globe (🌐) untuk pilih bahasa.');
    console.log('📌 Bahasa akan berubah secara nyata!');
    console.log('📌 Ketik di pencarian → muncul saran menu.');
    console.log('📌 Tutorial muncul sekali (disimpan di localStorage).');
});