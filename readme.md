# quadratic-equation

ИНСТРУКЦИЯ ДЛЯ ЗАПУСКА С ДОКЕРОМ

Открываем терминал в директории с dockerfile

Собираем контейнер командой docker build -t yourUsername/quadratic .
  
Для запуска c параллельным вычислением используем команду docker run yourUsername/quadratic node main.js -t [solve|solve_exception|solve_non_exception] -p
  
Для запуска c однопоточным вычислением используем команду docker run yourUsername/quadratic node main.js -t [solve|solve_exception|solve_non_exception]
  
Последовательность аргументов обазятальна

ИНСТРУКЦИЯ ДЛЯ ЗАПУСКА БЕЗ ДОКЕРА

Переходим на сайт: https://nodejs.org/en/ скачиваем и устанавливаем node js(Рекомендованную версию)

Переходим в папку с клонированым репозиторием, запускаем терминал, пишем: npm install

После установки всех библиотек: 

Для запуска c параллельным вычислением используем команду node main.js -t [solve|solve_exception|solve_non_exception] -p
  
Для запуска c однопоточным вычислением используем команду node main.js -t [solve|solve_exception|solve_non_exce