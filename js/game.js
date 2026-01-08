//управление таймером, очками и сохранением прогресса

//загружаем данные текущего игрока из памяти браузера
const playerData = JSON.parse(localStorage.getItem('currentPlayer'));

//состояние игры в текущей сессии
const gameState = {
    score: (playerData && playerData.score) || 0, //берем очки из памяти или 0
    level: (playerData && playerData.level) || 1  //берем уровень из памяти или 1
};

//находим элементы интерфейса для отображения данных
const scoreField = document.getElementById('score');
const timeField = document.getElementById('time');
const levelField = document.getElementById('level');
const nameField = document.getElementById('playerName');

//заполняем интерфейс данными, если соответствующие поля есть на странице
if (nameField && playerData) nameField.textContent = playerData.name;
if (scoreField) scoreField.textContent = gameState.score;
if (levelField) levelField.textContent = gameState.level;

//настройка таймера (60 секунд на уровень)
//ЗАПУСК ТАЙМЕРА ТОЛЬКО НА ИГРОВЫХ СТРАНИЦАХ
let timer = null;

if (playerData && timeField) {
    let timeLeft = 60;
    timeField.textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timeField.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

//функция изменения счета (вызывается из level1.js, level2.js и т.д.)
function updateScore(value) {
    gameState.score += value;
    if (scoreField) scoreField.textContent = gameState.score;
}

//сохранение текущего результата в localStorage перед переходом
function saveProgress() {
    if (playerData) {
        playerData.score = gameState.score;
        localStorage.setItem('currentPlayer', JSON.stringify(playerData));
    }
}

//функция смены уровня игры
function setLevel(newLevel) {
    gameState.level = newLevel;
    if (levelField) levelField.textContent = newLevel;

    if (playerData) {
        playerData.level = newLevel;
        localStorage.setItem('currentPlayer', JSON.stringify(playerData));
    }
}

//завершение игры по истечении времени
function endGame() {
    clearInterval(timer);
    // Останавливаем падение предметов, если мы на 3 уровне
    if (typeof spawnInterval !== 'undefined') clearInterval(spawnInterval);
    
    saveProgress();

    //если время вышло на финальном уровне — сохраняем в таблицу рекордов
    if (window.location.href.includes('kursovoj_level3.html')) {
        finalizeGame();
    } else {
        alert(`Время вышло! Ваш счет: ${gameState.score}`);
        window.location.href = '../pages/kursovoj.html'; //возврат на экран входа
    }
}

//запись финального результата в историю рекордов
function finalizeGame() {
    if (playerData && playerData.name !== "Гость") {
        let history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        //ищем, есть ли уже такой игрок в таблице
        const idx = history.findIndex(p => p.name === playerData.name);
        if (idx !== -1) {
            //если новый рекорд выше старого — обновляем
            if (gameState.score > history[idx].score) history[idx].score = gameState.score;
        } else {
            //если игрока нет — добавляем новую запись
            history.push({ name: playerData.name, score: gameState.score });
        }
        localStorage.setItem('gameHistory', JSON.stringify(history));
    }
    //переход к таблице рекордов
    window.location.href = '../pages/kursovoj_rating.html';

}




