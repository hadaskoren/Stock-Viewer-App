'use strict';

export default {
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
        }
    },
    watch: {
        stocks() {
            if(this.stocks) {
                this.showData = true;
            }
        }
    }
}