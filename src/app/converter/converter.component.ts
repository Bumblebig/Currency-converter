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
  currTypeError: boolean = false;
  loading: boolean = false;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {  }


  convert(form: NgForm): void {
    // hide all errors
    this.hideErrors();
    this.showLoader();  

    if (this.isSameCurrency()) {
      this.showTypeError();
      this.hideLoader();
      return;
    }
  
    if(form.valid && this.amount > 0){
      this.currencyService.getExchangeRates(this.fromCurrency, this.toCurrency).subscribe({
        next: (data) => {
          console.log('Conversion Rate:', data.conversion_rate);
          
          this.displayResult(data.conversion_rate);
        },
        error: () => {
          this.showError('Error fetching rates, Please try again.');
          this.hideLoader();
        },
      });
    } else {
      this.showError('Enter a valid amount greater than 0!');
      this.hideLoader();
    }
  }

  toggleCurrencies(): void {
    [this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency];
  }

  private isSameCurrency(): boolean {
    return this.fromCurrency === this.toCurrency;
  }

  private displayResult(rate: number): void {
    this.hideLoader();
    this.convertedAmount = `${this.amount} ${this.fromCurrency} is equal to ${this.amount * rate} ${this.toCurrency}`;
    this.errorMessage = null;
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.convertedAmount = null;
  }

  private showTypeError(): void {
    this.currTypeError = true;
  }

  private hideErrors(): void {
    this.currTypeError = false;
    this.errorMessage = null;
    this.hideLoader();
  }

  private showLoader(): void {
    this.loading = true;
  }

  private hideLoader(): void {
    this.loading = false;
  }
}
