import { Container } from 'inversify';
import { ExampleService } from './domain/services/example.service';
import { ExampleController } from './interface/http/controllers/example.controller';

const container = new Container();

container.bind(ExampleService).toSelf();
container.bind(ExampleController).toSelf();

export { container };