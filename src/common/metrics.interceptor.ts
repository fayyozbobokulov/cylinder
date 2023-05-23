import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private counter: Counter<string>;
  private histogram: Histogram<string>;

  constructor() {
    this.counter = new Counter({
      name: 'nats_messages_total',
      help: 'Total number of processed NATS messages',
    });

    this.histogram = new Histogram({
      name: 'nats_messages_duration_seconds',
      help: 'Histogram for the duration in seconds of NATS messages',
      buckets: [0.1, 5, 15, 50, 100, 500], // define your own buckets
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startHrTime = process.hrtime();

    return next.handle().pipe(
      tap(() => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

        this.counter.inc(); // increment counter
        this.histogram.observe(elapsedMs / 1000); // record in histogram
      }),
    );
  }
}
