var actionsMethods = {
    methods: {
        // slider constructor and actions 
        timeSlider: function () {
            // slider constructor
            self = this;
            self.appSlider = new Slider('#timeSlid', {
                tooltip: 'hide'
            });
            //action when slider slide
            self.appSlider.on("slide", function (sliderValue) {
                self.updateCanvas(sliderValue);
            });
        },
        
        // action when 'go' button is clicked
        getData: function () {
            this.$http.get('api/regul/getoneday/' + this.sYear + '/' + this.sMonth + '/' + this.sDay).then(response => {
                this.dataLines = response.body;
                this.appSlider.setValue(0);
                this.$http.get('api/regul/getdaystats/' + this.sYear + '/' + this.sMonth + '/' + this.sDay).then(response => {
                    this.dayStats = response.body;
                    //température min, max, moyennes des sondes
                    this.minMaison = this.dayStats.minMaison;
                    this.maxMaison = this.dayStats.maxMaison;
                    this.moyMaison = Math.round(this.dayStats.moyMaison * 10) / 10;
                    this.minVeranda = this.dayStats.minVeranda;
                    this.maxVeranda = this.dayStats.maxVeranda;
                    this.minCapteur = this.dayStats.minCapteur;
                    this.maxCapteur = this.dayStats.maxCapteur;
                }, response => {
                    alert('biiiiiiiiiiip! error !')
                });
                this.$http.get('api/meteo/getoneday/' + this.sYear + '/' + this.sMonth + '/' + this.sDay).then(response => {
                    this.dayMeteo = response.body;
                }, response => {
                    alert('biiiiiiiiiiip! error !')
                });
                this.$http.get('api/meteo/getdaystats/' + this.sYear + '/' + this.sMonth + '/' + this.sDay).then(response => {
                    this.dayMeteoStats = response.body;
                    this.minExt = Math.round(this.dayMeteoStats.minExt * 10) / 10;
                    this.maxExt = Math.round(this.dayMeteoStats.maxExt * 10) / 10;
                    this.moyExt = Math.round(this.dayMeteoStats.moyExt * 10) / 10;
                    this.moyDelta = Math.round((this.moyMaison - this.moyExt) * 10) / 10;
                    // when all datas are recieved : update template's values
                    this.updateCanvas(0);
                }, response => {
                    alert('biiiiiiiiiiip! error !')
                });

            }, response => {
                alert('biiiiiiiiiiip! error !')
            });
        },

        // action when 'tomorrow' button is clicked
        tomorrow: function (curYear, curMonth, curDay) {
            var currentDate = new Date(new Date(curYear, curMonth - 1, curDay).getTime() + 86400000);
            this.sDay = currentDate.getDate();
            this.sMonth = currentDate.getMonth() + 1;
            this.sYear = currentDate.getFullYear();
            this.getData();
        },

        // action when 'yesterday' button is clicked
        yesterday: function (curYear, curMonth, curDay) {
            var currentDate = new Date(new Date(curYear, curMonth - 1, curDay).getTime() - 86400000);
            this.sDay = currentDate.getDate();
            this.sMonth = currentDate.getMonth() + 1;
            this.sYear = currentDate.getFullYear();
            this.getData();
        }
    }
};