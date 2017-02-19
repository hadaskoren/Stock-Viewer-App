'use strict';

import VueHighcharts from 'vue-highcharts';
import tableStocksData from '../table-stocks-data/index.vue';
import chartYearDiff from '../chart-year-diff/index.vue';

export default {
    data() {
        return {
            moreThanSix: false
        }
    },
    computed: {
        stocks() {
            return this.$store.state.stocks;
        },
        showData: {
            get() {
                return this.$store.state.showData;
            },
            set(showData) {
                this.$store.dispatch('updateShowData', showData);
            }
        },
        stocksInput: {
            get() {
                return this.$store.state.stocksInput;
            },
            set(stocksInput) {
                this.$store.dispatch('updateInput', stocksInput);
            }
        }
    },
    watch: {
        stocks() {
            if (this.$store.state.stocks.length > 6) {
                this.moreThanSix = true;
            } else {
                this.moreThanSix = false;
            }
        }
    },
    methods: {
        /*
         *
         * This metohd will create a string of the stocks' symbols that are being searched by the user
         * according to this template: ("stock_name", "stock_name"...)
         * 
         * */
        createStocksSymbolsStr() {
            let stocksArr = this.stocksInput.split(',');
            let stocksSymbolsForAPI = '(';
            stocksArr.forEach((stock, index) => {
                if(index !== stocksArr.length-1) {
                    stocksSymbolsForAPI += '"' + stock.trim() + '"' + ',';
                } else {
                    stocksSymbolsForAPI += '"'+ stock.trim() + '"' + ')';
                }
            });
            return stocksSymbolsForAPI;
        },
        /*
         *
         * This method is the FIRST to be called - once a user click the search button or enter in the search input field
         * 
         * */
        callAPI() {
            let stocksSymbols = this.createStocksSymbolsStr();

            let yahooAPI = `http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20
            where%20symbol%20IN%20${stocksSymbols}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
            
            fetch(yahooAPI)
                    .then(res => res.json())
                    .then(res => {
                        this.checkResult(res);
                    }).catch((error)=> {
                        console.log('this.stocks.length',this.stocks.length);
                        if(this.stocks.length === 0){
                            this.showData = false;
                            this.moreThanSix = false;
                        }
                        toastr.options.timeOut = 2000;
                        toastr.warning('Stock symbol wasn\'t found, please try again');
                    })
        },
        /*
         *
         * This method checks if the result we got from the API is an array of objects or a single object
         * 
         * */
        checkResult(res) {
            this.$store.state.stocks = [];
            let stocksResult = res.query.results.quote;

            if(stocksResult.length !== undefined) {
                for(var i = 0; i < stocksResult.length; i++) {
                    this.updateCurrStocks(stocksResult[i]);
                }
            } else {
                this.updateCurrStocks(stocksResult);
            }
        },
         /*
         *
         * This method gets a json object, create a stock object and send to the store to update the stocks.
         * 
         * */
        updateCurrStocks(stocksResult) {
            let yearRangeStr = stocksResult["YearRange"];
            let yearRangeARR = yearRangeStr.split(" - ");
            let stock = {
                symbol: stocksResult["Symbol"],
                name: stocksResult["Name"],
                previousClose: stocksResult["PreviousClose"],
                yearLow: yearRangeARR[0],
                yearHigh: yearRangeARR[1],
                changeFromYearHigh: stocksResult["ChangeFromYearHigh"],
                changeFromYearLow: stocksResult["ChangeFromYearLow"]
            }
            this.$store.dispatch('addToStocks', stock);
        }
    },
    components: {
        tableStocksData,
        chartYearDiff
    },
}