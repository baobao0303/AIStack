import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRODUCTS, Product } from '@tiem-nha-zit/shared';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'crm-portal';
  products: Product[] = PRODUCTS;

  ngOnInit() {
    console.log(`[CRM] Successfully loaded ${this.products.length} shared products from @tiem-nha-zit/shared!`);
  }
}

