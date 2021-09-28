import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Vue from 'vue';
import App from './vue-drag-drop/src/App.vue';
import { DragBox, DropDownItem,Countries,Country, Season, Seasons, Grade, Grades, Commodity, Commodities, Customer, Customers } from "./DragBox";
import { BoxRecord } from "./DragBox";
import { Filters } from "./DragBox";
import { CdsService } from "./CdsService";

import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class DragnDrop implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private mainContainer: HTMLDivElement;
	y: { name: string; id: number; }[];
	private _context: any;
	productName: string;
	countryName: string;
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
	public tempSeason:Season;
	public SeasonItems:Season[]=[];
	public tempSeasons:Seasons;
	public SeasonObj:Seasons[]=[];
	//....................
	public tempGrade:Grade;
	public GradeItems:Grade[]=[];
	public tempGrades:Grades;
	public GradeObj:Grades[]=[];
	//....................
	public tempCommodity:Commodity;
	public CommodityItems:Commodity[]=[];
	public tempCommodities:Commodities;
	public CommodityObj:Commodities[]=[];
	//....................
	public tempCustomer:Customer;
	public CustomerItems:Customer[]=[];
	public tempCustomers:Customers;
	public CustomerObj:Customers[]=[];
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
					tempBoxItem.productName = currentRecord.getFormattedValue("opportunityproductname");
					tempBoxItem.allocatedMts =currentRecord.getFormattedValue("vel_allocatedmts");
					tempBoxItem.customerName = currentRecord.getFormattedValue("a_34336f4db608ec11b6e500224818491b.customerid");
					tempBoxItem.grade = currentRecord.getFormattedValue("vel_grade");
					tempBoxItem.salesAgreement="";
					tempBoxItem.commodity=currentRecord.getFormattedValue("vel_productcategory");
					tempBoxItem.season=currentRecord.getFormattedValue("a_34336f4db608ec11b6e500224818491b.vel_season");
					tempBoxItem.type="customer";
					tempBoxItem.country=currentRecord.getFormattedValue("vel_country");
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
				tempBoxItem.productName = currentRecord.getFormattedValue("vel_name");
				tempBoxItem.warehouseLocation =currentRecord.getFormattedValue("vel_warehouselocation");
				tempBoxItem.warehouse =currentRecord.getFormattedValue("vel_warehouse");
				tempBoxItem.quantity = currentRecord.getFormattedValue("vel_totalavailable");
				tempBoxItem.quality= currentRecord.getFormattedValue("vel_grade");
				tempBoxItem.batch= currentRecord.getFormattedValue("vel_batchattribute");
				tempBoxItem.type="stock";
				tempBoxItem.id =recordId;
				tempStockItems.push(tempBoxItem);			
			});
			
			if(context.parameters.StockOnHandDataSet.sortedRecordIds.length>0){
				this.StockDragboxObj.items =tempStockItems;
				this.dragboxObj.push(this.StockDragboxObj);	
			}
		}
		if(!context.parameters.CountryDataSet.loading){
			//if(context.parameters.StockDataSet){
			this.CountryItems=[];
			context.parameters.CountryDataSet?.sortedRecordIds.forEach((recordId)=>{
				let currentRecord=context.parameters.CountryDataSet.records[recordId];	
				this.tempcountry=new Country();
				this.tempcountry.id=currentRecord.getFormattedValue("vel_name");
				this.tempcountry.name=currentRecord.getFormattedValue("vel_name");
				this.CountryItems.push(this.tempcountry);			
			});
				
			if(context.parameters.CountryDataSet.sortedRecordIds.length>0){
				this.tempCountries=new Countries();
				this.tempCountries.items=this.CountryItems;
				this.ContryObj=[];
				this.ContryObj.push(this.tempCountries);
			}
		}
		if(!context.parameters.SeasonDataSet.loading){
			//if(context.parameters.StockDataSet){
			this.SeasonItems=[];
			context.parameters.SeasonDataSet?.sortedRecordIds.forEach((recordId)=>{
				let currentRecord=context.parameters.SeasonDataSet.records[recordId];	
				this.tempSeason=new Season();
				this.tempSeason.id=currentRecord.getFormattedValue("vel_name");
				this.tempSeason.name=currentRecord.getFormattedValue("vel_name");
				//..........if required
				this.tempSeason.current=currentRecord.getFormattedValue("vel_current");
				this.SeasonItems.push(this.tempSeason);			
			});
				
			if(context.parameters.SeasonDataSet.sortedRecordIds.length>0){
				this.tempSeasons=new Seasons();
				this.tempSeasons.items=this.SeasonItems;
				this.SeasonObj=[];
				this.SeasonObj.push(this.tempSeasons);
			}
		}
		//...........Commodity....
		if(!context.parameters.CommodityDataSet.loading){
			//if(context.parameters.StockDataSet){
			this.CommodityItems=[];
			context.parameters.CommodityDataSet?.sortedRecordIds.forEach((recordId)=>{
				let currentRecord=context.parameters.CommodityDataSet.records[recordId];	
				this.tempCommodity=new Commodity();
				this.tempCommodity.id=recordId;
				this.tempCommodity.name=currentRecord.getFormattedValue("vel_name");			
				this.CommodityItems.push(this.tempCommodity);			
			});
				
			if(context.parameters.CommodityDataSet.sortedRecordIds.length>0){
				this.tempCommodities=new Commodities();
				this.tempCommodities.items=this.CommodityItems;
				this.CommodityObj=[];
				this.CommodityObj.push(this.tempCommodities);
			}
		}
		//...........Grade....
		if(!context.parameters.GradeDataSet.loading){
			//if(context.parameters.StockDataSet){
			this.GradeItems=[];
			context.parameters.GradeDataSet?.sortedRecordIds.forEach((recordId)=>{
				let currentRecord=context.parameters.GradeDataSet.records[recordId];	
				this.tempGrade=new Grade();
				this.tempGrade.id=recordId;
				this.tempGrade.name=currentRecord.getFormattedValue("vel_name");
				//..........if required
				//this.tempSeason.current=currentRecord.getFormattedValue("vel_current");
				this.GradeItems.push(this.tempGrade);			
			});
				
			if(context.parameters.GradeDataSet.sortedRecordIds.length>0){
				this.tempGrades=new Grades();
				this.tempGrades.items=this.GradeItems;
				this.GradeObj=[];
				this.GradeObj.push(this.tempGrades);
			}
			
		}
		//...........Customer....
		if(!context.parameters.CustomerDataSet.loading){
			//if(context.parameters.StockDataSet){
			this.CustomerItems=[];
			context.parameters.CustomerDataSet?.sortedRecordIds.forEach((recordId)=>{
				let currentRecord=context.parameters.CustomerDataSet.records[recordId];	
				this.tempCustomer=new Customer();
				this.tempCustomer.id=recordId;
				this.tempCustomer.name=currentRecord.getFormattedValue("name");
				//..........if required
				//this.tempSeason.current=currentRecord.getFormattedValue("vel_current");
				this.CustomerItems.push(this.tempCustomer);			
			});
				
			if(context.parameters.CustomerDataSet.sortedRecordIds.length>0){
				this.tempCustomers=new Grades();
				this.tempCustomers.items=this.CustomerItems;
				this.CustomerObj=[];
				this.CustomerObj.push(this.tempCustomers);
			}
		}
		
		this.vue = new Vue({
			el: this.appElement, 
		 render: (h) => h(App, { 
			 props: { 
				 DragBoxObj: this.dragboxObj, 
				 LastBoxName: "Allocation", 
				 Countries:this.ContryObj,
				 Seasons:this.SeasonObj,
				 Grades:this.GradeObj,
				 Commodities:this.CommodityObj,
				 Customers:this.CustomerObj,
				 //OnChange:this.OnChange,
				 //OnChangeCountry:this.OnChangeCountry,
				 OnClickSearch:this.OnClickSearch,
			 } 
		 	}), 
	 	});
	}/*
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
	} */

	// This Method is not using
	/*
	OnChange = (event:Event,selectedCountryValue:string):void => {
		
		//alert("Hi"+(<HTMLSelectElement>event.target).value);		
		this.productName=(<HTMLInputElement>event.target).value;
		this._context.parameters.CustomerOpporunityProductDataSet.filtering.clearFilter();
            let fieldName = "";
			
			
			fieldName = "searchProductNameField";
			
			
			let conditionsArray = [];           
            let condition1 = {
                attributeName: fieldName,
                conditionOperator: 6 ,
                value: "%" + this.productName + "%"
            };
			conditionsArray.push(condition1);
			if(selectedCountryValue !== undefined && selectedCountryValue !==null && selectedCountryValue !==""){
				fieldName = "searchCountryField";
				let condition2 = {
					attributeName: fieldName,
					conditionOperator: 6 ,
					value: "%" + selectedCountryValue+ "%"
				};
				conditionsArray.push(condition2);
			}	
           
			this._context.parameters.CustomerOpporunityProductDataSet.filtering.setFilter({
                conditions: conditionsArray,
                filterOperator: 1 
            });
            this._context.parameters.CustomerOpporunityProductDataSet.refresh();
			
			//this.OnLoadRender(this._context);
	}
	*/
	// This Method is not using
	/*
	OnChangeCountry = (event:Event,productname:string):void => {
		this.countryName=(<HTMLSelectElement>event.target).value;
		this._context.parameters.CustomerOpporunityProductDataSet.filtering.clearFilter();
		let fieldName = "";			
			
			fieldName = "searchCountryField";			
			
			let conditionsArray = [];
            let condition1 = {
                attributeName: fieldName,
                conditionOperator: 6 ,
                value: "%" + this.countryName + "%"
            };
			conditionsArray.push(condition1);
			if(productname !== undefined && productname !==null && productname !==""){
				fieldName = "searchProductNameField";
				let condition2 = {
					attributeName: fieldName,
					conditionOperator: 6 ,
					value: "%" + productname+ "%"
				};
				conditionsArray.push(condition2);
			}	
			this._context.parameters.CustomerOpporunityProductDataSet.filtering.setFilter({
                conditions: conditionsArray,
                filterOperator: 1 
            });
            this._context.parameters.CustomerOpporunityProductDataSet.refresh();
		
	} */
	OnClickSearch=(selectedCountryValue:string,selectedSeasonValue:string,selectedGradeValue:string,selectedCommodityValue:string,selectedCustomerValue:string):void=>{
		this._context.parameters.CustomerOpporunityProductDataSet.filtering.clearFilter();
		let fieldName = "";	
		let conditionsArray = [];		
		// Option 1 using the property-set name directly
		if(selectedCountryValue !== undefined && selectedCountryValue !==null && selectedCountryValue !==""){
			fieldName = "searchCountryField";
			let condition1 = {
				attributeName: fieldName,
				conditionOperator: 6 /* Like */,
				value: "%" + selectedCountryValue+ "%"
			};
			conditionsArray.push(condition1);
		}	
		if(selectedCustomerValue !== undefined && selectedCustomerValue !==null && selectedCustomerValue !==""){
			fieldName = "searchCustomerField";
			let condition2 = {
				attributeName: fieldName,
				conditionOperator: 0 /* Like */,
				value: selectedCustomerValue
			};
			conditionsArray.push(condition2);
		}	
		if(selectedSeasonValue !== undefined && selectedSeasonValue !==null && selectedSeasonValue !==""){
			fieldName = "searchSeasonField";
			let condition3 = {
				attributeName: fieldName,
				conditionOperator: 6 /* Like */,
				value: "%" + selectedSeasonValue+ "%"
			};
			conditionsArray.push(condition3);
		}
		//............	
		if(selectedGradeValue !== undefined && selectedGradeValue !==null && selectedGradeValue !==""){
			fieldName = "searchGradeField";
			let condition4 = {
				attributeName: fieldName,
				conditionOperator: 0 /* Like */,
				value: selectedGradeValue
			};
			conditionsArray.push(condition4);
		}	
		if(selectedCommodityValue !== undefined && selectedCommodityValue !==null && selectedCommodityValue !==""){
			fieldName = "searchCommodityField";
			let condition5 = {
				attributeName: fieldName,
				conditionOperator: 0 /* Like */,
				value: selectedCommodityValue
			};
			conditionsArray.push(condition5);
		}	
		this._context.parameters.CustomerOpporunityProductDataSet.filtering.setFilter({
			conditions: conditionsArray,
			filterOperator: 1 /* Or */
		});
		this._context.parameters.CustomerOpporunityProductDataSet.refresh();
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
