import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductItemComponent } from './product-item.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

describe('ProductItemComponent (Standalone)', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;

  const mockProduct: Product = {
    _id: 'mock-id',
    name: 'Mock Product',
    price: 199,
    stock: 3,
    imageUrl: '',
    description: 'Mock description',
  };

  const mockProductService = {
    getProductById: jasmine
      .createSpy('getProductById')
      .and.returnValue(of(mockProduct)),
  };

  const mockActivatedRoute = {
    paramMap: of(convertToParamMap({ id: 'mock-id' })),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItemComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents(); // สร้าง "module จำลอง" เพื่อเทส Component

    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance; // fixture.componentInstance → เข้าถึง instance (เหมือน this ของ component)
    fixture.detectChanges(); // fixture.detectChanges() → trigger Angular lifecycle (ngOnInit, re-render)
  });

  it('should load product with given ID directly', () => {
    component.loadProductItem('mock-id');

    expect(mockProductService.getProductById).toHaveBeenCalledWith('mock-id');
    expect(component.productItem).toEqual(mockProduct);
  });
});
