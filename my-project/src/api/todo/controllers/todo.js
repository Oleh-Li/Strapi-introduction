// @ts-nocheck
'use strict';

/**
 * todo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::todo.todo');

// module.exports = createCoreController(
//     "api::todo.todo",
//     ({ strapi }) => ({
//         async create(ctx) {
//             const { id } = ctx.state.user;

//             // Додаємо user до даних перед збереженням
//             ctx.request.body.data.user = id;

//             const response = await super.create(ctx);

//             // Додаємо user до відповіді API
//             response.data.attributes.user = {
//                 id: id,
//                 email: ctx.state.user.email, // або інші поля, які потрібно включити
//             };



//             return response;
//         },
//     })
// );

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

                sanitizedEntity.user = user;

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













