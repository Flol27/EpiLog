import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EpiLog API',
            version: '1.0.0',
        },
    },
});
