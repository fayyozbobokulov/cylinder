import { Injectable, Logger } from '@nestjs/common';
import { connect, JSONCodec, NatsConnection, Subscription } from 'nats';

@Injectable()
export class NatsService {
  private connection: NatsConnection;
  private jc = JSONCodec();
  private readonly logger = new Logger(NatsService.name);

  async connect() {
    this.connection = await connect({ servers: 'nats://localhost:4222' });
  }

  async publish<T>(topic: string, payload: T): Promise<void> {
    if (!this.connection) {
      throw new Error('NatsService is not connected to a server');
    }

    try {
      const data = this.jc.encode(payload);
      this.connection.publish(topic, data);
    } catch (error) {
      this.logger.error(
        `Failed to publish message to topic "${topic}":`,
        error,
      );
      // Handle failed publish, e.g., by retrying or handling the error higher up
    }
  }

  async subscribe<T>(
    topic: string,
    callback: (data: T) => void,
  ): Promise<Subscription> {
    if (!this.connection) {
      throw new Error('NatsService is not connected to a server');
    }

    try {
      const subscription: Subscription = this.connection.subscribe(topic);
      subscription.callback = (err, msg) => {
        if (err) {
          this.logger.error(`Error subscribing to topic "${topic}":`, err);
        } else {
          const data = this.jc.decode(msg.data) as T;
          callback(data);
        }
      };
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic "${topic}":`, error);
      // Handle failed subscription, e.g., by retrying or handling the error higher up
    }
  }
}
