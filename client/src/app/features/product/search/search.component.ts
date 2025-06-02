import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchTerm: string = '';
  @Output() productsFound = new EventEmitter<Product[]>();
  private destroyRef = inject(DestroyRef);

  constructor(private productService: ProductService) {}

  onSubmit(): void {
    const keyword = this.searchTerm.trim();
    const subscription = this.productService
      .getProductsBySearching(keyword)
      .subscribe((data) => {
        this.productsFound.emit(data);
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onClear(form: NgForm): void {
    this.searchTerm = '';
    form.resetForm();

    this.productsFound.emit();
  }
}
