'use strict';

/**
 * genrer service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::genrer.genrer');
