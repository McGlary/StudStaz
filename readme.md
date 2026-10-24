# StudStaž — каталог стажировок и вакансий

Учебное клиент-серверное веб-приложение для лабораторной работы № 3. Frontend на HTML/CSS/JavaScript обращается к REST API на FastAPI; данные хранятся в SQLite через SQLAlchemy.

## Основная сущность

**Вакансия (`Vacancy`)**: `id`, `title`, `company`, `direction`, `format`, `skills`, `description`, `is\\\\\\\_new`, `created\\\\\\\_at`.

## API

|Метод|Путь|Назначение|
|-|-|-|
|GET|`/api/vacancies`|Список вакансий|
|POST|`/api/vacancies`|Создать вакансию (ответ 201)|
|GET|`/api/vacancies/{id}`|Получить одну вакансию|
|PATCH|`/api/vacancies/{id}`|Изменить поля вакансии|
|DELETE|`/api/vacancies/{id}`|Удалить вакансию (ответ 204)|

Ошибки: `404`, если запись не найдена; `422`, если данные не прошли валидацию. OpenAPI автоматически генерируется FastAPI.

## Запуск в Windows

1. Установите Python 3.10 или новее и включите Python в PATH.
2. Запустите `server\_start.bat` двойным щелчком. При первом запуске установятся зависимости.
3. Откройте сайт: http://127.0.0.1:8000
4. Откройте документацию API: http://127.0.0.1:8000/docs
5. Альтернативная документация: http://127.0.0.1:8000/redoc
6. OpenAPI JSON: http://127.0.0.1:8000/openapi.json

База `studstaz.db` создаётся автоматически в корне проекта. При первом запуске добавляются шесть демонстрационных вакансий. Дальнейшие изменения хранятся в SQLite между перезапусками.

## Проверка CRUD

В `/docs` раскройте группу «Вакансии» и выполните `GET`, `POST`, `GET /{vacancy\\\\\\\_id}`, `PATCH /{vacancy\\\\\\\_id}`, `DELETE /{vacancy\\\\\\\_id}`. Для POST используйте, например:

```json
{
  "title": "Python-разработчик стажёр",
  "company": "Учебная компания",
  "direction": "разработка",
  "format": "удалённо",
  "skills": "Python, SQL, Git",
  "description": "Стажировка для начинающего Python-разработчика с наставником."
}
```

Frontend также поддерживает поиск, фильтрацию и сортировку, создание вакансии через форму, редактирование и удаление через API.

## Технологии

* Python, FastAPI, Uvicorn
* SQLite, SQLAlchemy
* Pydantic, Swagger UI / OpenAPI
* HTML, CSS, JavaScript Fetch API

## 

