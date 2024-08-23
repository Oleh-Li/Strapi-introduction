// @ts-nocheck
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::todo.todo');


module.exports = createCoreController(
    "api::todo.todo",
    ({ strapi }) => ({

        async three(ctx) {
            console.log("HERE!!!")
            try {
                const { id } = ctx.state.user; // Отримати ID автентифікованого користувача
                // Виконуємо запит безпосередньо через query API Strapi
                const entities = await strapi.query("api::todo.todo").findMany({
                    where: { user: id }, // Фільтруємо за ID користувача
                    populate: { user: true }, // Включити користувача у відповідь
                });

                const topThree = entities
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .slice(0, 3);

                return topThree;
            } catch (error) {
                console.error("Error finding todos:", error);
                return ctx.badRequest("There was an error finding the todos", { details: error });
            }
        },

    })
);














