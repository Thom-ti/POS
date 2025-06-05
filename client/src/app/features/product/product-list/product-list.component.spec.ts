import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

// 🔹 Mock child components
@Component({ selector: 'app-search', standalone: true, template: '' })
class MockSearchComponent {}

@Component({ selector: 'app-product-card', standalone: true, template: '' })
class MockProductCardComponent {}

@Component({ selector: 'app-cart', standalone: true, template: '' })
class MockCartComponent {}

describe('ProductListComponent', () => {
  let fixture: ComponentFixture<ProductListComponent>;
  let component: ProductListComponent;

  const mockProducts: Product[] = [
    { _id: '1', name: 'Item A', price: 100, stock: 10 },
    { _id: '2', name: 'Item B', price: 200, stock: 20 },
  ];

  const mockProductService = {
    getProducts: jasmine.createSpy().and.returnValue(of(mockProducts)),
  };

  const mockToastr = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        MockSearchComponent,
        MockProductCardComponent,
        MockCartComponent,
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ToastrService, useValue: mockToastr },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load products on init', fakeAsync(() => {
    tick(); // wait for observable
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  }));

  it('should update filteredProducts when onProductsFound is called', () => {
    const results: Product[] = [
      { _id: '3', name: 'Filtered', price: 50, stock: 5 },
    ];

    component.onProductsFound(results);

    expect(component.filteredProducts).toEqual(results);
  });
});
