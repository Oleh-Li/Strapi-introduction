// @ts-nocheck
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
    "api::todo.todo",
    ({ strapi }) => ({
        async create(ctx) {
            try {
                const { id } = ctx.state.user; // Отримати ID користувача

                // Додаємо ID користувача до даних перед збереженням
                ctx.request.body.data.user = id;

                // Створюємо новий запис з користувачем
                const entity = await strapi.service("api::todo.todo").create({
                    data: ctx.request.body.data,
                });

                // Очищаємо результат та включаємо користувача
                const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
                const user = await strapi
                    .query("plugin::users-permissions.user")
                    .findOne({ where: { id: id } });
                console.log("USER==>", user)
                sanitizedEntity.user = {
                    data: {
                        id: user.id,
                        attributes: {
                            userName: user.username, // або інше ім'я поля, яке потрібно додати
                        }
                    }
                };

                return this.transformResponse(sanitizedEntity);
            } catch (error) {
                console.error("Error creating todo:", error);
                return ctx.badRequest("There was an error creating the todo", { details: error });
            }
        },

        async find(ctx) {
            try {
                const { id } = ctx.state.user; // Отримати ID автентифікованого користувача
                // Виконуємо запит безпосередньо через query API Strapi
                const entities = await strapi.query("api::todo.todo").findMany({
                    where: { user: id }, // Фільтруємо за ID користувача
                    populate: { user: true }, // Включити користувача у відповідь
                });

                return entities;
            } catch (error) {
                console.error("Error finding todos:", error);
                return ctx.badRequest("There was an error finding the todos", { details: error });
            }
        },

    })
);













