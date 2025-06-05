import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CartItemComponent } from './cart-item.component';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CartItem } from '../../../core/models/cart-item.model';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('CartItemComponent (via DOM)', () => {
  let fixture: ComponentFixture<CartItemComponent>;
  let component: CartItemComponent;

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
    }).compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    component.cartItem = mockCartItem;
    fixture.detectChanges();
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
