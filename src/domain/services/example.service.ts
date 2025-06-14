import { injectable } from 'inversify';

@injectable()
export class ExampleService {
  getMessage(): string {
    return 'Hello from Bulletproof Microservice!';
  }
}