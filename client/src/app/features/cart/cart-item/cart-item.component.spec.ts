import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CartItemComponent } from './cart-item.component';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';

describe('CartItemComponent (via DOM)', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  const mockCartItem: CartItem = {
    _id: 'item123',
    quantity: 1,
    product: {
      _id: 'p1',
      name: 'Test Product',
      price: 100,
      stock: 10,
    },
  };

  const mockCartService = {
    removeCartItem: jasmine.createSpy().and.returnValue(of({})),
  };

  const mockToastr = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ToastrService, useValue: mockToastr },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents(); // สร้าง "module จำลอง" เพื่อเทส Component

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance; // fixture.componentInstance → เข้าถึง instance (เหมือน this ของ component)
    component.cartItem = mockCartItem;
    fixture.detectChanges(); // fixture.detectChanges() → trigger Angular lifecycle (ngOnInit, re-render)
  });

  it('should delete and show toast via button click', waitForAsync(() => {
    const deleteBtn = fixture.nativeElement.querySelector('button');
    deleteBtn.click();

    fixture.whenStable().then(() => {
      expect(mockCartService.removeCartItem).toHaveBeenCalledWith('item123');
      expect(mockToastr.success).toHaveBeenCalledWith('ลบสินค้าจากตะกร้าแล้ว');
    });
  }));
});
