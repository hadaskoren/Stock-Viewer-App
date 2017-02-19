import VueHighcharts from 'vue-highcharts';
import tableStocksData from '../table-stocks-data/index.vue';
import chartYearDiff from '../chart-year-diff/index.vue';

export default {
    data() {
        return {
        }
    },
    methods: {
        // ------This metohd will add the symbols of the stocks that are being searched by the user
        // ------to the Yahoo stocks API and will send the result to the renderTable method
        createStocksSymbolsStr() {
            // Split to find the strings in the input
            let stocksArr = this.stocksInput.split(',');
            // Create string of symbols according to this template: ("","")
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
        callAPI() {
            let stocksSymbols = this.createStocksSymbolsStr();

            let yahooAPI = `http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20
            where%20symbol%20IN%20${stocksSymbols}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
            
            fetch(yahooAPI)
                    .then(res => res.json())
                    .then(res => {
                        this.checkResult(res);
                    }).catch((error)=>{
                        this.showData = false;
                        toastr.options.timeOut = 1200;
                        toastr.success('Stock symbol wasn\'t found, please try again');
                        console.log('error', error);
                    })
        },
        checkResult(res) {
            this.$store.state.stocks = [];
            // Check if we got more than one symbol and update the stocks variable
            let stocksResult = res.query.results.quote;

            if(stocksResult.length !== undefined) {
                for(var i = 0; i < stocksResult.length; i++) {
                    this.updateCurrStocks(stocksResult[i]);
                }
            } else {
                this.updateCurrStocks(stocksResult);
            }
        },
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
    }
}