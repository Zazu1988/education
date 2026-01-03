//ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
const container = document.getElementById('game-container');
const items = document.querySelectorAll('.item');

let active = null;    //элемент, который мы тянем в данный момент
let offsetX = 0;      //расстояние от курсора до левого края картинки
let offsetY = 0;      //расстояние от курсора до верхнего края картинки


//ИНИЦИАЛИЗАЦИЯ (запуск при загрузке)
items.forEach(item => {
    //рассчитать доступную область для случайного появления
    //offsetWidth берет реальную ширину картинки, которая указана в HTML или CSS
    const maxX = container.clientWidth - item.offsetWidth;
    const maxY = container.clientHeight - item.offsetHeight;

    //рандомный разброс картинок внутри контейнера
    item.style.left = Math.random() * maxX + 'px';
    item.style.top = Math.random() * maxY + 'px';

    //рандомный начальный поворот (0, 90, 180 или 270 градусов)
    const angle = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
    item.dataset.rotate = angle;
    item.style.transform = `rotate(${angle}deg)`;
    
    //добавим слушатель захвата мышкой
    item.addEventListener('mousedown', startDrag);
});

/** * ДОБАВЛЕНО ДЛЯ АДАПТИВНОСТИ:
 * При сворачивании/разворачивании меню или изменении размера окна, 
 * проверяем, чтобы картинки не остались за пределами видимости поля.
 */
window.addEventListener('resize', () => {
    items.forEach(item => {
        const maxX = container.clientWidth - item.offsetWidth;
        const currentX = parseFloat(item.style.left);
        
        //если картинка "вылетела" за правую границу поля — возвращаем её в границы
        if (currentX > maxX) {
            item.style.left = Math.max(0, maxX) + 'px';
        }
    });
});


//ФУНКЦИИ ПЕРЕТАСКИВАНИЯ
function startDrag(e) {
    //проверием: нажата ЛКМ (0) и клик был именно по картинке
    const targetItem = e.target.closest('.item');
    if (e.button !== 0 || !targetItem) return;

    active = targetItem; //фиксируем, что взяли эту картинку

    //запоминить в какое место картинки мы ткнули курсором
    const rect = active.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    //пока лкм зажата, следим за перемещением мыши по всему документу
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    //меняем курсор на "сжатый кулак" и отменяем стандартные действия браузера
    active.style.cursor = 'grabbing';
    e.preventDefault(); 
}

function drag(e) {
    if (!active) return; //если ничего не захвачено, ничего не делаем

    const contRect = container.getBoundingClientRect();

    //вычисляем новые координаты картинки относительно контейнера
    let x = e.clientX - contRect.left - offsetX;
    let y = e.clientY - contRect.top - offsetY;

    //ограничение. не даем картинке выйти за пределы рамки поля
    x = Math.max(0, Math.min(x, container.clientWidth - active.offsetWidth));
    y = Math.max(0, Math.min(y, container.clientHeight - active.offsetHeight));

    //применить новые координаты
    active.style.left = x + 'px';
    active.style.top = y + 'px';
}

function stopDrag() {
    if (!active) return;

    active.style.cursor = 'grab'; //возвращаем обычную "ладошку"
    active = null; //отпускаем картинку

    //убираем слежку за мышкой, чтобы не нагружать процессор
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);

    checkWin(); //проверка, не собрал ли пользователь пазл
}


//ФУНКЦИЯ ПОВОРОТА (Двойной клик)
items.forEach(item => {
    item.addEventListener('dblclick', (e) => {
        const target = e.currentTarget;
        //к текущему углу прибавляем 90. Если стало 360 — сбрасываем в 0.
        let r = (parseInt(target.dataset.rotate) + 90) % 360;
        target.dataset.rotate = r;
        target.style.transform = `rotate(${r}deg)`;
        checkWin();
    });
});


//МАТЕМАТИКА И ЛОГИКА ПОБЕДЫ
//считает расстояние между центрами двух элементов
function distance(a, b) {
    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();
    const x1 = r1.left + r1.width / 2;
    const y1 = r1.top + r1.height / 2;
    const x2 = r2.left + r2.width / 2;
    const y2 = r2.top + r2.height / 2;
    return Math.hypot(x1 - x2, y1 - y2);
}

function checkWin() {
    let ok = true;

    items.forEach((item, i) => {
        //если картинка не повернута ровно (угол 0) — победы нет
        if (item.dataset.rotate !== "0") ok = false;

        for (let j = i + 1; j < items.length; j++) {
            const d = distance(item, items[j]);

            //если у картинок одинаковый data-type (части одного предмета)
            if (item.dataset.type === items[j].dataset.type) {
                if (d > 130) ok = false; //они должны быть близко
            } else {
                if (d < 180) ok = false; //разные предметы не должны накладываться
            }
        }
    });

    if (ok) {
        document.getElementById('win').classList.add('show');
    }
}