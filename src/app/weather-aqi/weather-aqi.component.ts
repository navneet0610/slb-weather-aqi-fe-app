import { Component, HostListener } from '@angular/core';
import { WeatherAqiService } from '../weather-aqi.service';
import {FormsModule} from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {BarChartModule, Color, ScaleType} from "@swimlane/ngx-charts";
import {CommonModule} from "@angular/common";
import { Ranges, Range } from '../app-interface';

@Component({
  selector: 'app-weather-aqi',
  standalone: true,
  templateUrl: './weather-aqi.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BarChartModule
  ],
  styleUrls: ['./weather-aqi.component.css']
})
export class WeatherAqiComponent {
  cityName: string = '';
  weatherData: any = null;
  error: string = '';
  weatherChartData: any[] = [];
  pollutantChartData: any[] = [];
  colorScheme: Color = {
    name: 'basic',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  view: [number, number] = [700, 400];
  customColors = [
  { name: 'Good', value: '#5AA454' },
  { name: 'Fair', value: '#A10A28' },
  { name: 'Moderate', value: '#C7B42C' },
  { name: 'Poor', value: '#AAAAAA' },
  { name: 'Very Poor', value: '#800000' }
];




  constructor(private weatherService: WeatherAqiService) {
    this.updateChartView(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (typeof window !== 'undefined')
    this.updateChartView(event.target.innerWidth);
  }

  updateChartView(width: number) {
    if (width <= 480) {
      this.view = [300, 250];
    } else if (width <= 768) {
      this.view = [450, 300];
    } else {
      this.view = [700, 400];
    }
  }

  getWeatherAndAqi() {
    this.weatherService.getWeatherAndAqi(this.cityName).subscribe(
      data => {
        this.weatherData = data;
        this.error = '';
        this.weatherChartData = [
          { name: 'Temperature (°C)', value: data.weather.main.temp },
          { name: 'Feels Like (°C)', value: data.weather.main.feels_like },
          { name: 'Min Temp (°C)', value: data.weather.main.temp_min },
          { name: 'Max Temp (°C)', value: data.weather.main.temp_max },
          { name: 'Humidity (%)', value: data.weather.main.humidity },
          { name: 'Wind Speed (m/s)', value: data.weather.wind.speed }
        ];
        this.pollutantChartData = this.getPollutantChartData(data.air_quality.list[0].components);
      },
      err => {
        this.weatherData = null;
        this.error = err.error.error || 'An error occurred';
      }
    );
  }

  getPollutantChartData(components: any): any[] {
    const pollutants = [
      { name: 'PM2.5', value: components.pm2_5 },
      { name: 'PM10', value: components.pm10 },
      { name: 'SO₂', value: components.so2 },
      { name: 'NO₂', value: components.no2 },
      { name: 'O₃', value: components.o3 },
      { name: 'CO', value: components.co },
      { name: 'NO', value: components.no },
      { name: 'NH₃', value: components.nh3 }
    ];

    return pollutants.map(pollutant => ({
      name: pollutant.name,
      value: pollutant.value,
      category: this.getPollutantCategory(pollutant.name, pollutant.value)
    }));
  }

  getPollutantCategory(pollutant: string, value: number): string {
    const ranges: Ranges= {
      'PM2.5': [
        { category: 'Good', max: 12 },
        { category: 'Fair', max: 35.4 },
        { category: 'Moderate', max: 55.4 },
        { category: 'Poor', max: 150.4 },
        { category: 'Very Poor', max: Infinity }
      ],
      'PM10': [
        { category: 'Good', max: 54 },
        { category: 'Fair', max: 154 },
        { category: 'Moderate', max: 254 },
        { category: 'Poor', max: 354 },
        { category: 'Very Poor', max: Infinity }
      ],
      'SO2': [
        { category: 'Good', max: 35 },
        { category: 'Fair', max: 75 },
        { category: 'Moderate', max: 185 },
        { category: 'Poor', max: 304 },
        { category: 'Very Poor', max: Infinity }
      ],
      'NO2': [
        { category: 'Good', max: 53 },
        { category: 'Fair', max: 100 },
        { category: 'Moderate', max: 360 },
        { category: 'Poor', max: 649 },
        { category: 'Very Poor', max: Infinity }
      ],
      'O3': [
        { category: 'Good', max: 54 },
        { category: 'Fair', max: 70 },
        { category: 'Moderate', max: 85 },
        { category: 'Poor', max: 105 },
        { category: 'Very Poor', max: Infinity }
      ],
      'CO': [
        { category: 'Good', max: 1 },
        { category: 'Fair', max: 2 },
        { category: 'Moderate', max: 10 },
        { category: 'Poor', max: 17 },
        { category: 'Very Poor', max: 34 }
      ],
      'NO': [
        { category: 'Good', max: 4.4 },
        { category: 'Fair', max: 9.4 },
        { category: 'Moderate', max: 12.4 },
        { category: 'Poor', max: 15.4 },
        { category: 'Very Poor', max: Infinity }
      ]
      ,'NH3': [
        { category: 'Good', max: 50 },
        { category: 'Fair', max: 400 },
        { category: 'Moderate', max: 800 },
        { category: 'Poor', max: 1200 },
        { category: 'Very Poor', max: 1800 }
      ]
    };

    const pollutantRanges = ranges[pollutant];
    if (pollutantRanges) {
    for (const range of pollutantRanges) {
      if (value <= range.max) {
        return range.category;
      }
    }
  }

  return 'Unknown';
  }
}
