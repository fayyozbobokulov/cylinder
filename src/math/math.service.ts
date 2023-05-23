import { Injectable, Logger } from '@nestjs/common';
import { CylinderProps } from 'src/cylinder/cylinder.service';
import { NatsService } from 'src/nats/nats.service';

@Injectable()
export class MathService {
  constructor(private readonly natsService: NatsService) {}
  private readonly logger = new Logger(MathService.name);

  async calculateCylinderArea(props: CylinderProps): Promise<number> {
    const area = 2 * Math.PI * props.radius * (props.height + props.radius);
    return area;
  }

  async init(): Promise<void> {
    // Listen for the cylinder properties
    await this.natsService.subscribe<CylinderProps>(
      'cylinder.dimensions',
      async (props) => {
        // Calculate the area
        const area = await this.calculateCylinderArea(props);

        // Publish the calculated area
        this.natsService.publish('cylinder.area', area);
      },
    );
  }
}
