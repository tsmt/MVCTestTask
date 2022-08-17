# MVCTestTask

Реализация тестовой задачи (C#, MS Sql, Asp Net MVC5, Entity Framework, bootstrap, jquery)

Напишите CRUD приложение на ASP.NET MVC 5.
Требования:
1. Минимум 2 сущности с отношением один ко многим (например, клиент-заказы. Для удобства далее будет использоваться этот пример)
2. На главной странице выводится список клиентов с пагинацией через AJAX (без перезагрузки страницы). Сама таблица и пагинация реализуется без использования сторонних компонентов, в том числе open-source'ных
3. Удаление записи из таблицы и обновление таблицы после добавления/редактирования осуществлять через AJAX
4. Добавление/редактирование записи происходит в модальном окне, в нем же содержится таблица заказов, по требованиям аналогичная п.2 и п.3., заказы редактируются в отдельном модальном окне.
5. Одно поле для числа с фиксированной запятой, ввод и отображение числа с маской разделения на классы (12 345.00). Будет плюсом, если реализуется самостоятельно, без использования HTML атрибута number, сторонних JS библиотек, валидации на сервере "на лету".
6. Все поля обязательны для ввода, валидация серверная

В качестве ORM используется EF (подход Code First), из CSS framework-ов можно использовать bootstrap (в том числе для модальных окон), из JS-фреймворков только jQuery.

----

Connection String "DBConnection" в web.config
Выполнить команду в Package Manager Console выполнить команду update-database
