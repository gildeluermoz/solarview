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
            return Math.round((heatLoss * 1.03 / 1000) * 100) / 100;
        },
        getCurrentHeatNeeded: function (kInside, kVeranda, kOutside) {
            let heatLoss = 0;
            if (kInside < this.kAmbianceNeeded){
                let deltaHomeOutside = this.kAmbianceNeeded - kOutside;
                let deltaHomeVeranda = this.kAmbianceNeeded - kVeranda;
                heatLoss = (
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
            }
            return Math.round((heatLoss * 1.03 / 1000) * 100) / 100;
        },
        getQDayNeeded: function () {
            let qNeeded = 0;
            if (this.dataLines.length > 0) {
                var meteo = this.dayMeteo;
                var heatLoss = 0;
                var kOutside = 0;
                for(line of this.dataLines){
                    //récupération de la température extérieure 'kOutside' pour l'heure courante
                    for (let m of meteo) {
                        if (m.ctime >= (parseInt(line.ctime.slice(0, 2)) - 2)) {
                            kOutside = Math.round(m.t * 10) / 10;
                            break;
                        }
                    }
                    //calcul des pertes pour la minute courante
                    let deltaHomeOutside = this.kAmbianceNeeded - kOutside;
                    let deltaHomeVeranda = this.kAmbianceNeeded - line.t5;
                    heatLoss = (
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
                    qNeeded += heatLoss;
                }
            }
            return Math.round(((qNeeded * 1.03 / 1000) / 60) * 100) / 100;
        },
        getQDayApoint: function () {
            let qNeeded = 0;
            if (this.dataLines.length > 0) {
                var meteo = this.dayMeteo;
                var heatLoss = 0;
                var kOutside = 0;
                for (line of this.dataLines) {
                    //récupération de la température extérieure 'kOutside' pour l'heure courante
                    for (let m of meteo) {
                        if (m.ctime >= (parseInt(line.ctime.slice(0, 2)) - 2)) {
                            kOutside = Math.round(m.t * 10) / 10;
                            break;
                        }
                    }
                    //calcul des pertes pour la minute courante
                    if (line.t4 < this.kAmbianceNeeded){
                        let deltaHomeOutside = this.kAmbianceNeeded - line.t4;
                        heatLoss = (
                            (
                                this.lambda.roof
                                + this.lambda.northWall
                                + this.lambda.eastWall
                                + this.lambda.westUpWall
                                + this.lambda.westDownWall
                                + this.lambda.southUpWall
                                + this.lambda.windows
                                + this.lambda.airRenew
                                + this.lambda.flor
                                + this.lambda.southDownWall
                            ) * deltaHomeOutside);
                        qNeeded += heatLoss;
                    }
                }
            }
            return Math.round(((qNeeded * 1.03 / 1000) / 60) * 100) / 100;
        }
    }
};