<template>
  <div  class="drag-drop-box" v-if="renderComponent">    
      <div class="drag-col1" v-for="box in DragnDropBox" :key="box.boxNumber">
        <div class="p-2 alert alert-warning">
          <h3>{{ box.Name }}</h3>
          <div v-if="box.Name==='Customer'">
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
            <div v-for="g in Grades" :key="g.id">
             <select class="form-control" @change="changeGrade($event)" v-model="selectedGradeValue">
              <option value="" selected disabled>Choose Grade</option>
              <option v-for="Grade in g.items" :value="Grade.id" :key="Grade.id">{{ Grade.name }}</option>
            </select> 
            </div>
            <!-- end Grade -->
            <!-- Commodity -->
            <div v-for="c in Commodities" :key="c.id">
             <select class="form-control" @change="changeCommodity($event)" v-model="selectedCommodityValue">
              <option value="" selected disabled>Choose Commodity</option>
              <option v-for="Commodity in c.items" :value="Commodity.id" :key="Commodity.id">{{ Commodity.name }}</option>
            </select> 
            </div> 
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
              <div v-if="box.Name==='Customer'">
              <p>Drag to select >></p>
              <p><b>Customer:</b>&nbsp;{{ item.customerName }} </p>           
              <p><b>Commodity:</b>&nbsp;{{item.commodity}}</p>
              <p><b>Grade:</b>&nbsp;{{item.grade}}</p>
              <p><b>Quantity Required:</b>&nbsp;{{item.allocatedAvailable}}</p> 
              <p><b>Amount Reserved:</b>&nbsp;{{item.amountReserved}}</p>            
              </div> 
              <div v-if="box.Name!=='Customer'"> 
              <p>Drag to allocation >></p>
              <p><b>Batch Number:</b>&nbsp;{{item.batch}}  </p>            
              <p><b>Commodity:</b>&nbsp;{{item.commodity}} </p>
              <p><b>Grade:</b>&nbsp;{{item.grade}} </p>
              <p><b>Available for Reservation:</b>&nbsp;{{item.allocatedAvailable}} </p>
              <p><b>Amount Reserved:</b>&nbsp;{{item.amountReserved}} </p>
              </div>
            </div>
          </draggable>
        </div>
      </div>
      <div class="drag-col2">
        <div class="p-2 alert alert-success">
          <h3>{{ LastBoxName }}</h3>
          <div>
            <h4>Customer</h4>
            <draggable class="list-group list-col2" v-model="clonedCustomerItems" :options="clonedCustomerItemOptions" @change="onChangeCustomer">
              <div class="list-group-item" v-for="item in clonedCustomerItems" :key="item.name">
              <div v-if="item.type ==='customer'">                 
                <p><b>Customer:</b>&nbsp;{{ item.customerName }} </p>           
              <p><b>Commodity:</b>&nbsp;{{item.commodity}}</p>
              <p><b>Grade:</b>&nbsp;{{item.grade}}</p>
              <p><b>Quantity Required:</b>&nbsp;{{item.allocatedAvailable}}</p> 
              <p><b>Amount Reserved:</b>&nbsp;{{item.amountReserved}}</p>
              </div>
              </div>
            </draggable>
          </div>
          <div>
            <h4>Stock On Hand</h4>
            <draggable class="list-group list-col2" v-model="clonedAllocationItems" :options="clonedItemAllocationOptions" @change="onChangeAllocation">
              <div class="list-group-item" v-for="item in clonedAllocationItems" :key="item.name">
                <div v-if="item.type ==='stock'">
                <p><b>Batch Number:</b>&nbsp;{{item.batch}}  </p>            
              <p><b>Commodity:</b>&nbsp;{{item.productName}} </p>
              <p><b>Grade:</b>&nbsp;{{item.grade}} </p>
              <p><b>Available for Reservation:</b>&nbsp;{{item.allocatedAvailable}} </p>
              <p><b>Amount Reserved:</b>&nbsp;{{item.amountReserved}} </p>  
                 </div>
              </div>
            </draggable>
          </div>
        </div>
        <button primary v-on:click="saveClick">Save</button>
        <button primary v-on:click="ResetClick">Reset</button>
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
    //Customers:[],
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
      this.OnClickSearch(this.selectedCountryValue,this.selectedSeasonValue,this.selectedGradeValue,this.selectedCommodityValue,this.selectedCustomerValue);
    },
   changeCountry: function changeCountry(event) {
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
/* CSS styling for JT Johnson Stock On Hand PCF Control */
/* Jady Mulqueeney */
/* Version 0.5 - 8 Oct 2021 */

.ManyToManyDragDrop .drag-drop-box {
    width: auto;
    height: auto;
}

.ManyToManyDragDrop .drag-col1,
.ManyToManyDragDrop .drag-col2 {
    min-height: 75vh;
    width: 28%;
    float: left;
    background-color: #f4f4f4;
    border: 1px solid #CFCDCC;
    margin: 15px;
    padding: 10px;
    align-content: center;
    align-items: center;
    color: #333;
}

.ManyToManyDragDrop .list-col1,
.ManyToManyDragDrop .list-col2 {
    min-height: 150px;
    background-color: #fff;
    margin: 15px 0;
    padding: 8px;
    align-content: center;
    align-items: center;
    overflow-y: auto;
}

.ManyToManyDragDrop .drag-col1:first-of-type .list-col1 {
    height: calc(65vh - 142px);
}

.ManyToManyDragDrop .drag-col1:nth-of-type(2) .list-col1 {
    height: 65vh;
}

.ManyToManyDragDrop .list-col2 {
    background-color: #fff;
    height: calc((65vh / 2) - 52px);
}

.ManyToManyDragDrop .list-group-item {
    background-color: #fff;
    border: 2px dashed #cfc18f;
    padding: 2px 8px 4px 8px;
    margin-bottom: 8px;
    position: relative;
}

.ManyToManyDragDrop .list-col2 .list-group-item {
    border: 2px solid #0A701A;
    padding-top: 6px;
    margin-bottom: 8px;
}

.ManyToManyDragDrop h3 {
    font-size: 20px;
    font-weight: 600;
    text-transform: capitalize;
    margin-bottom: 12px;
    color: #333;
}

.ManyToManyDragDrop .list-group-item p {
    padding: 4px 0;
    font-size: 13px;
}

.ManyToManyDragDrop .list-col1 .list-group-item p:nth-of-type(even) {
    background-color: #f4f4f4;
}

.ManyToManyDragDrop .list-col1 .list-group-item p:nth-of-type(odd) {
    background-color: #fff;
}

.ManyToManyDragDrop .list-col2 .list-group-item p:nth-of-type(even) {
    background-color: #fff;
}

.ManyToManyDragDrop .list-col2 .list-group-item p:nth-of-type(odd) {
    background-color: #f4f4f4;
}

.ManyToManyDragDrop .drag-col {
    min-height: 300px;
}

.ManyToManyDragDrop .drag-drop-box select {
    width: 100%;
    height: 42px;
    border: 1px solid #ccc;
    margin-bottom: 8px;
}

.ManyToManyDragDrop .drag-drop-box button {
    outline: transparent;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    border: 1px solid #0A701A;
    display: inline-block;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    padding: 0px 16px;
    border-radius: 2px;
    min-width: 80px;
    height: 32px;
    background-color: #0A701A;
    color: #fff;
}

.ManyToManyDragDrop .drag-drop-box button:hover {
    background-color: #0a5416;
    border-color: #0a5416;
}

.ManyToManyDragDrop .drag-col2 button:nth-of-type(2) {
    background-color: #fff;
    color: #333;
    border-color: #333;
}

.ManyToManyDragDrop .drag-col2 button:nth-of-type(2):hover {
    background-color: #f4f4f4;
    color: #111;
    border-color: #111;
}

.ManyToManyDragDrop .list-col1 .list-group-item p:first-of-type {
    font-weight: 700;
    text-align: right;
    color: #0A701A;
}

.ManyToManyDragDrop .list-col2 .list-group-item p:first-of-type {
    margin-top: 6px;
}
</style>
