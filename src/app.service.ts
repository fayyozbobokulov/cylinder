import { Injectable, OnModuleInit } from '@nestjs/common';
import { MathService } from './math/math.service';
import { NatsService } from './nats/nats.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly mathService: MathService,
    private readonly natsService: NatsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.natsService.connect(); // Connect to NATS server
    await this.mathService.init(); // Initialize the MathService
  }
}
