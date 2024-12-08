import { Product } from "./Product";

export interface Bills {
    Bill: Bill[];
}

export interface Bill {
    TotalAmount: number;
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
    Quantity: number;
    Price: number;
    Stock: number;
    Subtotal: number;
}