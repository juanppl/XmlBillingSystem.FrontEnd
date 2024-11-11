import { Product } from "./Product";

export interface Bills {
    Bill: Bill[];
}

export interface Bill {
    TotalAmount: string;
    BillItems: BillItems;
    billId: string;
    date: Date;
    referenceNumber: string;
}

export interface BillItems {
    BillItem: BillItem[];
}

export interface BillItem {
    Product: Product;
    Quantity: string;
    Price: string;
    Stock: string;
    Subtotal: string;
}