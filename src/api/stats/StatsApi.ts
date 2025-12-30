import { httpRequest } from '../client';
import { StatsOverviewDto } from './stats.types';

export class StatsApi {
  /**
   * GET /stats/overview
   */
  static getOverview() {
    return httpRequest<StatsOverviewDto>({
      method: 'GET',
      url: '/stats/overview',
    });
  }
}
