// Menunggu seluruh konten halaman (HTML) selesai dimuat sebelum menjalankan script.
document.addEventListener("DOMContentLoaded", () => {

    const content = document.getElementById("content");
    const footer = document.getElementById("footer");

    // Definisikan "peta" rute kita.
    // Kiri adalah path URL, kanan adalah file template yang akan dimuat.
    const routes = {
        "/quiz1/": "/quiz1/templates/home.html",
        "/quiz1/profile/": "/quiz1/templates/profile.html",
        "/quiz1/hometown/": "/quiz1/templates/hometown.html",
        "/quiz1/food/": "/quiz1/templates/food.html",
        "/quiz1/tourist/": "/quiz1/templates/tourist.html",
    };

    // Fungsi ini membersihkan URL agar konsisten saat dijalankan di server lokal.
    // Contoh: "/quiz1/index.html" menjadi "/quiz1/"
    // Contoh: "/quiz1/profile" menjadi "/quiz1/profile/"
    function normalizePath(path) {
    if (path.endsWith('index.html')) {
        path = path.replace('index.html', '');
    }
    if (path.length > 1 && !path.endsWith('/')) {
        path += '/';
    }
    // Jika path kosong (dari index.html di root), default ke /quiz1/
    if (path === "" || path === "/") {
        path = "/quiz1/";
    }
    return path;
}

    // Fungsi untuk menampilkan halaman 404.
    function show404(path) {
        content.innerHTML = `<div class="container text-center my-5 py-5">
                                <h1 class="display-1 fw-bold">404</h1>
                                <p class="lead">Halaman Tidak Ditemukan</p>
                                <p>Alamat URL <strong>${path}</strong> tidak ada.</p>
                                <a href="/quiz1/" class="btn btn-primary-custom nav-link mt-3">Kembali ke Home</a>
                             </div>`;
        footer.style.display = 'block';
    }

    // Fungsi utama untuk memuat konten.
    async function loadContent(path) {
        const normalizedPath = normalizePath(path);
        const routeHtml = routes[normalizedPath];

        if (!routeHtml) {
            show404(normalizedPath);
            return;
        }
        
        footer.style.display = (normalizedPath === '/quiz1/') ? 'none' : 'block';

        try {
            const response = await fetch(routeHtml);
            if (!response.ok) throw new Error("File template tidak ditemukan");
            content.innerHTML = await response.text();
        } catch (error) {
            show404(normalizedPath);
            console.error("Gagal memuat konten:", error);
        }
    }

    // Mengendalikan semua klik pada link yang relevan di seluruh website.
    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("a");

        if (!link || !link.hasAttribute('href') || !link.getAttribute('href').startsWith('/quiz1/')) {
            return;
        }

        e.preventDefault();
        const path = link.getAttribute("href");

        if (window.location.pathname !== path) {
            window.history.pushState({}, "", path);
            loadContent(path);
        }
    });

    // Menangani tombol back/forward di browser.
    window.addEventListener("popstate", () => {
        loadContent(window.location.pathname);
    });

    // Memuat konten awal saat halaman pertama kali dibuka.
    loadContent(window.location.pathname);
});