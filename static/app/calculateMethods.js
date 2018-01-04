var calculateMethods = {
    methods: {
        getCurrentHeatLoss: function(kInside,kVeranda,kOutside){
            let deltaHomeOutside = kInside - kOutside;
            let deltaHomeVeranda = kInside - kVeranda;
            let heatLoss = (
                (
                    this.lambda.roof
                    + this.lambda.northWall
                    + this.lambda.eastWall
                    + this.lambda.westUpWall
                    + this.lambda.westDownWall
                    + this.lambda.southUpWall
                    + this.lambda.windows
                    + this.lambda.airRenew
                ) * deltaHomeOutside)
            + ((this.lambda.flor) * this.kCellar)
            + ((this.lambda.southDownWall) * deltaHomeVeranda);
            return Math.round((heatLoss / 1000) * 100) / 100;
        }
    }
};