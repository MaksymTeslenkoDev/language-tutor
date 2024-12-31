import {
  type FastifyPluginAsyncTypebox,
  Type,
} from '@fastify/type-provider-typebox';

const plugin: FastifyPluginAsyncTypebox = async function (fastify, _opts) {
  fastify.get(
    '/speech',
    {
      websocket: true,
      schema: {
        tags: ['Speech Recording'],
        description: `WebSocket endpoint for speech processing. To use this WebSocket:
        - Connect to this route via a WebSocket client.
        - Send speech data as messages.
        - The server will respond with a processed message or acknowledgment.`,
        summary: 'WebSocket Speech Route',
      },
    },
    (socket, req) =>
      socket.on('message', (message) => {
        socket.send('hi');
      }),
  );
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Hello World'],
        description: 'Salute someone via a GET call.',
        summary: 'GET Hello Route',
        querystring: Type.Object({
          name: Type.String({
            default: 'world',
            description: 'Pass the name of the person you want to salute.',
          }),
        }),
        response: {
          200: Type.Object({
            hello: Type.String(),
          }),
        },
      },
    },
    (req) => {
      const { name } = req.query;
      return { hello: name };
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        tags: ['Hello World'],
        description: 'Salute someone via a POST call.',
        summary: 'POST Hello Route',
        body: Type.Object(
          {
            name: Type.Optional(Type.String()),
          },
          {
            description:
              'Use the name property to pass the name of the person you want to salute.',
          },
        ),
        response: {
          200: Type.Object({
            hello: Type.String(),
          }),
        },
      },
    },
    async (request) => {
      const { name } = request.body;
      const hello = typeof name !== 'undefined' && name !== '' ? name : 'world';

      return { hello };
    },
  );
};

export default plugin;
