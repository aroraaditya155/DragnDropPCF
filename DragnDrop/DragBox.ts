export class DragBox{
boxNumber: number;
items : BoxRecord[];
Name: string;
Filters:Filters[];

}

export class BoxRecord{
    name: string;
    property1: string;
    property2:string;
    id:string;
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
