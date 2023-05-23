import { Injectable } from '@nestjs/common';
import { CylinderPropsDto } from './cylinder.dto';
import { NatsService } from 'src/nats/nats.service';
export type CylinderProps = {
  height: number;
  radius: number;
};
@Injectable()
export class CylinderService {
  constructor(private readonly natsService: NatsService) {}

  async getArea({ height, radius }: CylinderPropsDto): Promise<number> {
    const dimensions = { height, radius };

    // Publish the cylinder dimensions
    await this.natsService.publish('cylinder.dimensions', dimensions);

    // Return a promise that will resolve with the area when it's received
    return new Promise(async (resolve, reject) => {
      const subscription = await this.natsService.subscribe<number>(
        'cylinder.area',
        (area) => {
          subscription.unsubscribe(); // Unsubscribe after receiving the area
          resolve(area); // Resolve the promise with the area
        },
      );

      // Reject the promise if no response is received within 5 seconds
      setTimeout(() => {
        subscription.unsubscribe();
        reject(new Error('Timeout while waiting for area calculation'));
      }, 5000);
    });
  }
}
