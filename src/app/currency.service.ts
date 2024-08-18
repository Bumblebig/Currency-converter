import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor() { }
  
  getExchangeRates(fromCurrency: string, toCurrency: string): Observable<any> {
    return fromFetch(
      `https://v6.exchangerate-api.com/v6/b9ed0f508977a9b1541d2d77/pair/${fromCurrency}/${toCurrency}`
    ).pipe(
      switchMap((response) => {
        if (response.ok) return response.json();
        else {
          console.error()
          return of([]);
        }
      }),
      catchError((err) => {
        console.error('Fetch error:', err);
        return of([]);
      })
    );
  }
}
