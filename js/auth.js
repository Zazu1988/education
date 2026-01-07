const nameInput = document.getElementById('playerName'); //поле ввода имени игрока
const startButton = document.getElementById('startBtn'); //кнопка запуска игры

//если мы на странице входа, вешаем событие на кнопку
if (startButton) {
    startButton.addEventListener('click', startGame);
}

//функция начала новой игры
function startGame() {
    const playerName = nameInput.value.trim();
    if (playerName === '') {
        alert('Пожалуйста, введите имя');
        return;
    }
    //сохраняем объект игрока: имя, начальные очки и уровень
    const player = { name: playerName, score: 0, level: 1 };
    localStorage.setItem('currentPlayer', JSON.stringify(player));
    //ПЕРЕХОД к первому уровню
    window.location.href = '../pages/kursovoj_level1.html';
}

//функция для кнопок "Ур. 1", "Ур. 2" и т.д. для отладки
function debugNavigate(targetUrl) {
    //создаем сессию "Гостя", чтобы страницы уровней не выдавали ошибок
    const guestPlayer = { name: "Гость", score: 0, level: 1 };
    localStorage.setItem('currentPlayer', JSON.stringify(guestPlayer));
    //переходим по адресу (адрес уже должен включать нужный файл внутри pages)
    window.location.href = targetUrl;
}

//функция для кнопки "Повторить" в таблице рекордов
function retryGame(name) {
    //берем имя игрока из таблицы и сбрасываем прогресс для новой попытки
    const player = { name: name, score: 0, level: 1 };
    localStorage.setItem('currentPlayer', JSON.stringify(player));
    //переходим на первый уровень
    window.location.href = '../pages/kursovoj_level1.html';
}

//функция возврата на главную страницу (кнопка "Главная")
function goToMain() {
    //очищаем текущего игрока
    localStorage.removeItem('currentPlayer');
    window.location.href = '../pages/kursovoj.html';

}
