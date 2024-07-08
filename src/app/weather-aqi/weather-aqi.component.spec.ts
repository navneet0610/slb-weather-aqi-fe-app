import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherAqiComponent } from './weather-aqi.component';

describe('WeatherAqiComponent', () => {
  let component: WeatherAqiComponent;
  let fixture: ComponentFixture<WeatherAqiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherAqiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherAqiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
