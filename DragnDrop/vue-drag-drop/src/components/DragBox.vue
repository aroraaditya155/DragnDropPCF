<template>
  <div class="drag-drop-box" v-if="renderComponent">
    <div class="row">    
      <div class="col-md-3 drag-col1" v-for="box in DragnDropBox" :key="box.boxNumber">
        <div class="p-2 alert alert-warning">
          <h3>{{ box.Name }}</h3>
          <div v-if="box.Name==='CUSTOMER'">
            <!-- Country -->
            <div v-for="c in Countries" :key="c.id">
             <select class="form-control" @change="changeCountry($event)" v-model="selectedCountryValue">
              <option value="" selected disabled>Choose Country</option>
              <option v-for="Country in c.items" :value="Country.name" :key="Country.id">{{ Country.name }}</option>
            </select> 
            </div>
            <!-- end country -->
            <!-- Customer -->
           <!-- <div v-for="c in Customers" :key="c.id">
             <select class="form-control" @change="changeCustomer($event)" v-model="selectedCustomerValue">
              <option value="" selected disabled>Choose Customer</option>
              <option v-for="Customer in c.items" :value="Customer.id" :key="Customer.id">{{ Customer.name }}</option>
            </select> 
            </div> -->
            <!-- end Customer -->
            <!-- Grade -->
            <!-- <div v-for="g in Grades" :key="g.id">
             <select class="form-control" @change="changeGrade($event)" v-model="selectedGradeValue">
              <option value="" selected disabled>Choose Grade</option>
              <option v-for="Grade in g.items" :value="Grade.id" :key="Grade.id">{{ Grade.name }}</option>
            </select> 
            </div> -->
            <!-- end Grade -->
            <!-- Commodity -->
            <!-- <div v-for="c in Commodities" :key="c.id">
             <select class="form-control" @change="changeCommodity($event)" v-model="selectedCommodityValue">
              <option value="" selected disabled>Choose Commodity</option>
              <option v-for="Commodity in c.items" :value="Commodity.id" :key="Commodity.id">{{ Commodity.name }}</option>
            </select> 
            </div> -->
            <!-- end Commodity -->
             <!-- Season -->
            <div v-for="s in Seasons" :key="s.id">
             <select class="form-control" @change="changeSeason($event)" v-model="selectedSeasonValue">
              <option value="" selected disabled>Choose Season</option>
              <option v-for="Season in s.items" :value="Season.name" :key="Season.id">{{ Season.name }}</option>
            </select>  
            <button primary v-on:click="forceRerender()">Search</button>            
            </div> 
             <!-- end Season -->          
          </div>
          <draggable class="list-group list-col1" v-model="box.items" :options="availableItemOptions">
            <div class="list-group-item" v-for="item in box.items" :key="item.name">
              <div v-if="box.Name==='CUSTOMER'">
              <p>Drag to select>></p>
              <p>{{ item.customerName }} &nbsp;Season:{{item.season}} </p>            
              <p>Sales Agreement: - {{item.salesAgreement}}&nbsp;Product Name:{{item.productName}}</p>
              <p>Commodity:{{item.commodity}}&nbsp;Grade:{{item.grade}}&nbsp;Allocated Mts:{{item.allocatedMts}}</p>              
              <p>Country:{{item.country}}</p> 
              </div> 
              <div v-if="box.Name!=='CUSTOMER'"> 
              <p>Drag to allocation>></p>
              <p>Batch:{{item.batch}}  </p>            
              <p>Product:{{item.productName}}&nbsp;Quality:{{item.quality}}</p>
              <p>Quantity:{{item.quantity}}&nbsp;Location:{{item.warehouseLocation}}</p>   
              <p>Warehouse:{{item.warehouse}}</p>          
              </div>
            </div>
          </draggable>
        </div>
      </div>
      <div class="col-md-3 drag-col2">
        <div class="p-2 alert alert-success">
          <h3>{{ LastBoxName }}</h3>
          <div>
            <h4>Customer</h4>
            <draggable class="list-group list-col2" v-model="clonedCustomerItems" :options="clonedCustomerItemOptions" @change="onChangeCustomer">
              <div class="list-group-item" v-for="item in clonedCustomerItems" :key="item.name">
              <div v-if="item.type ==='customer'">                 
                <p>{{ item.customerName }} &nbsp;Season:{{item.season}} </p>            
                <p>Sales Agreement: - {{item.salesAgreement}}&nbsp;Product Name:{{item.productName}}</p>
                <p>Commodity:{{item.commodity}}&nbsp;Grade:{{item.grade}}&nbsp;Allocated Mts:{{item.allocatedMts}}</p>              
                <p>Country:{{item.country}}</p> 
              </div>
              </div>
            </draggable>
          </div>
          <div>
            <h4>Allocation</h4>
            <draggable class="list-group list-col2" v-model="clonedAllocationItems" :options="clonedItemAllocationOptions" @change="onChangeAllocation">
              <div class="list-group-item" v-for="item in clonedAllocationItems" :key="item.name">
                <div v-if="item.type ==='stock'">
                <p>Batch:{{item.batch}}  </p>            
                <p>Product:{{item.productName}}&nbsp;Quality:{{item.quality}}</p>
                <p>Quantity:{{item.quantity}}&nbsp;Location:{{item.warehouseLocation}}</p>   
                <p>Warehouse:{{item.warehouse}}</p>   
                 </div>
              </div>
            </draggable>
          </div>
        </div>
        <button primary v-on:click="saveClick">Save</button>
        <button primary v-on:click="ResetClick">Reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: { draggable },

  props: {
    DragnDropBox: [],
    LastBoxName: { type: String, required: true },
    Countries:[],
    Seasons:[],
    Grades:[],
		Commodities:[],
    Customers:[],
    //OnChange: [],
    //OnChangeCountry: [],
    OnClickSearch: []
  },
   data() {
    return {
      renderComponent: true,
      selectedCountryValue:"",
      selectedSeasonValue:"",
      selectedGradeValue:"",
      selectedCommodityValue:"",
      selectedCustomerValue:"",     
      availableItemOptions: {
        group: {
          name: "items",
          pull: "clone",
          put: false,
        },

        sort: false,
      },
      clonedCustomerItemOptions: {
        group: "items",
      },
      clonedCustomerItems: [],
      clonedItemAllocationOptions: {
        group: "items",
      },
      clonedAllocationItems: []
    };
  },
  methods: {
    onChangeCustomer() {     
      let filtered=[];
      filtered = this.clonedCustomerItems.filter(function(e){ 
        return e.type==="customer";
      }); 
      if (this.clonedCustomerItems.length > 1) {
        this.clonedCustomerItems.pop();
      }
      
      this.clonedCustomerItems=filtered;
      //this.clonedCustomerItems.push(filtered);
    },
     onChangeAllocation() {   
      let filtered=[];
      filtered = this.clonedAllocationItems.filter(function(e){ 
        return e.type==="stock";
      });   
      if (this.clonedAllocationItems.length > 1) {
        this.clonedAllocationItems.pop();
      }
      this.clonedAllocationItems=filtered;
    },
    saveClick() {      
      let entityFormOptions = {};
      let formParameters = {};
      entityFormOptions["entityName"] = "vel_reservation";
      entityFormOptions["useQuickCreateForm"] = true;
      //Set Stock On Hand Lookup
      if(this.clonedAllocationItems){
        formParameters["vel_stockonhand"] = this.clonedAllocationItems[0].id; // ID of the user.
        formParameters["vel_stockonhandname"] = this.clonedAllocationItems[0].name; // Name of the user.
        formParameters["vel_stockonhandtype"] = "vel_stockonhand"; // Table name. 
      }
       //Set Sales Opportunity Line Lookup
      if(this.clonedCustomerItems){
        formParameters["vel_salesopportunityline"] = this.clonedCustomerItems[0].id; // ID of the user.
        formParameters["vel_salesopportunitylinename"] = this.clonedCustomerItems[0].name; // Name of the user.
        formParameters["vel_salesopportunitylinetype"] = "opportunityproduct"; // Table name. 
      }
      // Open the form.
      Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
        function (success) {          
          console.log(success);
       },
        function (error) {
          console.log(error);
        }
      );
    },
    ResetClick(){
      this.clonedAllocationItems=[];
      this.clonedCustomerItems=[];
      this.selectedCountryValue="";
      this.selectedSeasonValue="";
      this.selectedGradeValue="";
      this.selectedCommodityValue="";
      this.selectedCustomerValue="";
    },
   changeCountry: function changeCountry(event) {
      //this.OnChangeCountry(event,this.productname);
      //alert( event.target.value);
    },
    changeGrade: function changeGrade(event){

    },
    changeCommodity: function changeCommodity(event){

    },
    changeSeason: function changeSeason(event){

    },
    changeCustomer: function changeCustomer(event){

    },
    forceRerender() {
      this.OnClickSearch(this.selectedCountryValue,this.selectedSeasonValue,this.selectedGradeValue,this.selectedCommodityValue,this.selectedCustomerValue);
      // Remove my-component from the DOM
      this.renderComponent = false;
      this.$nextTick(() => {
        // Add the component back in
       this.renderComponent = true;
      }); 
    },
  },
 
};
</script>

<style>
.drag-col1 {
  min-height: 250px;
  width: 25%;
  float: left;
  background-color: #fff3cd;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
  color: #856404;
}
.drag-col2 {
  min-height: 250px;
  width: 25%;
  float: left;
  background-color: #d4edda;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
  color: #155724;
}
.list-col1 {
  min-height: 250px;
  background-color: #fff3cd;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
}
.list-col2 {
  min-height: 250px;
  background-color: #d4edda;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
}
.list-group-item {
  background-color: #fff;
  border-bottom: solid;
  border-top-color: rgba(0, 0, 0, 0.125);
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: rgba(0, 0, 0, 0.125);
  border-right-style: solid;
  border-right-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.125);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-color: rgba(0, 0, 0, 0.125);
  border-left-style: solid;
  border-left-width: 1px;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  padding: 0.75rem 1.25rem;
}
h3 {
  font-size: 1.75rem;
}
p {
  padding: 3px;
}
</style>
