const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
    const target = Number(counter.innerText);
    let value = 0;

    const update = () => {
        const increment = Math.ceil(target / 60);

        value += increment;

        if (value > target) value = target;

        counter.innerText = value;

        if (value < target) {
            requestAnimationFrame(update);
        }
    };

    update();
});

// =======================
// Loading Button Donasi
// =======================

const formDonasi = document.querySelector("form");

if (formDonasi) {

    formDonasi.addEventListener("submit", function () {

        const btn = formDonasi.querySelector("button[type='submit']");

        if (btn) {

            btn.disabled = true;

            btn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2"></span>
                Mengirim Donasi...
            `;

        }

    });

}