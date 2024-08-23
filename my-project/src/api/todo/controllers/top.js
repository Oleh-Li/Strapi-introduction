// @ts-nocheck
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::todo.todo');


module.exports = createCoreController(
    "api::todo.todo",
    ({ strapi }) => ({

        async three(ctx) {
            try {
                const { id } = ctx.state.user; // Отримати ID автентифікованого користувача
                // Виконуємо запит безпосередньо через query API Strapi
                const entities = await strapi.entityService.findMany('api::todo.todo', {
                    filters: { user: id },
                    populate: { user: true },
                    sort: [{ createdAt: 'desc' }],
                    limit: 3,
                });

                return entities
            } catch (error) {
                console.error("Error finding todos:", error);
                return ctx.badRequest("There was an error finding the todos", { details: error });
            }
        },

    })
);














