import { Component, Input } from '@angular/core';
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
import {
  addInvoice,
  updateInvoice,
} from '../../state/invoices/invoices.actions';
import { UniqueIdService } from '../../services/unique-id.service';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../interfaces/invoice';
import { Observable } from 'rxjs';
import { selectInvoiceById } from '../../state/invoices/invoices.selectors';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.sass',
})
export class InvoiceFormComponent {
  invoiceForm: FormGroup;
  // items: FormArray;
  // @Input() formType: 'addInvoice' | 'editInvoice' = 'addInvoice';
  // isEditInvoice = this.formType === 'editInvoice';

  @Input() invoice: Invoice | null = null;

  paymentTermsOptions = [
    { value: 1, label: 'Net 1 Day' },
    { value: 7, label: 'Net 7 Days' },
    { value: 14, label: 'Net 14 Days' },
    { value: 30, label: 'Net 30 Days' },
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private generatedId: UniqueIdService
  ) {
    this.invoiceForm = this.fb.group({});

    // this.items = this.fb.array([]);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      createdAt: [this.invoice?.createdAt || '', Validators.required],
      clientName: [this.invoice?.clientName || '', Validators.required],
      clientEmail: [
        this.invoice?.clientEmail || '',
        [Validators.required, Validators.email],
      ],
      description: [this.invoice?.description || '', Validators.required],
      paymentTerms: [this.invoice?.paymentTerms || '', Validators.required],
      senderAddress: this.fb.group({
        street: [this.invoice?.senderAddress.street || '', Validators.required],
        city: [this.invoice?.senderAddress.city || '', Validators.required],
        postCode: [
          this.invoice?.senderAddress.postCode || '',
          Validators.required,
        ],
        country: [
          this.invoice?.senderAddress.country || '',
          Validators.required,
        ],
      }),
      clientAddress: this.fb.group({
        street: [this.invoice?.clientAddress.street || '', Validators.required],
        city: [this.invoice?.clientAddress.city || '', Validators.required],
        postCode: [
          this.invoice?.clientAddress.postCode || '',
          Validators.required,
        ],
        country: [
          this.invoice?.clientAddress.country || '',
          Validators.required,
        ],
      }),
      items: this.fb.array(
        this.invoice?.items.map((item) => this.createItemFormGroup(item)) || []
      ),
    });

    if (!this.invoice) {
      // don't add a new item by default when edititing
      this.addItem();
    }
  }

  createItemFormGroup(item: any = {}) {
    return this.fb.group({
      name: [item.name || '', Validators.required],
      quantity: [item.quantity || 1, [Validators.required, Validators.min(1)]],
      price: [item.price || 0, [Validators.required, Validators.min(0)]],
      total: [{ value: item.total || 0, disabled: true }],
    });
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
        id: this.invoice
          ? this.invoice.id
          : this.generatedId.generateUniqueId(),
        createdAt: this.invoice
          ? this.invoice.createdAt
          : createdAt.toISOString().split('T')[0],
        paymentDue: paymentDue.toISOString().split('T')[0],
        status: this.invoice
          ? this.invoice.status
          : ('pending' as 'paid' | 'pending' | 'draft'),
        items: formValue.items.map((item: any) => ({
          ...item,
          total: item.quantity * item.price,
        })),
        total: formValue.items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.price,
          0
        ),
      };

      // if the input is not null, we are editing an existing invoice
      if (this.invoice) {
        // we are editing
        this.store.dispatch(
          updateInvoice({ invoice: { id: this.invoice.id, ...newInvoice } })
        );
      } else {
        this.store.dispatch(addInvoice({ invoice: newInvoice }));
      }
    }
  }
}
