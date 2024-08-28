import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { addInvoice } from '../../state/invoices/invoices.actions';
import { CommonModule } from '@angular/common';
import { UniqueIdService } from '../../services/unique-id.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.sass',
})
export class InvoiceFormComponent {
  invoiceForm: FormGroup;
  paymentTermsOptions = [
    { value: 1, label: 'Net 1 Day' },
    { value: 7, label: 'Net 7 Days' },
    { value: 14, label: 'Net 14 Days' },
    { value: 30, label: 'Net 30 Days' },
  ];
  // items: FormArray;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private generatedIdService: UniqueIdService
  ) {
    this.invoiceForm = this.fb.group({});
    // this.items = this.fb.array([]);
  }

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      paymentTerms: ['', Validators.required],
      senderAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      clientAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      items: this.fb.array([]),
    });

    this.addItem();
  }

  get items() {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    const itemForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
    });

    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateItemTotal(index: number) {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value;
    const price = item.get('price')?.value;
    const total = quantity * price;
    item.patchValue({ total: total });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;
      const createdAt = new Date(formValue.createdAt);
      const paymentDue = new Date(createdAt);
      paymentDue.setDate(paymentDue.getDate() + formValue.paymentTerms);
      const newInvoice = {
        ...formValue,
        id: this.generatedIdService.generateUniqueId(),
        createdAt: createdAt.toISOString().split('T')[0],
        paymentDue: paymentDue.toISOString().split('T')[0],
        status: 'pending' as 'paid' | 'pending' | 'draft',
        items: formValue.items.map((item: any) => ({
          ...item,
          total: item.quantity * item.price,
        })),
        total: formValue.items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.price,
          0
        ),
      };
      this.store.dispatch(addInvoice({ invoice: newInvoice }));
    }
  }
}
