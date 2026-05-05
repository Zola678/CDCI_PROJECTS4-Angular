import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-products.html',
  styleUrls: ['./user-products.css']
})
export class UserProductsComponent implements OnInit {

  products: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/products')
      .subscribe({
        next: (data) => this.products = data,
        error: (err) => console.error(err)
      });
  }
}
