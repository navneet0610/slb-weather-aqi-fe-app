import { TestBed } from '@angular/core/testing';

import { WeatherAqiService } from './weather-aqi.service';

describe('WeatherAqiService', () => {
  let service: WeatherAqiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherAqiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
