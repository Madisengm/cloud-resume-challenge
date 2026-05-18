import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly visitorCountUrl = '/api/visitor-count';

  getVisitorCount(): Observable<number> {
    return this.http
      .get<{ count: number }>(this.visitorCountUrl)
      .pipe(map((res) => res.count));
  }
}