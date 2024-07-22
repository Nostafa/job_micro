import { BaseHealthIndicator } from '@app/shared/health';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserHealthIndicator extends BaseHealthIndicator {}
