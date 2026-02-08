// Данные для калькулятора
const materialsData = {
    plaster: [
        { id: 1, name: "Гипсовая штукатурка (Rotband)", rate: 8.5, unit: "кг/м²", price: 450, eco: 3, life: 15, hint: "Быстро сохнет, легко шлифуется. Подходит для жилых помещений." },
        { id: 2, name: "Цементная штукатурка", rate: 17, unit: "кг/м²", price: 300, eco: 2, life: 25, hint: "Прочная, влагостойкая. Для ванных, фасадов." },
        { id: 3, name: "Глиняная штукатурка (эко)", rate: 12, unit: "кг/м²", price: 650, eco: 5, life: 20, hint: "Натуральный материал, регулирует влажность. Премиум-класс." }
    ],
    tile: [
        { id: 1, name: "Керамическая плитка", rate: 1.05, unit: "м²/м²", price: 1200, eco: 3, life: 30, hint: "Классика, прочная. Клей + затирка дополнительно." },
        { id: 2, name: "Керамогранит", rate: 1.05, unit: "м²/м²", price: 1800, eco: 2, life: 40, hint: "Сверхпрочный, для мест с высокой нагрузкой." },
        { id: 3, name: "Эко-плитка из бамбука", rate: 1.05, unit: "м²/м²", price: 2200, eco: 5, life: 15, hint: "Натуральный материал, тёплый на ощупь." }
    ],
    paint: [
        { id: 1, name: "Водоэмульсионная краска", rate: 0.25, unit: "л/м²", price: 800, eco: 4, life: 7, hint: "Без запаха, быстро сохнет. Для сухих помещений." },
        { id: 2, name: "Акриловая краска", rate: 0.2, unit: "л/м²", price: 1200, eco: 3, life: 10, hint: "Влагостойкая, прочная. Для кухонь, ванных." },
        { id: 3, name: "Известковая краска (эко)", rate: 0.3, unit: "л/м²", price: 1500, eco: 5, life: 8, hint: "Антибактериальная, паропроницаемая. Натуральный состав." }
    ],
    insulation: [
        { id: 1, name: "Минеральная вата", rate: 0.1, unit: "м³/м²", price: 2000, eco: 4, life: 50, hint: "Негорючая, хорошая звукоизоляция. Толщина 100мм." },
        { id: 2, name: "Пенополистирол", rate: 0.1, unit: "м³/м²", price: 1500, eco: 2, life: 40, hint: "Лёгкий, дешёвый. Низкая паропроницаемость." },
        { id: 3, name: "Эковата (целлюлоза)", rate: 0.12, unit: "м³/м²", price: 2500, eco: 5, life: 45, hint: "Натуральный утеплитель, отличная экологичность." }
    ]
};

// Рекомендации для энергоэффективности
const recommendations = {
    plaster: "Для улучшения теплоизоляции используйте тёплые штукатурки с перлитом. Это снизит теплопотери на 15-20%.",
    tile: "Выбирайте тёмную плитку для пола в помещениях с южной стороны — она аккумулирует тепло. Используйте тёплые полы для энергоэффективности.",
    paint: "Светлые тона краски увеличивают отражение света, снижая затраты на освещение. Теплоизоляционные краски уменьшают потери тепла.",
    insulation: "Правильное утепление фасада окупается за 3-5 лет за счёт экономии на отоплении. Утепляйте и кровлю тоже!"
};

// Переменные состояния
let currentWorkType = 'plaster';
let currentStep = 1;
let selectedMaterial = null;

// DOM элементы
const workTypes = document.querySelectorAll('.work-type');
const areaInput = document.getElementById('area');
const areaRange = document.getElementById('areaRange');
const materialSelect = document.getElementById('material');
const materialHint = document.getElementById('materialHint');
const steps = document.querySelectorAll('.step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация выбора работ
    workTypes.forEach(type => {
        type.addEventListener('click', function() {
            workTypes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentWorkType = this.dataset.work;
            updateMaterials();
            updateStep(2);
        });
    });

    // Связь поля ввода и ползунка площади
    areaInput.addEventListener('input', function() {
        areaRange.value = this.value;
    });

    areaRange.addEventListener('input', function() {
        areaInput.value = this.value;
    });

    // Обновление подсказки при выборе материала
    materialSelect.addEventListener('change', function() {
        updateMaterialHint();
    });

    // Кнопки навигации
    prevBtn.addEventListener('click', () => changeStep(-1));
    nextBtn.addEventListener('click', () => changeStep(1));
    calculateBtn.addEventListener('click', calculate);
    resetBtn.addEventListener('click', resetCalculator);

    // Загрузка первого типа работ по умолчанию
    document.querySelector('.work-type[data-work="plaster"]').classList.add('active');
    updateMaterials();
});

// Обновление списка материалов
function updateMaterials() {
    materialSelect.innerHTML = '';
    const materials = materialsData[currentWorkType];
    
    materials.forEach(material => {
        const option = document.createElement('option');
        option.value = material.id;
        option.textContent = `${material.name} (${material.price} ₽/${material.unit.split('/')[0]})`;
        materialSelect.appendChild(option);
    });
    
    updateMaterialHint();
}

