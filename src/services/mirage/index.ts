/* eslint-disable @typescript-eslint/ban-ts-comment, func-names */
import { createServer, Factory, Model, Response } from 'miragejs';
import { faker } from '@faker-js/faker';

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories: {
      user: Factory.extend({
        name(index: number) {
          return `User ${index + 1}`;
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(seedsServer) {
      seedsServer.createList('user', 200);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/users', function (schema, request) {
        // @ts-ignore
        const { page = 1, perPage = 10 } = request.queryParams;

        const total = schema.all('user').length;
        const pageStart = (Number(page) - 1) * Number(perPage);
        const pageEnd = pageStart + Number(perPage);

        // @ts-ignore
        const users = this.serialize(schema.all('user')).users.slice(
          pageStart,
          pageEnd,
        );

        return new Response(
          200,
          {
            'x-total-count': String(total),
          },
          { users },
        );
      });

      this.post('/users');

      this.namespace = '';
      this.passthrough();
    },
  });

  return server;
}
