import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Vue from 'vue';
import App from './vue-drag-drop/src/App.vue';
import { DragBox, DropDownItem } from "./DragBox";
import { BoxRecord } from "./DragBox";
import { Filters } from "./DragBox";


import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class DragnDrop implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private mainContainer: HTMLDivElement;
	/**
	 * Empty constructor.
	 */
	constructor() {

	}
	private _container: any;
	private vue: any;
	private appElement: HTMLDivElement;
	private consumerItems: BoxRecord[];
	public supplierItems: BoxRecord[];
	public boxitem: BoxRecord;
	public dragboxObj: DragBox[];

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
		// // Add control initialization code
		// this._container = container;
		this.appElement = document.createElement("div");
		let tempBoxItem: BoxRecord;
		let allocationFilters : Filters[];
		let customerFilters: Filters;
		let commoditydropDown : DropDownItem[];
		let commodityFilter : Filters;
		let dropDownItem:DropDownItem;
		let tempSupplierItems: BoxRecord[] ;

		tempSupplierItems = [];
		commoditydropDown=[];
		allocationFilters=[];
		let req = new XMLHttpRequest();debugger;
		req.open("GET", "/api/data/v9.1/opportunityproducts?$select=opportunityproductid,productname,quantity&$expand=opportunityid($select=parentaccountid)", false);
		req.setRequestHeader("OData-MaxVersion", "4.0");
		req.setRequestHeader("OData-Version", "4.0");
		req.setRequestHeader("Accept", "application/json");
		req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
		req.onreadystatechange = function () {
			if (this.readyState === 4) {
				req.onreadystatechange = null;
				if (this.status === 200) {
					var results = JSON.parse(this.response);
					for (var i = 0; i < results.value.length; i++) {
						tempBoxItem = new BoxRecord();
						tempBoxItem.name = results.value[i]["opportunityid"]["_parentaccountid_value@OData.Community.Display.V1.FormattedValue"];
						tempBoxItem.property1 =  results.value[i]["quantity"];
						tempBoxItem.property2 =  results.value[i]["productname"];
						tempBoxItem.id = results.value[i]["opportunityproductid"];
						tempSupplierItems.push(tempBoxItem);

					}
				} else {
					//Xrm.Utility.alertDialog(this.statusText);
				}
			}
		};
		req.send();
		// this.appElement.innerHTML = "dsfsdfsdf";container.appendChild(this.appElement);
		// this.mainContainer.appendChild(this.appElement); 
		// this.mainContainer = document.createElement("div"); 
		let tempDragboxObj : DragBox;
		tempDragboxObj = new DragBox();
		tempDragboxObj.Name = "Customer";
		tempDragboxObj.boxNumber = 1;
		tempDragboxObj.items = tempSupplierItems;
		this.dragboxObj = [];
		this.dragboxObj.push(tempDragboxObj);

		tempSupplierItems = [];
	
		// Allocations
		req = new XMLHttpRequest();
		req.open("GET", "/api/data/v9.1/vel_stockonhands?$select=vel_availablephysical,_vel_grade_value,vel_name,_vel_productcategory_value,vel_stockonhandid,vel_totalavailable&$filter=statuscode eq 1", false);
		req.setRequestHeader("OData-MaxVersion", "4.0");
		req.setRequestHeader("OData-Version", "4.0");
		req.setRequestHeader("Accept", "application/json");
		req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
		req.onreadystatechange = function () {
			if (this.readyState === 4) {
				req.onreadystatechange = null;
				if (this.status === 200) {
					var results = JSON.parse(this.response);
					for (var i = 0; i < results.value.length; i++) {
						tempBoxItem = new BoxRecord();
						tempBoxItem.name = results.value[i]["vel_name"];
						tempBoxItem.property1 =  results.value[i]["vel_availablephysical"];
						tempBoxItem.property2 =  results.value[i]["_vel_productcategory_value@OData.Community.Display.V1.FormattedValue"];
						tempBoxItem.id = results.value[i]["vel_stockonhandid"];
						tempSupplierItems.push(tempBoxItem);

					}
				} else {
					//Xrm.Utility.alertDialog(this.statusText);
				}
			}
		};
		req.send();

		// Product Category - Commodity

		req = new XMLHttpRequest();
		req.open("GET","/api/data/v9.1/vel_productcategories?$select=vel_name,vel_productcategoryid&$filter=statuscode eq 1", true);
req.setRequestHeader("OData-MaxVersion", "4.0");
req.setRequestHeader("OData-Version", "4.0");
req.setRequestHeader("Accept", "application/json");
req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
req.onreadystatechange = function() {
    if (this.readyState === 4) {
        req.onreadystatechange = null;
        if (this.status === 200) {

            var results = JSON.parse(this.response);
            for (var i = 0; i < results.value.length; i++) {
				dropDownItem= new DropDownItem();
                dropDownItem.name = results.value[i]["vel_name"];
                dropDownItem.value = results.value[i]["vel_productcategoryid"];
				commoditydropDown.push(dropDownItem);
            }
        } 
    }
};
req.send();

// Create Commodity Filter
commodityFilter = new Filters();
commodityFilter.items = commoditydropDown;
commodityFilter.label = "Commodity";
commodityFilter.type = "select";
// Add to Allocation filter
allocationFilters.push(commodityFilter)

		// this.appElement.innerHTML = "dsfsdfsdf";container.appendChild(this.appElement);
		// this.mainContainer.appendChild(this.appElement); 
		// this.mainContainer = document.createElement("div"); 
		tempDragboxObj = new DragBox();
		tempDragboxObj.Name = "Stock";
		tempDragboxObj.boxNumber = 2;
		tempDragboxObj.items = tempSupplierItems;
		tempDragboxObj.Filters=allocationFilters;
		this.dragboxObj.push(tempDragboxObj);



    this.dragboxObj =[ 
      {
        boxNumber: 1,
		Filters:[{
			label: "commodity",
			items:[{name:"Oaten",value:"12121"}],
			type:"select"
		}],
        items: [
          {
            name: "Buyer 1",
            property1: " Qty - 151",
			property2: " Qty - 151",
			id:"1"
			
          },
          {
            name: "Buyer 2",
            property1: " Qty - 152",
			property2: " Qty - 151",
			id:"1"
          },
          {
            name: "Buyer 3",
            property1: " Qty - 150",
			property2: " Qty - 150",
			id:"1"
          },
          {
            name: "Buyer 4",
            property1: " Qty - 150",
			property2: " Qty - 150",
			id:"1"
          }
        ],
        Name: "Buyer",
      }];
    


		container.appendChild(this.appElement);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
		//let columnsOnView = this.getSortedColumnsOnView(context);
		this.vue = new Vue({ el: this.appElement, render: (h) => h(App, { props: { DragBoxObj: this.dragboxObj, lastBoxName: "Allocation" }, }), });

		// this.labelElement = document.createElement("div");
		// 	this.labelElement.innerHTML = "Aditya";

		// this.mydivContainer = document.createElement("div");
		// this.labelElement.innerHTML = "Aditya";
		// this.mydivContainer.appendChild(this.labelElement);
		// this.theContainer.appendChild(this.mydivContainer);

	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

	public addSupplier(): void {
		
	}

}
