import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProductItemComponent } from './product-item.component';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('ProductItemComponent (Standalone)', () => {
  let fixture: ComponentFixture<ProductItemComponent>;
  let component: ProductItemComponent;

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
      imports: [ProductItemComponent], // ✅ Standalone component
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load product with given ID directly', () => {
    component.loadProductItem('mock-id');

    expect(mockProductService.getProductById).toHaveBeenCalledWith('mock-id');
    expect(component.productItem).toEqual(mockProduct);
  });
});
