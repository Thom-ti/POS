import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-item',
  imports: [],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent implements OnInit {
  productItem = '';
  productId!: string;
  private destroyRef = inject(DestroyRef);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id') ?? '';
      this.loadProductItem(this.productId);
    });
  }

  loadProductItem(id: string): void {
    const subscription = this.productService
      .getProductById(id)
      .subscribe((data) => {
        this.productItem = data;
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
