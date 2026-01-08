let isPaused = false; //флаг паузы
const gameArea = document.getElementById('gameArea'); //зона падения

//все возможные задания
const possible = [
    { key: 'material', value: 'металл', text: 'Ловите МЕТАЛЛ!' },
    { key: 'material', value: 'дерево', text: 'Ловите ДЕРЕВО!' },
    { key: 'color', value: 'красный', text: 'Ловите КРАСНОЕ!' },
    { key: 'shape', value: 'круглая', text: 'Ловите КРУГЛОЕ!' }
];

//выбираем одну цель на всю игру
const curTask = possible[Math.floor(Math.random() * possible.length)];
document.getElementById('taskText').textContent = curTask.text;

let gameSpeed = 3; //скорость падения

function spawn() {
    if (isPaused) return; //если игра на паузе (например, конец времени)
    
    //шанс 60%, что появится нужный предмет
    const isTarget = Math.random() < 0.6;
    const pool = isTarget ? items.filter(i => i[curTask.key] === curTask.value) : items;
    const data = pool[Math.floor(Math.random() * pool.length)];
    
    //создаем летящий элемент
    const el = document.createElement('div');
    el.className = 'flying-item';
    el.style.left = Math.random() * (gameArea.clientWidth - 70) + 'px'; //рандом по горизонтали
    el.style.top = '-100px'; //начало выше экрана
    el.innerHTML = `<img src="${data.image}">`;
    
    //клик по летящему предмету
    el.onmousedown = () => {
        if (data[curTask.key] === curTask.value) { 
            updateScore(20); // +20 очков
            gameSpeed += 0.2; //ускоряем падение для сложности
        } else { 
            updateScore(-15); // -15 штраф
        }
        el.remove(); //убираем пойманный предмет
    };

    gameArea.appendChild(el);

    //анимация падения
    let pos = -100;
    const fall = setInterval(() => {
        if (isPaused) return;
        pos += gameSpeed;
        el.style.top = pos + 'px';
        
        //если предмет упал за нижний край
        if (pos > gameArea.clientHeight) {
            clearInterval(fall);
            el.remove();
        }
    }, 20);
}

//каждую секунду создаем новый предмет
const spawnInterval = setInterval(spawn, 1000);

