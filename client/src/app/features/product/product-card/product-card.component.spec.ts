import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ProductCardComponent } from './product-card.component';
import { Product } from '../../../core/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../core/services/cart.service';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>; // fixture = ตัวควบคุม component ที่ถูกสร้างขึ้นจาก test module

  const mockProduct: Product = {
    _id: 'abc123',
    name: 'Mock Product',
    price: 500,
    stock: 3,
    imageUrl: 'http://example.com/image.jpg',
    description: 'Mock description',
  };

  const mockCartService = {
    postCartItem: jasmine.createSpy('postCartItem'),
  };

  const mockToastr = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ToastrService, useValue: mockToastr },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents(); // สร้าง "module จำลอง" เพื่อเทส Component

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance; // fixture.componentInstance → เข้าถึง instance (เหมือน this ของ component)
    component.product = mockProduct;
    fixture.detectChanges(); // fixture.detectChanges() → trigger Angular lifecycle (ngOnInit, re-render)
  });

  it('should increase quantity if below stock', () => {
    component.quantity = 1;
    component.increaseQuantity();
    expect(component.quantity).toBe(2);
  });

  it('should not increase quantity beyond stock', () => {
    component.quantity = mockProduct.stock;
    component.increaseQuantity();
    expect(component.quantity).toBe(mockProduct.stock);
  });

  it('should decrease quantity if above 1', () => {
    component.quantity = 2;
    component.decreaseQuantity();
    expect(component.quantity).toBe(1);
  });

  it('should not decrease quantity below 1', () => {
    component.quantity = 1;
    component.decreaseQuantity();
    expect(component.quantity).toBe(1);
  });

  it('should call cartService and show success on addToCart()', () => {
    mockCartService.postCartItem.and.returnValue(of({}));

    component.addToCart();

    expect(mockCartService.postCartItem).toHaveBeenCalledWith({
      product: 'abc123',
      quantity: 1,
    });

    expect(mockToastr.success).toHaveBeenCalledWith('เพิ่มสินค้าในตะกร้าแล้ว');
  });

  it('should show error toastr on failed addToCart()', () => {
    mockCartService.postCartItem.and.returnValue(
      throwError(() => ({ error: { message: 'ไม่สามารถเพิ่มสินค้าได้' } }))
    );

    component.addToCart();

    expect(mockToastr.error).toHaveBeenCalledWith('ไม่สามารถเพิ่มสินค้าได้');
  });

  it('should fallback to default error message if error.message is missing', () => {
    mockCartService.postCartItem.and.returnValue(throwError(() => ({})));

    component.addToCart();

    expect(mockToastr.error).toHaveBeenCalledWith('เพิ่มสินค้าไม่สำเร็จ');
  });
});
