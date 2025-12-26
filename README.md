## Описание:
Веб-приложение для профессионального отслеживания и анализа цен на товары.

## Что сделано:
1. Chrome Extension парсит цены WB/Ozon → Backend БД
2. React Frontend показывает реальные товары из БД
3. Детальная страница + статистика
4. Backend cron каждые 5 мин парсит ВСЕ товары
5. API: GET/POST/DELETE + парсинг + обновление цен
6. JSON БД (data/users.json) - данные сохраняются
7. ProductCard с трендом

## Использованные технологии

- **Backend**: Node.js 18+, Express, JSON файловая БД
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS  
- **Extension**: Chrome Manifest V3, Content Scripts
- **Парсинг**: Universal regex + User-Agent bypass

## Для быстрого запуска:
### Клонировать/скачать проект
### Backend
cd backend  
npm install  
npm run dev  
### Frontend
cd frontend  
npm install  
npm run dev
### Chrome Extension
chrome://extensions/  
Режим разработчика → "Загрузить распакованное"  
Выбери папку extension/  

Версия проекта предварительная, не настроена сравнительная статистика, регистрация, тг-бот с обновлениями. Планируется окончить работу к 31.12.
