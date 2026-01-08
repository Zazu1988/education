const container = document.getElementById('itemsContainer'); //контейнер с предметами
const bins = [document.getElementById('bin1'), document.getElementById('bin2')]; //две корзины

//список задач на сортировку
const tasks = [
    { label: 'Материал', key: 'material', v1: 'металл', v2: 'дерево' },
    { label: 'Цвет', key: 'color', v1: 'красный', v2: 'белый' },
    { label: 'Форма', key: 'shape', v1: 'круглая', v2: 'прямоугольная' }
].sort(() => 0.5 - Math.random());

let round = 0;

function initLevel() {
    //переход на 3 уровень после 3-х раундов
    if (round >= 3) { 
        saveProgress(); 
        setLevel(3);
        window.location.href = '../pages/kursovoj_level3.html'; 
        return; 
    }
    
    const cur = tasks[round];
    document.getElementById('taskText').textContent = `Сортировка: ${cur.label}`;
    
    //настраиваем названия корзин и их цели
    bins[0].querySelector('.bin-label').textContent = cur.v1; 
    bins[0].dataset.target = cur.v1;
    bins[1].querySelector('.bin-label').textContent = cur.v2; 
    bins[1].dataset.target = cur.v2;
    
    container.innerHTML = ''; //очистка поля
    
    //фильтруем предметы для раунда (те, что подходят под одну из корзин)
    items.filter(i => i[cur.key] === cur.v1 || i[cur.key] === cur.v2)
         .slice(0, 6).forEach(item => {
            const card = document.createElement('div');
            card.className = 'item'; 
            card.draggable = true; //разрешаем перетаскивание
            card.innerHTML = `<img src="${item.image}" class="item-image"><div>${item.name}</div>`;
            
            //запоминаем данные предмета при захвате мышью
            card.ondragstart = (e) => { 
                e.dataTransfer.setData('j', JSON.stringify(item)); 
                card.classList.add('dragging'); 
            };
            card.ondragend = () => card.classList.remove('dragging');
            container.appendChild(card);
         });
}

//настройка зон приема КОРЗИН
bins.forEach(b => {
    b.ondragover = e => e.preventDefault(); //разрешаем "бросать" в корзину
    b.ondrop = e => {
        const data = JSON.parse(e.dataTransfer.getData('j')); //получаем данные предмета
        const cur = tasks[round];
        //проверяем, в ту ли корзину попал предмет
        if (data[cur.key] === b.dataset.target) {
            updateScore(15); // +15 очков за успех
            //если предметов больше нет, переходим к след. раунду
            if (container.querySelectorAll('.item').length <= 1) {
                round++;
                setTimeout(initLevel, 500);
            }
        } else {
            updateScore(-10); // -10 очков за ошибку
        }
        //удаляем предмет с поля после броска
        const dragged = document.querySelector('.dragging');
        if (dragged) dragged.remove();
    };
});

initLevel(); //запуск

