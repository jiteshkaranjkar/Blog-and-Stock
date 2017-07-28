import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockService } from './../../services/stock.service';
import { ContentEditableDirective } from '../../utils/contentEditable.model';
//import { IStock } from '../../model/Stock';
//https://github.com/vimalavinisha/angular2-google-chart
//https://www.npmjs.com/package/angular2-google-chart
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  stockFrmGrp:FormGroup;
  messageClass;
  message;
  newStock = false;
  loadingStocks = false;
  processing = false;
  username;
  Stocks;
  loading: boolean;
  googAPIop: string = "";
  stkNameList: string = "";
  quoteStr: string = "";
  stkDetails: string = "";
  stkQuoteVisibility: number = 0;
  arrStocks = [];
  arrCompany = [];
  arrBuyPrice = [];
  arrQuantity = [];
  public line_ChartData = [];

  constructor(private frmBldr:FormBuilder, private stockService: StockService) { }

  ngOnInit() {
    this.stockPortfolio();
    //Get all Stocks
    this.getAllStocks();
    this.loadCharts();
    //this.getQuote('TCS,INFY');

    this.line_ChartData = [['Quantity', 'Buy Price', 'Live Price']];
  }

  newStockForm()
  {
    this.newStock = true;
    this.enableForm();
  }

  reloadStocks(){
    this.loadingStocks = true;
    //Get all Stocks
    this.getAllStocks();

    setTimeout(() => {
      this.loadingStocks = false; 
    }, 5000);
  }

  stockPortfolio(){
    this.stockFrmGrp = this.frmBldr.group({
      company : ['', Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      quantity : ['', Validators.compose([ Validators.required])],
      buyPrice : ['', Validators.required],
      date : ['', Validators.required],
      livePrice : [''],
      change : [''],
      daysGain : [''],
      overAllGain : [''],
      comment : ['']
    });

  }

  onstockSubmit(formData: any){
    this.processing = true;
    this.disableForm();
    console.log("new stock Submit - " + formData.company + "--" + formData.quantity + "--" + formData.date + "--" + formData.buyPrice);
    const stock = { company : formData.company, quantity: formData.quantity, date: formData.date, buyPrice : formData.buyPrice, comment : formData.comment};
    this.stockService.newStock(stock).subscribe(data => {
    if(!data.success)
      {
        this.messageClass = 'alert alert-danger'
        this.message = data.message;
        this.processing = false;
        this.enableForm()
      }else
      {
        this.messageClass = 'alert alert-success'
        this.message = data.message;
        //this.enableForm();
        this.stockPortfolio();
        //setTimeout(function() {
          this.newStock = false;
          this.processing = false;
        //}, 500);
        this.getAllStocks();
      }
    });
  }

  getAllStocks(){
    this.stockPortfolio();
    this.stockService.getAllStocks().subscribe(data => {
      this.Stocks = data.stocks;

      //console.log(JSON.stringify(this.Stocks));
      for (let i in this.Stocks) {
        this.arrStocks.push(this.Stocks[i].company, this.Stocks[i].buyPrice, this.Stocks[i].quantity);
        this.arrCompany.push(this.Stocks[i].company);
        this.arrBuyPrice.push(this.Stocks[i].buyPrice);
        this.arrQuantity.push(this.Stocks[i].quantity);
      }
      this.loadCharts();
    });
  }

  goBack(){
    window.location.reload();
  }

  onQuantChange(colText, stockId){
    let index = this.Stocks.findIndex(stock => stock._id === stockId);
    this.Stocks[index].quantity = colText;
    this.updateStock(this.Stocks[index]);
  }

  onDateChange(colText, stockId){
    let index = this.Stocks.findIndex(stock => stock._id === stockId);
    this.Stocks[index].date = colText;
    this.updateStock(this.Stocks[index]);
  }

  onPriceChange(colText, stockId){
    let index = this.Stocks.findIndex(stock => stock._id === stockId);
    this.Stocks[index].buyPrice = colText;
    this.updateStock(this.Stocks[index]);
  }

  onCommentChange(colText, stockId){
    let index = this.Stocks.findIndex(stock => stock._id === stockId);
    this.Stocks[index].comment = colText;
    this.updateStock(this.Stocks[index]);
  }

  onCompanyChange(colText, stockId){
    let index = this.Stocks.findIndex(stock => stock._id === stockId);
    this.Stocks[index].company = colText;
    this.updateStock(this.Stocks[index]);
  }

  updateStock(stock){
    this.stockService.updateStock(stock).subscribe(data => {
    if(!data.success)
      {
        console.log("updateStock Internal- data.Fail" + data.message);
        this.messageClass = 'alert alert-danger'
        this.message = data.message;
        this.processing = false;
        this.enableForm()
      }else
      {
        this.messageClass = 'alert alert-success'
        this.message = data.message;
        this.getAllStocks();
        setTimeout(function() {
          this.newStock = false;
          this.processing = false;
          //this.stockFrmGrp.reset();
          this.enableForm();
        }, 1000);
      }
    });
  }

  onDelete(stockId:number, index:number){
    this.stockService.deleteStock(this.Stocks[index]._id).subscribe(data => {
    if(!data.success)
      {
        console.log("updateStock Internal- data.Fail" + data.message);
        this.messageClass = 'alert alert-danger'
        this.message = data.message;
        this.processing = false;
        this.enableForm()
      }else
      {
        console.log("updateStock Internal- data.Success" + this.Stocks[index]._id);
        this.messageClass = 'alert alert-success'
        this.message = data.message;
        this.getAllStocks();
        //setTimeout(function() {
          this.newStock = false;
          this.processing = false;
          //this.stockFrmGrp.reset();
          this.enableForm();
   //     }, 2000);
      }
    });

  }
  
  getQuote(value: string) {
      if (value != "") {
          this.quoteStr = value;
          this.stockService.getQuote(value).subscribe(data => {
                  this.stkDetails = data.text().replace('[', '').replace(']', '');
              },
              err => { this.stkDetails = "Incorrect stock name, use proper name to get quote." + <any>err; }
              );
          this.stkQuoteVisibility = 1;
      }
      else
      {
          this.stkQuoteVisibility = 0;
      }

      console.log(this.stkDetails);
  }

  disableForm(){
    this.stockFrmGrp.controls['company'].disable();
    this.stockFrmGrp.controls['date'].disable();
    this.stockFrmGrp.controls['quantity'].disable();
    this.stockFrmGrp.controls['buyPrice'].disable();
    this.stockFrmGrp.controls['comment'].disable();
  }

  enableForm(){
    console.log("Enable Form - " + this.stockFrmGrp.controls['company'].value);
    this.stockFrmGrp.controls['company'].enable();
    this.stockFrmGrp.controls['date'].enable();
    this.stockFrmGrp.controls['quantity'].enable();
    this.stockFrmGrp.controls['buyPrice'].enable();
    this.stockFrmGrp.controls['comment'].enable();
  }

  loadCharts()
  {
    var result = [];
      for(var i = 0; i < this.arrCompany.length; i++) {
        let three = [];
        //three.push(this.arrCompany[i] + ", " + this.arrBuyPrice[i] + ", " + this.arrQuantity[i])
        result.push(this.arrStocks[i]);
      }
    this.line_ChartData = result; 
    console.log(this.line_ChartData[1]);
    console.log(this.line_ChartData[2]);
    console.log(this.line_ChartData[3]);

  }
  //public line_ChartData = [
        // ['Quantity', 'Buy Price', 'Live Price'],
        // ['2004', 1000, 400],
        // ['2005', 1170, 460],
        // ['2006', 660, 1120],
        // ['2007', 1030, 540]];
    // public bubble_ChartData = [
    //     ['Company', 'Buty Price', 'Quantity', 'Region', 'Date'],
    //     ['CAN', 80.66, 1.67, 'North America', 33739900],
    //     ['DEU', 79.84, 1.36, 'Europe', 81902307],
    //     ['DNK', 78.6, 1.84, 'Europe', 5523095],
    //     ['EGY', 72.73, 2.78, 'Middle East', 79716203],
    //     ['GBR', 80.05, 2, 'Europe', 61801570],
    //     ['IRN', 72.49, 1.7, 'Middle East', 73137148],
    //     ['IRQ', 68.09, 4.77, 'Middle East', 31090763],
    //     ['ISR', 81.55, 2.96, 'Middle East', 7485600],
    //     ['RUS', 68.6, 1.54, 'Europe', 141850000],
    //     ['USA', 78.09, 2.05, 'North America', 307007000]];
    // public scatter_ChartData = [
    //     ['Date', 'Sales Percentage'],
    //     [new Date(2016, 3, 22), 78],
    //     [new Date(2016, 3, 21, 9, 30, 2), 88],
    //     [new Date(2016, 3, 20), 67],
    //     [new Date(2016, 3, 19, 8, 34, 7), 98],
    //     [new Date(2016, 3, 18, 15, 34, 7), 95],
    //     [new Date(2016, 3, 16, 7, 30, 45), 89],
    //     [new Date(2016, 3, 16, 15, 40, 35), 68]
    // ];
    // public candle_ChartData = [
    //     ['Day', 'Low', 'Opening value', 'Closing value', 'High'],
    //     ['Mon', 28, 28, 38, 38],
    //     ['Tue', 38, 38, 55, 55],
    //     ['Wed', 55, 55, 77, 77],
    //     ['Thu', 77, 77, 66, 66],
    //     ['Fri', 66, 66, 22, 22]
    // ];
    // public pie_ChartData = [
    //     ['Task', 'Hours per Day'],
    //     ['Work', 11],
    //     ['Eat', 2],
    //     ['Commute', 2],
    //     ['Watch TV', 2],
    //     ['Sleep', 7]];
    // public bar_ChartData = [
    //     ['City', '2010 Population', '2000 Population'],
    //     ['New York City, NY', 8175000, 8008000],
    //     ['Los Angeles, CA', 3792000, 3694000],
    //     ['Chicago, IL', 2695000, 2896000],
    //     ['Houston, TX', 2099000, 1953000],
    //     ['Philadelphia, PA', 1526000, 1517000]];
    // public map_ChartData = [
    //     ['Country', 'Popularity'],
    //     ['Germany', 200],
    //     ['United States', 300],
    //     ['Brazil', 400],
    //     ['Canada', 500],
    //     ['France', 600],
    //     ['RU', 700]
    // ];
    // public org_ChartData = [
    //     ['Name', 'Manager', 'ToolTip'],
    //     [{ v: 'Mike', f: 'Mike<div style="color:red; font-style:italic">President</div>' },
    //         '', 'The President'],
    //     [{ v: 'Jim', f: 'Jim<div style="color:red; font-style:italic">Vice President</div>' },
    //         'Mike', 'VP'],
    //     ['Alice', 'Mike', ''],
    //     ['Bob', 'Jim', 'Bob Sponge'],
    //     ['Carol', 'Bob', '']
    // ];
    // public line_ChartOptions = {
    //     title: 'Company Performance',
    //     curveType: 'function',
    //     legend: {
    //         position: 'bottom'
    //     }
    // };
    // public bubble_ChartOptions = {
    //     title: 'Correlation between life expectancy, fertility rate ' +
    //     'and population of some world countries (2010)',
    //     hAxis: { title: 'Life Expectancy' },
    //     vAxis: { title: 'Fertility Rate' },
    //     bubble: { textStyle: { fontSize: 11 } }

    // };
    // public candle_ChartOptions = {
    //     legend: 'none',
    //     bar: { groupWidth: '100%' }, // Remove space between bars.
    //     candlestick: {
    //         fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
    //         risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
    //     }
    // };
    // public scatter_ChartOptions = {
    //     legend: {
    //         position: 'bottom'
    //     },
    //     title: 'Company Sales Percentage'
    // };
    // public bar_ChartOptions = {
    //     title: 'Population of Largest U.S. Cities',
    //     chartArea: { width: '50%' },
    //     hAxis: {
    //         title: 'Total Population',
    //         minValue: 0,
    //         textStyle: {
    //             bold: true,
    //             fontSize: 12,
    //             color: '#4d4d4d'
    //         },
    //         titleTextStyle: {
    //             bold: true,
    //             fontSize: 18,
    //             color: '#4d4d4d'
    //         }
    //     },
    //     vAxis: {
    //         title: 'City',
    //         textStyle: {
    //             fontSize: 14,
    //             bold: true,
    //             color: '#848484'
    //         },
    //         titleTextStyle: {
    //             fontSize: 14,
    //             bold: true,
    //             color: '#848484'
    //         }
    //     }
    // };
    // public pie_ChartOptions = {
    //     title: 'My Daily Activities',
    //     width: 900,
    //     height: 500
    // };
    // public gauge_ChartData = [
    //     ['Label', 'Value'],
    //     ['Systolic', 120],
    //     ['Diastolic', 80]];
    // public gauge_ChartOptions = {
    //     width: 400, height: 120,
    //     redFrom: 90, redTo: 100,
    //     yellowFrom: 75, yellowTo: 90,
    //     minorTicks: 5
    // };
    // public area_ChartData = [
    //     ['Year', 'Sales', 'Expenses'],
    //     ['2013', 1000, 400],
    //     ['2014', 1170, 460],
    //     ['2015', 660, 1120],
    //     ['2016', 1030, 540]
    // ];

    // public area_ChartOptions = {
    //     title: 'Company Performance',
    //     hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
    //     vAxis: { minValue: 0 }
    // };

    // public map_ChartOptions = {};
    // public org_ChartOptions = {
    //     allowHtml: true
    // };

    // RealTimeStock() {
    //     this.getCompanyList();
        
    //     this.http.get('https://www.google.com/finance/info?q=NSE:' + this.stkNameList)
    //         .subscribe(data => {
    //             this.googAPIopArry = data.text().replace('[', '').replace(']', '').split('{', 100);//var str = "SUNPHARMA,TCS";
    //             //this.apiStockList = JSON.parse(data.text());
    //         });
    //     //setTimeout(() => console.log("First " + this.googAPIopArry[1].toString()), 400);
    //     ////setTimeout(() => console.log("Second " + this.getJsonData(this.googAPIopArry)), 400);

    //     ////setTimeout(() => this.getJsonData(this.googAPIopArry), 500);
    // }

    // getCompanyList() {
    //     var resultString = ""; // result variable
    //     this.stocks.forEach(function (stock) {
    //         resultString += (stock.Company + ",");
    //     });
    //     //remove the extra comma at the end, using a regex
    //     this.stkNameList = resultString.replace(/,(?=[^,]*$)/, '')
    // }

    

    addStock()
    {
    //   onstockSubmit()
    //   this.stocks.push(
    //     [
    //       {
    //         "Company": "INFY",
    //         "Quantity": 70,
    //         "BuyPrice": 1029.6,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "LT",
    //         "Quantity": 45,
    //         "BuyPrice": 1367.42,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "MINDTREE",
    //         "Quantity": 45,
    //         "BuyPrice": 473.42,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "ASIANPAINT",
    //         "Quantity": 5,
    //         "BuyPrice": 908.82,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "BANKBARODA",
    //         "Quantity": 40,
    //         "BuyPrice": 167.44,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "SHARONBIO",
    //         "Quantity": 550,
    //         "BuyPrice": 9.4,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "SUNPHARMA",
    //         "Quantity": 130,
    //         "BuyPrice": 679.37,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "SBIN",
    //         "Quantity": 125,
    //         "BuyPrice": 241,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "DRREDDY",
    //         "Quantity": 10,
    //         "BuyPrice": 2812.65,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "ICICIBANK",
    //         "Quantity": 125,
    //         "BuyPrice": 265.71,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "TATAMOTORS",
    //         "Quantity": 20,
    //         "BuyPrice": 452.05,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "PNB",
    //         "Quantity": 50,
    //         "BuyPrice": 126.86,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "JISLJALEQS",
    //         "Quantity": 5,
    //         "BuyPrice": 92.55,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "DHFL",
    //         "Quantity": 25,
    //         "BuyPrice": 226,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "ASHOKLEY",
    //         "Quantity": 150,
    //         "BuyPrice": 88.33,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "EDUCOMP",
    //         "Quantity": 150,
    //         "BuyPrice": 14.52,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "IOC",
    //         "Quantity": 60,
    //         "BuyPrice": 102.24,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "SPICEJET",
    //         "Quantity": 50,
    //         "BuyPrice": 63.89,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "GITANJALI",
    //         "Quantity": 80,
    //         "BuyPrice": 57.09,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "TCS",
    //         "Quantity": 29,
    //         "BuyPrice": 2345.69,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "ENGINERSIN",
    //         "Quantity": 50,
    //         "BuyPrice": 141.16,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "COALINDIA",
    //         "Quantity": 65,
    //         "BuyPrice": 323.36,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "PUNJLLOYD",
    //         "Quantity": 200,
    //         "BuyPrice": 19.92,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "ICICIPRULI",
    //         "Quantity": 100,
    //         "BuyPrice": 325.04,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "JINDALSTEL",
    //         "Quantity": 50,
    //         "BuyPrice": 69.44,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "JUBLFOOD",
    //         "Quantity": 15,
    //         "BuyPrice": 994.9,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "JETAIRWAYS",
    //         "Quantity": 50,
    //         "BuyPrice": 437.37,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "NHPC",
    //         "Quantity": 50,
    //         "BuyPrice": 21.72,
    //         "Date": "26/07/2017"
    //       },
    //       {
    //         "Company": "IVRCLINFRA",
    //         "Quantity": 1000,
    //         "BuyPrice": 7.01,
    //         "Date": "26/07/2017"
    //       }
    //     ]
    //   );
    }
}
