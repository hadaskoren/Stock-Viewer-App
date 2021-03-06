'use strict';

export default {
    data() {
        return {
            currStocksDiffInfo: [],
            options: {
                title: {
                    text: 'Difference in Percentage of YearLow and YearHigh'
                },
                chart: {
                    type: 'column',
                },
                xAxis: {
                    categories: ['yearHighDiff', 'yearLowDiff']
                },
                yAxis: {
                    title: {
                        text: 'Values'
                    }
                },
                series: [{
            		name: 'FB',
            		data: [-20, 45]},
        			{
            		name: 'MSFT',
            		data: [45, 65]}],
            }
        }
    },
    computed: {
        stocks() {
            return this.$store.state.stocks;
        },
        showData: {
            get() {
                return this.$store.state.showData;
            }
        }
    },
    watch: {
        showData() {
            if (this.showData === true) {
                this.showChart();
            }
        },
        stocks() {
            this.showChart();
        }
    },
    methods: {
        /*
         *
         * This metohd is going over the stocks and updates the 'currStocksDiffInfo' array
         * with objects that each one contain name,yearLowDiff, yearHighDiff 
         * 
         * */
        updateCurrStocksDiffArr() {
            this.currStocksDiffInfo = [];
            for (let i = 0; i < this.stocks.length && i < 6; i++) {
                this.currStocksDiffInfo.push ({
                    name: this.stocks[i].name,
                    yearLowDiff: (this.stocks[i].previousClose - this.stocks[i].yearLow) * 100 / this.stocks[i].yearLow,
                    yearHighDiff: (this.stocks[i].previousClose - this.stocks[i].yearHigh) * 100 / this.stocks[i].yearHigh
                });
            }
        },
        /*
         *
         * This metohd is going over the 'currStocksDiffInfo' array we updated in the previous method and 
         * updates the 'options->series' property with the relevant names and data of stocks to be shown
         * 
         * */
        showChart() {
            this.updateCurrStocksDiffArr();
            this.options.series = [];
            for (let i = 0; i < this.currStocksDiffInfo.length; i++) {
                this.options.series.push({
                    name: this.currStocksDiffInfo[i].name,
                    data: [this.currStocksDiffInfo[i].yearLowDiff,this.currStocksDiffInfo[i].yearHighDiff]
                })
            }
        }
    }
}