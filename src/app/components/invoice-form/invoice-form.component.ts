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
import { RouterLink } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.sass',
})
export class InvoiceFormComponent {
  sidebarVisible: boolean = false;
  invoiceForm: FormGroup;
  formSubmitted: boolean = false;

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
    private generatedId: UniqueIdService,
    protected modalService: ModalService
  ) {
    this.invoiceForm = this.fb.group({});

    // this.items = this.fb.array([]);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      senderAddress: this.fb.group({
        street: [
          this.invoice?.senderAddress.street || '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ], // Street should be reasonable length
        ],
        city: [
          this.invoice?.senderAddress.city || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ], // City length validation
        ],
        postCode: [
          this.invoice?.senderAddress.postCode || '',
          [
            Validators.required,
            // Validators.pattern(/^[A-Z0-9]+$/),
            Validators.minLength(3),
            Validators.maxLength(10),
          ], // Postcode length and pattern
        ],
        country: [
          this.invoice?.senderAddress.country || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ], // Country should be reasonable length
        ],
      }),
      clientName: [
        this.invoice?.clientName || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ], // Name length validation
      ],
      clientEmail: [
        this.invoice?.clientEmail || '',
        [Validators.required, Validators.email],
      ],
      clientAddress: this.fb.group({
        street: [
          this.invoice?.clientAddress.street || '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ], // Street should be reasonable length
        ],
        city: [
          this.invoice?.clientAddress.city || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ], // City length validation
        ],
        postCode: [
          this.invoice?.clientAddress.postCode || '',
          [
            Validators.required,
            Validators.pattern(/^[A-Z0-9]+$/),
            Validators.minLength(3),
            Validators.maxLength(10),
          ], // Postcode length and pattern
        ],
        country: [
          this.invoice?.clientAddress.country || '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ], // Country should be reasonable length
        ],
      }),
      createdAt: [
        this.invoice?.createdAt || '',
        [Validators.required], // Custom date format validation can be added
      ],
      paymentTerms: [
        this.invoice?.paymentTerms || '',
        [Validators.required, Validators.min(1)], // Positive payment terms
      ],
      description: [
        this.invoice?.description || '',
        [Validators.required, Validators.maxLength(255)], // Description length limit
      ],
      items: this.fb.array(
        this.invoice?.items.map((item) => this.createItemFormGroup(item)) || [],
        Validators.minLength(1) // At least one item
      ),
    });

    if (!this.invoice) {
      // don't add a new item by default when editing
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

  saveAsDraft() {
    const formValue = this.invoiceForm.value;
    const clientName = this.invoiceForm.get('clientName');

    if (clientName?.invalid) {
      clientName.markAsTouched();
      return;
    }
    const draftInvoice = {
      ...formValue,
      id: this.invoice ? this.invoice.id : this.generatedId.generateUniqueId(),
      createdAt: new Date().toISOString().split('T')[0],
      paymentDue: '', // Can be left empty for drafts
      status: 'draft' as 'paid' | 'pending' | 'draft',
      items: formValue.items.map((item: any) => ({
        ...item,
        total: (item.quantity || 0) * (item.price || 0),
      })),
      total: formValue.items.reduce(
        (sum: number, item: any) =>
          sum + (item.quantity || 0) * (item.price || 0),
        0
      ),
    };

    this.store.dispatch(addInvoice({ invoice: draftInvoice }));
    this.modalService.closeModal();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getNestedControl(controlName: string): any {
    const parts = controlName.split('.');
    let control: any = this.invoiceForm;

    for (const part of parts) {
      control = control.get(part);
      if (!control) break;
    }

    return control;
  }

  shouldShowError(controlName: string): boolean {
    const control = this.getNestedControl(controlName);
    return (
      (control?.invalid && (control?.touched || this.formSubmitted)) ?? false
    );
  }

  getErrorMessages(controlName: string): string[] {
    const control = this.getNestedControl(controlName);
    if (!control || !control.errors) return [];

    const errors: string[] = [];
    const errorKeys = Object.keys(control.errors);

    if (errorKeys.includes('required')) {
      errors.push("can't be empty");
    }

    if (errorKeys.includes('minlength')) {
      const requiredLength = control.errors['minlength'].requiredLength;
      errors.push(`Minimum length is ${requiredLength} characters`);
    }

    if (errorKeys.includes('maxlength')) {
      const requiredLength = control.errors['maxlength'].requiredLength;
      errors.push(`Maximum length is ${requiredLength} characters`);
    }

    if (errorKeys.includes('email')) {
      errors.push('Please enter a valid email address');
    }

    if (errorKeys.includes('pattern')) {
      if (controlName.includes('postCode')) {
        errors.push(
          'Post code must contain only uppercase letters and numbers'
        );
      } else {
        errors.push('Invalid format');
      }
    }

    if (errorKeys.includes('min')) {
      const min = control.errors['min'].min;
      errors.push(`Minimum value is ${min}`);
    }

    // Additional error types
    if (controlName === 'items' && errorKeys.includes('minlength')) {
      errors.push('At least one item is required');
    }

    return errors;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.invoiceForm.get(fieldName);
    return (
      control !== null && control.invalid && (control.dirty || control.touched)
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.invoiceForm.invalid) {
      this.markFormGroupTouched(this.invoiceForm);
      return;
    }
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;
      const createdAt = new Date(formValue.createdAt);
      const paymentDue = new Date(createdAt);
      paymentDue.setDate(paymentDue.getDate() + Number(formValue.paymentTerms));

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
        this.modalService.closeModal();
      } else {
        this.store.dispatch(addInvoice({ invoice: newInvoice }));
        this.modalService.closeModal();
      }
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  discardChanges() {
    this.invoiceForm.reset();
    this.invoiceForm.markAsPristine();
    // this.invoiceForm.markAsUntouched();
    // this.modalService.closeModal();
  }
}
