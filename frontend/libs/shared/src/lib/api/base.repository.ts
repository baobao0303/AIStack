// Base Repository Class (SPEC_CORE_FE)
import { apiService, ApiService } from './api.service';

export abstract class BaseRepository {
  protected api: ApiService;

  constructor(api = apiService) {
    this.api = api;
  }
}
