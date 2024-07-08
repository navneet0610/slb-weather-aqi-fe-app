import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherAqiService {
  private apiUrl = 'http://localhost:8000/api/weather/';
  constructor(private http: HttpClient) { }

  getWeatherAndAqi(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${city}`);
  }
}
