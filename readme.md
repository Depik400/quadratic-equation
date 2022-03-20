# quadratic-equation

ИНСТРУКЦИЯ ДЛЯ ЗАПУСКА С ДОКЕРОМ

Открываем терминал в директории с dockerfile

Собираем контейнер командой docker build -t yourUsername/quadratic .
  
Для запуска c параллельным вычислением используем команду docker run yourUsername/quadratic node parallelMain.js
  
Для запуска c однопоточным вычислением используем команду docker run yourUsername/quadratic node main.js
  

# ИНСТРУКЦИЯ ДЛЯ ЗАПУСКА БЕЗ ДОКЕРА

Переходим на сайт: https://nodejs.org/en/ скачиваем и устанавливаем node js(версия 16.13)

Переходим в папку с клонированым репозиторием, запускаем терминал, пишем: npm install

После установки всех библиотек: 

Для запуска c параллельным вычислением используем команду node parallelMain.js
  
Для запуска c однопоточным вычислением используем команду node main.js
