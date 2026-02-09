/**
 * CHUU Request Logic
 */
const siteConfig = {
    meta: {
        framework: 'V4',
        type: 'form',
        mode: 'demo',
        lang: 'ko',
        theme: false
    },
    api: {
        server: 'damso',
        turnstile: '0x4AAAAAABrG4DQP8tkp1_TI',
        redirect: '../'
    },
    allowed_extensions: ['jpg', 'png', 'webp', 'zip', 'pdf', 'xlsx']
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.V4) {
        window.V4.init(siteConfig).then((app) => {
            initDynamicUI();
            initPriceCalculator();
        });
    }
});

function initDynamicUI() {
    const pickupSelect = document.getElementById('pickup_method');
    const addressGroup = document.getElementById('group-address');
    const addressInput = addressGroup ? addressGroup.querySelector('input') : null;

    const toggleAddress = () => {
        if (!pickupSelect || !addressGroup) return;

        const isDelivery = pickupSelect.value === 'delivery';
        if (isDelivery) {
            addressGroup.classList.remove('hidden');
            if (addressInput) addressInput.setAttribute('required', 'required');
        } else {
            addressGroup.classList.add('hidden');
            if (addressInput) {
                addressInput.removeAttribute('required');
                addressInput.value = '';
            }
        }
    };

    if (pickupSelect) {
        pickupSelect.addEventListener('change', toggleAddress);
        toggleAddress();
    }

    const cakeTypeSelect = document.getElementById('cake_type');
    const fileGroup = document.getElementById('group-file');

    const toggleFile = () => {
        if (!cakeTypeSelect || !fileGroup) return;

        const type = cakeTypeSelect.value;
        if (!type || type === 'lettering') {
            fileGroup.classList.add('hidden');
        } else {
            fileGroup.classList.remove('hidden');
        }
    };

    if (cakeTypeSelect) {
        cakeTypeSelect.addEventListener('change', toggleFile);
        toggleFile();
    }
}

function initPriceCalculator() {
    const form = document.getElementById('order-form');
    const totalDisplay = document.getElementById('total-price');
    const cakeTypeSelect = document.getElementById('cake_type');

    if (!form || !totalDisplay) return;

    const calculate = () => {
        let total = 0;

        if (cakeTypeSelect) {
            const typeOpt = cakeTypeSelect.selectedOptions[0];
            if (typeOpt && typeOpt.dataset.price) {
                total += parseFloat(typeOpt.dataset.price);
            }
        }

        const optionSelects = form.querySelectorAll('select:not(#cake_type):not(#pickup_method)');
        optionSelects.forEach(sel => {
            const opt = sel.selectedOptions[0];
            if (opt && opt.dataset.price) {
                total += parseFloat(opt.dataset.price);
            }
        });

        const cookieInputs = form.querySelectorAll('input[type="number"]');
        cookieInputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.unitPrice) || 0;
            total += qty * price;
        });

        totalDisplay.innerText = `$${total.toFixed(2)}`;

        if (total > 0) {
            totalDisplay.classList.add('active');
        } else {
            totalDisplay.classList.remove('active');
        }
    };

    form.addEventListener('change', calculate);
    form.addEventListener('input', calculate);
    calculate();
}