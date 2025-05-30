import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  private destroyRef = inject(DestroyRef);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const subscription = this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
