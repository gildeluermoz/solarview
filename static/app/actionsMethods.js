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

        // action on tomorrow button click
        tomorrow: function (curYear, curMonth, curDay) {
            var currentDate = new Date(new Date(curYear, curMonth - 1, curDay).getTime() + 86400000);
            this.sDay = currentDate.getDate();
            this.sMonth = currentDate.getMonth() + 1;
            this.sYear = currentDate.getFullYear();
            this.getData();
        },

        // action on yesterday button click
        yesterday: function (curYear, curMonth, curDay) {
            var currentDate = new Date(new Date(curYear, curMonth - 1, curDay).getTime() - 86400000);
            this.sDay = currentDate.getDate();
            this.sMonth = currentDate.getMonth() + 1;
            this.sYear = currentDate.getFullYear();
            this.getData();
        }
    }
};