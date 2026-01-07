const taskText = document.getElementById('taskText'); //элемент для вывода текста задания
const container = document.getElementById('itemsContainer'); //область для вывода карточек

//весь список задач для раундов
const allTasks = [
    { key: 'color', value: 'красный', text: 'Найдите КРАСНЫЕ предметы' },
    { key: 'color', value: 'черный', text: 'Найдите ЧЕРНЫЕ предметы' },
    { key: 'material', value: 'металл', text: 'Найдите предметы из МЕТАЛЛА' },
    { key: 'material', value: 'дерево', text: 'Найдите предметы из ДЕРЕВА' },
    { key: 'shape', value: 'круглая', text: 'Найдите КРУГЛЫЕ предметы' },
    { key: 'shape', value: 'прямоугольная', text: 'Найдите ПРЯМОУГОЛЬНЫЕ предметы' },
    { key: 'color', value: 'синий', text: 'Найдите СИНИЕ предметы' }
];

//перемешиваем задачи и выбираем 5 раундов
let levelTasks = [...allTasks].sort(() => 0.5 - Math.random()).slice(0, 5);
let round = 0; //номер текущего раунда
const maxRounds = 5; 

function startTask() {
    //проверка завершения всех раундов
    if (round >= maxRounds) {
        saveProgress(); //сохраняем очки (функция из game.js)
        alert("Уровень 1 пройден! Переходим к сортировке.");
        //переход на второй уровень
        window.location.href = '../pages/kursovoj_level2.html';
        return;
    }

    //получаем текущее задание
    const cur = levelTasks[round];
    taskText.textContent = `Раунд ${round + 1}/${maxRounds}: ${cur.text}`;
    container.innerHTML = ''; //очистка поля
    
    //выбираем 10 случайных предметов из базы data.js
    const pool = [...items].sort(() => 0.5 - Math.random()).slice(0, 10);
    //считаем, сколько из них правильных
    let needed = pool.filter(i => i[cur.key] === cur.value).length;

    //если правильных предметов не выпало, перезапускаем подбор раунда
    if (needed === 0) { startTask(); return; }

    //создаем карточки предметов
    pool.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item';
        card.innerHTML = `<img src="${item.image}" class="item-image"><div>${item.name}</div>`;
        
        //обработка двойного клика
        card.addEventListener('dblclick', () => {
            if (item[cur.key] === cur.value) {
                card.classList.add('correct'); //подсветка верного выбора
                updateScore(10); //начисляем 10 очков (из game.js)
                needed--;
                //если все цели в раунде найдены
                if (needed === 0) {
                    round++;
                    setTimeout(startTask, 1000); //пауза перед следующим раундом
                }
            } else {
                card.classList.add('wrong'); //подсветка ошибки
                updateScore(-5); //штраф 5 очков
            }
        });
        container.appendChild(card); //добавляем на страницу
    });
}

startTask(); //запуск игры

