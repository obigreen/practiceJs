document.addEventListener("DOMContentLoaded", () => {
    const puzzle = document.getElementById('puzzle'); // Получаем элемент с ID 'puzzle'
    let tiles = shuffle(['1', '2', '3', '4', '5', '6', '7', '8', '9']); // Создаем и перемешиваем массив плиток
    const solution = ['1', '2', '3', '4', '5', '6', '7', '8', '9']; // Правильное расположение плиток

    // Инициализация плиток
    tiles.forEach((tile, i) => {
        puzzle.appendChild(createTileElement(tile, i)); // Добавляем плитки в контейнер puzzle
    });

    function move(index) {
        const emptyIndex = tiles.indexOf('9'); // Находим индекс пустой плитки
        const validMoves = getValidMoves(emptyIndex); // Получаем допустимые перемещения для пустой плитки

        if (validMoves.includes(index)) { // Проверка, допустимо ли перемещение
            // Меняем местами выбранную плитку и пустую плитку
            [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
            renderTiles(); // Обновляем отображение плиток
            checkSolution(); // Проверяем, решена ли головоломка
        }
    }

    function getValidMoves(emptyIndex) {
        // Определяем допустимые перемещения для пустой плитки
        const moves = {
            0: [1, 3],
            1: [0, 2, 4],
            2: [1, 5],
            3: [0, 4, 6],
            4: [1, 3, 5, 7],
            5: [2, 4, 8],
            6: [3, 7],
            7: [4, 6, 8],
            8: [5, 7]
        };
        return moves[emptyIndex];
    }

    function renderTiles() {
        // Обновляем отображение плиток на экране
        puzzle.innerHTML = ''; // Очищаем контейнер puzzle
        tiles.forEach((tile, i) => {
            const tileElement = createTileElement(tile, i); // Создаем элемент плитки
            puzzle.appendChild(tileElement); // Добавляем плитки в контейнер puzzle
        });
    }

    function createTileElement(tile, index) {
        // Создаем элемент плитки
        const tileElement = document.createElement('div'); // Создаем элемент div для плитки
        tileElement.className = 'tile'; // Добавляем класс 'tile' к элементу div
        if (tile === '9') {
            tileElement.classList.add('empty'); // Если плитка пустая ('9'), добавляем класс 'empty'
        }
        tileElement.textContent = tile === '9' ? '' : tile; // Добавляем текст в элемент плитки (пустая плитка остается без текста)
        tileElement.addEventListener('click', () => move(index)); // Добавляем обработчик события клика для перемещения плиток
        return tileElement; // Возвращаем созданный элемент плитки
    }

    function checkSolution() {
        // Проверяем, решена ли головоломка
        if (tiles.join('') === solution.join('')) {
            alert('Головоломка решена!'); // Отображаем сообщение
        }
    }
});

// Функция для перемешивания плиток с использованием алгоритма тасования Фишера-Йетса
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Выбираем случайный индекс от 0 до i
        [array[i], array[j]] = [array[j], array[i]]; // Меняем местами элементы
    }
    return array; // Возвращаем перемешанный массив
}



