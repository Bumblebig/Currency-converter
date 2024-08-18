import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CurrencyService } from '../currency.service';
import { NgxSemanticModule } from 'ngx-semantic';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSemanticModule],
  templateUrl: './converter.component.html'
})
export class ConverterComponent implements OnInit {
  currencies = [
    { text: 'US Dollars', value: 'USD' },
    { text: 'Euros', value: 'EUR' },
    { text: 'British Pounds', value: 'GBP' },
    { text: 'Japanese Yen', value: 'JPY' },
    { text: 'Naira', value: 'NGN' },
  ];
  fromCurrency: string = this.currencies[0].value;
  toCurrency: string = this.currencies[4].value;
  amount = 0;
  convertedAmount: string | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {  }


  convert(form: NgForm): void {
    this.hideError();
    
    if (this.isSameCurrency()) {
      this.showError('Cannot convert the same currency!');
      return;
    }
  
    this.currencyService.getExchangeRates(this.fromCurrency, this.toCurrency).subscribe({
      next: (data) => {
        console.log('Conversion Rate:', data.conversion_rate);
  
        this.displayResult(data.conversion_rate);
      },
      error: () => {
        this.showError('Error fetching rates, Please try again.');
      },
    });
  }
  toggleCurrencies(): void {
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
    this.convert(new NgForm([], []));
  }

  private isSameCurrency(): boolean {
    return this.fromCurrency === this.toCurrency;
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.convertedAmount = null;
    this.stopLoading();
  }

  private hideError(): void {
    this.errorMessage = null;
  }

  private displayResult(rate: number): void {
    this.convertedAmount = `${this.amount} ${this.fromCurrency} is equal to ${this.amount * rate} ${this.toCurrency}`;
    this.errorMessage = null;
    this.stopLoading();
  }

  private startLoading(): void {
    this.loading = true;
  }

  private stopLoading(): void {
    this.loading = false;
  }
}
