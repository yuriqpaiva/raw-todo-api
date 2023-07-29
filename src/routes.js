import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      const data = database.selectAll('tasks');

      return res.end(JSON.stringify(data));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: async (req, res) => {
      if (!req.body) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: 'Request body is missing.' }));
      }

      const { title, description } = req.body;

      if (!title || !description) {
        const propertyMissing = !title ? 'Title' : 'Description';
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: `${propertyMissing} is missing.` }));
      }

      database.create('tasks', {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        updated_at: new Date(),
        created_at: new Date(),
      });

      return res.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;

      const task = database.selectOne('tasks', id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }));
      }

      if (!req.body) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'Request body is missing.' }));
      }

      const { title, description } = req.body;

      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            error: 'Title or description is required for task update.',
          })
        );
      }

      const data = {};

      if (title) data.title = title;
      if (description) data.description = description;

      database.update('tasks', id, {
        ...data,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: async (req, res) => {
      const { id } = req.params;

      const task = database.selectOne('tasks', id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }));
      }

      if (task.completed_at === null) {
        database.update('tasks', id, {
          completed_at: new Date(),
        });
      } else {
        database.update('tasks', id, {
          completed_at: null,
        });
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res) => {
      const { id } = req.params;

      const task = database.selectOne('tasks', id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }));
      }

      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
];
