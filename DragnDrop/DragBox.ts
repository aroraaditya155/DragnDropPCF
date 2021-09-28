
export class DragBox{
    boxNumber: number;
    items : BoxRecord[];
    Name: string;
    Filters:Filters[];

}
export class BoxRecord{
    id:string;
    name: string;
    productName:string;
    customerName:string;
    salesAgreement:string;
    grade:string;
    allocatedMts:string;
    type:string;
    batch:string;
    quality:string;
    quantity:string;
    warehouseLocation:string;
    warehouse:string;
    commodity:string;
    season:string;
    country:string;
   // id:string;
}
export class Filters{
    label: string;
    items:DropDownItem[];
    type:string;
}
export class DropDownItem{
    name:string;
    value:string;
}
export class Countries{
    id:number;
    items : Country[];
}
export class Country{
    id:string;
    name:string;
}
export class Grades{
    id:number;
    items : Grade[];
}
export class Grade{
    id:string;
    name:string;
}
export class Seasons{
    id:number;
    items : Season[];
}
export class Season{
    id:string;
    name:string;
    current:string;
}
export class Commodities{
    id:number;
    items : Commodity[];
}
export class Commodity{
    id:string;
    name:string;
}
export class Customers{
    id:number;
    items : Customer[];
}
export class Customer{
    id:string;
    name:string;
}
