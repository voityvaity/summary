# egorfenin.ru — интерактивное резюме

Персональный сайт Егора Фенина, Junior Python Backend Developer.

- Сайт: [egorfenin.ru](https://egorfenin.ru)
- GitHub: [voityvaity](https://github.com/voityvaity)
- Основной backend-проект: [kittygram_final](https://github.com/voityvaity/kittygram_final)

## Что реализовано

- интерактивная обложка и адаптивное резюме;
- поддержка клавиатуры и режима уменьшенной анимации;
- автоматическое скачивание актуального DOCX;
- ссылки на контакты, GitHub и проекты;
- адаптивная вёрстка для телефона и компьютера.

## Стек

React, TypeScript, Vinext, Vite, CSS. Продакшен развёрнут на Amvera, домен подключён отдельно.

## Локальный запуск

Требуется Node.js 22.13 или новее.

```bash
npm install
npm run dev
```

Проверка перед публикацией:

```bash
npm test
```

## Структура

- `app/page.tsx` — содержание и интерактивность;
- `app/globals.css` — визуальное оформление и адаптивность;
- `app/layout.tsx` — метаданные страницы;
- `public/resume-egor-fenin-2026.docx` — скачиваемая версия резюме;
- `amvera.yml` — настройки сборки и запуска на Amvera.

Секреты и локальные файлы окружения не должны попадать в репозиторий.
