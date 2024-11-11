import { Bills } from "./Bill";

export interface Customer {
    Name: string;
    LastName: string;
    Email: string;
    Phone: string;
    Address: string;
    Bills: Bills;
    customerId: string | null;
}

