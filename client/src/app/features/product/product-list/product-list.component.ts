import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { SearchComponent } from '../search/search.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CartComponent } from "../../cart/cart.component";

@Component({
  selector: 'app-product-list',
  imports: [SearchComponent, ProductCardComponent, CartComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  products: Product[] = [];
  filteredProducts!: Product[];
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    const subscription = this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onProductsFound(results: Product[]) {
    this.filteredProducts = results;
  }
}
