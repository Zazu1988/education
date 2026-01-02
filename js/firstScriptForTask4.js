// Исходные данные
const latin = ["Consuetudo est altera natura", "Nota bene", "Nulla calamitas sola", "Per aspera ad astra"];
const russian = ["Привычка - вторая натура", "Заметьте хорошо!", "Беда не приходит одна", "Через тернии к звёздам"];

//создаем массив индексов [0, 1, 2, 3] для отслеживания использованных фраз
let indexesShow = [...Array(latin.length).keys()];
let clickCount = 0; //счетчик для определения четности нажатия (цвета фона)

//находим элементы в DOM
const output = document.getElementById("output"); //куда выводим фразы
const list = document.getElementById("phraseList"); //список в aside

//ФУНКЦИЯ: показать фразу по одной
document.getElementById("showBtn").onclick = () => {
    //если в массиве индексов ничего не осталось
    if (indexesShow.length === 0) { 
        alert("Фразы закончились"); 
        return; 
    }
    
    clickCount++; //увеличить счетчик при каждом клике
    
    //выбираем случайный индекс из доступных
    const rnd = Math.floor(Math.random() * indexesShow.length);
    const i = indexesShow.splice(rnd, 1)[0]; //удаляем индекс чтобы не повторялся

    const div = document.createElement("div");
    //применяем класс в зависимости от счетчика: четный - class1, нечетный - class2
    div.className = clickCount % 2 === 0 ? "class1" : "class2";
    div.textContent = latin[i] + " — " + russian[i];
    output.appendChild(div); //добавляем в блок вывода
};

//ФУНКЦИЯ: перекрасить синхронно
document.getElementById("repaintBtn").onclick = () => {
    const allDivs = output.querySelectorAll('div'); //возьмем все созданные фразы
    if (allDivs.length < 2) return; //если фраз меньше двух то красить нечего

    //проверяем первую четную строку (индекс 1 в массиве - это 2-я фраза)
    const secondRow = allDivs[1];
    //если она уже жирная, значит мы хотим "выключить" жирность у всех сразу
    const shouldBeBold = !secondRow.classList.contains('bold');

    //проходим циклом по всем строкам
    allDivs.forEach((div, index) => {
        //проверяем порядковый номер на четность (2-я, 4-я, 6-я...)
        if ((index + 1) % 2 === 0) {
            if (shouldBeBold) {
                div.classList.add('bold'); //сделаем жирным
            } else {
                div.classList.remove('bold'); //вернем обычный
            }
        }
    });
};

//ФУНКЦИЯ: создать весь список задание 3
document.getElementById("createBtn").onclick = () => {
    list.innerHTML = ""; //очистить список перед созданием, чтобы не дублировать
    
    //перебираем массивы и создаем структуру li -> ul -> li
    latin.forEach((lat, i) => {
        const liMain = document.createElement("li");
        liMain.textContent = lat; //латинская фраза (верхний уровень)

        const subUl = document.createElement("ul");
        const liSub = document.createElement("li");
        liSub.textContent = russian[i]; //перевод (вложенный уровень)

        subUl.appendChild(liSub); //вкладываем перевод в под-список
        liMain.appendChild(subUl); //вкладываем под-список в основной элемент
        list.appendChild(liMain);   //добавляем в OL в aside
    });
};