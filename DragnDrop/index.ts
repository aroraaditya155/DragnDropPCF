import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Vue from 'vue';
import App from './vue-drag-drop/src/App.vue';
import { DragBox, DropDownItem,Countries,Country } from "./DragBox";
import { BoxRecord } from "./DragBox";
import { Filters } from "./DragBox";
import { CdsService } from "./CdsService";

import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class DragnDrop implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private mainContainer: HTMLDivElement;
	y: { name: string; id: number; }[];
	private _context: any;
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
	public CustomerDragboxObj: DragBox; 
	public StockDragboxObj : DragBox;
	public tempcountry:Country;
	public CountryItems:Country[]=[];
	public tempCountries:Countries;
	public ContryObj:Countries[]=[];
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
		this._container = container;
		this._context=context;	
		this.appElement = document.createElement("div");
		let tempBoxItem: BoxRecord;
		let allocationFilters : Filters[];
		let customerFilters: Filters;
		let commoditydropDown : DropDownItem[];
		let commodityFilter : Filters;
		let dropDownItem:DropDownItem;
		let tempSupplierItems: BoxRecord[] ;
		
		this.CustomerDragboxObj = new DragBox();
		this.CustomerDragboxObj.Name = "CUSTOMER";
		this.CustomerDragboxObj.boxNumber =1;
		this.StockDragboxObj = new DragBox();
		this.StockDragboxObj.Name = "STOCK ON HAND";
		this.StockDragboxObj.boxNumber =2;
		 
		container.appendChild(this.appElement);	
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
		//let columnsOnView = this.getSortedColumnsOnView(context);
		//this._container.innerHTML="";
		this.OnLoadRender(context);
		
		
	}
	OnLoadRender(context: ComponentFramework.Context<IInputs>){
		let tempCustomerItems: BoxRecord[] = [];
		let tempStockItems: BoxRecord[] = [];		
		this.dragboxObj = [];
		if(!context.parameters.CustomerOpporunityProductDataSet.loading){
			//if(context.parameters.CustomerDataSet){
				context.parameters.CustomerOpporunityProductDataSet?.sortedRecordIds.forEach((recordId)=>{
					let currentRecord=context.parameters.CustomerOpporunityProductDataSet.records[recordId];		
					let tempBoxItem = new BoxRecord();
					tempBoxItem.name = currentRecord.getFormattedValue("opportunityproductname");
					tempBoxItem.property1 = currentRecord.getFormattedValue("a_34336f4db608ec11b6e500224818491b.customerid");
					tempBoxItem.property2 = currentRecord.getFormattedValue("quantity");
					tempBoxItem.id =recordId;
					tempCustomerItems.push(tempBoxItem);						
				});
				
				if(context.parameters.CustomerOpporunityProductDataSet.sortedRecordIds.length>0){
					this.CustomerDragboxObj.items =tempCustomerItems;
					this.dragboxObj.push(this.CustomerDragboxObj);	
				}
			//}
		}	
		if(!context.parameters.StockOnHandDataSet.loading){
		//if(context.parameters.StockDataSet){
			context.parameters.StockOnHandDataSet?.sortedRecordIds.forEach((recordId)=>{
				let currentRecord=context.parameters.StockOnHandDataSet.records[recordId];		
				let tempBoxItem = new BoxRecord();
				tempBoxItem.name = currentRecord.getFormattedValue("vel_name");
				tempBoxItem.property1 ="";
				tempBoxItem.property2 = "";
				tempBoxItem.id =recordId;
				tempStockItems.push(tempBoxItem);			
			});
			
			if(context.parameters.StockOnHandDataSet.sortedRecordIds.length>0){
				this.StockDragboxObj.items =tempStockItems;
				this.dragboxObj.push(this.StockDragboxObj);	
			}
		}
		
		this.onLoadView(this.dragboxObj);
	}
	async onLoadView(dragboxObj:DragBox[]): Promise<void> {
		let cdsService= new CdsService(this._context);		
		let fetchXml ='<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">'+
							'<entity name="vel_country">'+
							'<attribute name="vel_countryid" />'+
							'<attribute name="vel_name" />'+							
							'<order attribute="vel_name" descending="false" />'+
							'<filter type="and">'+
								'<condition attribute="statecode" operator="eq" value="0" />'+
							'</filter>'+
							'</entity>'+
	   					'</fetch>';
		let fetchQuery = "?fetchXml=" + encodeURIComponent(fetchXml);
		const existingRecords=await cdsService.getCountries("vel_country", fetchQuery)
		
		// Retrieve multiple completed successfully -- 
		for (let i = 0; i < existingRecords.entities.length; i++) {
			this.tempcountry=new Country();
			this.tempcountry.id=existingRecords.entities[i].vel_countryid;
			this.tempcountry.name=existingRecords.entities[i].vel_name;
			this.CountryItems.push(this.tempcountry);	
		}
	  this.tempCountries=new Countries();
	  this.tempCountries.items=this.CountryItems;
	  this.ContryObj=[];
	  this.ContryObj.push(this.tempCountries);
	  this.vue = new Vue({
		  	 el: this.appElement, 
			render: (h) => h(App, { 
				props: { 
					DragBoxObj: dragboxObj, 
					lastBoxName: "Allocation", 
					Countries:this.ContryObj,
					context:this.onBlure
				} 
			}), 
		});
	}
	onBlure = (event:Event):void => {
		
		//alert("Hi"+(<HTMLSelectElement>event.target).value);		
		let x=(<HTMLInputElement>event.target).value;
		this._context.parameters.CustomerOpporunityProductDataSet.filtering.clearFilter();
            var fieldName = "";
			
			// Option 1 using the property-set name directly
			fieldName = "searchField";
			
			/* Option 2
            this.contextObj.parameters.simpleTableGrid.columns.forEach(function (item) {
                // SearchField is the property-set name on manifest
                if (item.alias == "searchField") {
                    fieldName = item.name;
                }
            }); 
			*/
            var condition = {
                attributeName: fieldName,
                conditionOperator: 6 /* Like */,
                value: "%" + x + "%"
            };
            var conditionsArray = [];
            conditionsArray.push(condition);
			this._context.parameters.CustomerOpporunityProductDataSet.filtering.setFilter({
                conditions: conditionsArray,
                filterOperator: 1 /* Or */
            });
            this._context.parameters.CustomerOpporunityProductDataSet.refresh();
			this.vue.$forceUpdate();
			//this.OnLoadRender(this._context);
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
