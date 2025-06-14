import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { ExampleService } from '../../../domain/services/example.service';

@injectable()
export class ExampleController {
  constructor(private service: ExampleService) {}

  async getExample(req: Request, res: Response) {
    const data = this.service.getMessage();
    res.json({ message: data });
  }
}