// Обновление подсказки о материале
function updateMaterialHint() {
    const materials = materialsData[currentWorkType];
    const selectedId = parseInt(materialSelect.value);
    const material = materials.find(m => m.id === selectedId);
    
    if (material) {
        selectedMaterial = material;
        materialHint.querySelector('span').textContent = material.hint;
    }
}

// Изменение шага
function changeStep(direction) {
    const newStep = currentStep + direction;
    
    if (newStep >= 1 && newStep <= 3) {
        updateStep(newStep);
    }
}

// Обновление отображения шага
function updateStep(stepNumber) {
    currentStep = stepNumber;
    
    // Скрыть все шаги
    steps.forEach(step => step.classList.remove('active'));
    
    // Показать текущий шаг
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Обновить состояние кнопок
    prevBtn.disabled = stepNumber === 1;
    nextBtn.style.display = stepNumber === 3 ? 'none' : 'flex';
    calculateBtn.style.display = stepNumber === 3 ? 'flex' : 'none';
    
    // На шаге 2 обновляем материалы
    if (stepNumber === 2) {
        updateMaterials();
    }
}

// Основной расчёт
function calculate() {
    if (!selectedMaterial) return;
    
    const area = parseFloat(areaInput.value);
    const material = selectedMaterial;
    
    // Расчёт количества материала
    const quantity = area * material.rate;
    let unit = material.unit;
    
    // Форматирование единиц измерения
    if (unit.startsWith('кг')) {
        unit = quantity > 1000 ? 'тонн' : 'кг';
        const displayQuantity = quantity > 1000 ? (quantity / 1000).toFixed(2) : Math.ceil(quantity);
        document.getElementById('materialsResult').textContent = `${displayQuantity} ${unit}`;
    } else if (unit.startsWith('л')) {
        const displayQuantity = Math.ceil(quantity);
        document.getElementById('materialsResult').textContent = `${displayQuantity} ${unit.split('/')[0]}`;
    } else {
        const displayQuantity = Math.ceil(quantity);
        document.getElementById('materialsResult').textContent = `${displayQuantity} ${unit.split('/')[0]}`;
    }
    
    // Расчёт стоимости
    const cost = quantity * material.price;
    const roundedCost = Math.round(cost / 100) * 100;
    document.getElementById('costResult').textContent = `${roundedCost.toLocaleString('ru-RU')} ₽`;
    
    // Экологический след
    const ecoTexts = ["Очень высокий", "Высокий", "Средний", "Низкий", "Очень низкий"];
    const ecoColors = ["#f56565", "#ed8936", "#ecc94b", "#48bb78", "#38a169"];
    document.getElementById('ecoResult').textContent = ecoTexts[material.eco - 1];
    document.getElementById('ecoBar').style.width = `${(6 - material.eco) * 20}%`;
    document.getElementById('ecoBar').style.background = ecoColors[material.eco - 1];
    
    // Рекомендации
    document.getElementById('recommendations').textContent = recommendations[currentWorkType];
    
    // Таблица сравнения
    updateComparisonTable(area);
    
    // Переход к шагу с результатами
    updateStep(3);
}

// Обновление таблицы сравнения
function updateComparisonTable(area) {
    const tableBody = document.querySelector('#comparisonTable tbody');
    tableBody.innerHTML = '';
    
    const materials = materialsData[currentWorkType];
    
    materials.forEach(material => {
        const cost = area * material.rate * material.price;
        const roundedCost = Math.round(cost / 100) * 100;
        const ecoTexts = ["Очень высокий", "Высокий", "Средний", "Низкий", "Очень низкий"];
        
        const row = document.createElement('tr');
        
        // Выделение выбранного материала
        if (material.id === selectedMaterial.id) {
            row.style.backgroundColor = '#f0f7ff';
            row.style.fontWeight = '500';
        }
        
        row.innerHTML = `
            <td>${material.name}</td>
            <td>${roundedCost.toLocaleString('ru-RU')} ₽</td>
            <td>${ecoTexts[material.eco - 1]}</td>
            <td>${material.life} лет</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Сброс калькулятора
function resetCalculator() {
    // Сброс выбора работ
    workTypes.forEach(type => type.classList.remove('active'));
    document.querySelector('.work-type[data-work="plaster"]').classList.add('active');
    currentWorkType = 'plaster';
    
    // Сброс ввода
    areaInput.value = 20;
    areaRange.value = 20;
    
    // Сброс шага
    updateStep(1);
    
    // Сброс результатов
    document.getElementById('materialsResult').textContent = '-';
    document.getElementById('costResult').textContent = '-';
    document.getElementById('ecoResult').textContent = '-';
    document.getElementById('ecoBar').style.width = '50%';
    document.getElementById('recommendations').textContent = '-';
    
    // Сброс таблицы
    document.querySelector('#comparisonTable tbody').innerHTML = `
        <tr><td colspan="4" style="text-align: center; color: #a0aec0;">Выполните расчёт, чтобы увидеть сравнение</td></tr>
    `;
}

// Инициализация таблицы
document.querySelector('#comparisonTable tbody').innerHTML = `
    <tr><td colspan="4" style="text-align: center; color: #a0aec0;">Выполните расчёт, чтобы увидеть сравнение</td></tr>
`;