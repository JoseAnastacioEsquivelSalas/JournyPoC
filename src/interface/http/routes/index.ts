import { Application } from 'express';
import { container } from '../../../container';
import { ExampleController } from '../controllers/example.controller';

export function createRoutes(app: Application) {
  const controller = container.get(ExampleController);
  app.get('/example', controller.getExample.bind(controller));
}