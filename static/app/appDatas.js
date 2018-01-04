var appDatas = {    
    data: {
        //constantes
        const: {
            //Température haute de la maison
            kAmbianceMax: 30,
            //Température basse de la maison
            kAmbianceMin: 5,
            //Température haute du capteur solaire
            kSunMax: 95,
            //Température basse du capteur solaire
            kSunMin: 0,
            //Température haute de l'eau du circuit radiateur et ballon tampon
            kBaloonMax: 60,
            //Température basse de l'eau du circuit radiateur et ballon tampon
            kBaloonMin: 5
        },

        lambda:{
            roof: 8,
            northWall: 59,
            eastWall: 39,
            westUpWall: 10,
            westDownWall: 7,
            southDownWall: 15,
            southUpWall: 19,
            flor: 16,
            windows: 40,
            airRenew: 20
        },

        //SET INITIALES VALUES
        kPanel: 0,//T1
        kBaloonDown: 0,//T2
        kBaloonUp: 0,//T3
        kAmbiance: 0,//T4
        kVeranda: 0,//T5
        kGlycolOut: 0,//T6
        kCellar: 5, //température de la cave
        kExt: 0, //température extérieure
        meteoTime: 0, //heure de la données météo
        pCurrent: 0, //puissance instantanée
        qDay: 0, //production du jour
        qYear: 0, // production totale
        currentDelta: 0, // delta between interior and exterieur in kelvin (= celcius)
        // initiales statistics values
        minMaison: 0,
        maxMaison: 0,
        moyMaison: 0,
        minVeranda: 0,
        maxVeranda: 0,
        minCapteur: 0,
        maxCapteur: 0,
        minExt: 0,
        maxExt: 0,
        moyExt: 0,
        minDelta: 0,
        maxDelta: 0,
        moyDelta: 0,
        
        currentHeatLoss:0,

        showBallonOut: true, //pilote l'affichage de la circulation radiateur
        showSolarFlow: true, //pilote l'affichage de la circulation solaire

        //CSV column index config
        sourceindex: {
            dateTime: 1,
            t1: 2,
            t2: 3,
            t3: 4,
            t4: 5,
            t5: 6,
            t6: 7,
            pcurrent: 10,
            qday: 11,
            qyear: 12,
            r2: 15,
            r3: 16,
            h1: 17
        },

        // Arrays to store databases values
        dataLines: [],//prepared regulation datas from databases
        dayStats: [],//prepared day statistics from databases
        dayMeteo: [],//prepared day meteo values from databases
        dayMeteoStats: [],//prepared meteo stats for the day from databases

        // calendar values
        yearOptions: [],
        monthOptions: [
            { text: 'janvier', value: 1 },
            { text: 'février', value: 2 },
            { text: 'mars', value: 3 },
            { text: 'avril', value: 4 },
            { text: 'mai', value: 5 },
            { text: 'juin', value: 6 },
            { text: 'juillet', value: 7 },
            { text: 'août', value: 8 },
            { text: 'septembre', value: 9 },
            { text: 'octobre', value: 10 },
            { text: 'novembre', value: 11 },
            { text: 'décembre', value: 12 }
        ],
        dayOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        //Initiale selected date in form
        sYear: 2017,
        sMonth: 10,
        sDay: 30,
        cTime: "00:00",

        //Slider object
        appSlider: {},

        // slider index values
        firstTimeIndex: 1,
        lastTimeIndex: 1440,
        currentTimeIndex: 0 
    },

    methods: {
        getYearsList: function () {
            this.$http.get('api/regul/getyears/').then(response => {
                this.yearOptions = response.body;
            }, response => {
                alert('biiiiiiiiiiip! error !')
            });
        },

        getMonthsList: function () {
            this.$http.get('api/regul/getmonths/').then(response => {
                monthsList = response.body;
                for (let m of this.monthOptions) {
                    if (!monthsList.includes(m.value)) {
                        this.monthOptions.splice(this.monthOptions.indexOf(m), 1);
                    }
                }
            }, response => {
                alert('biiiiiiiiiiip! error !')
            });
        }
    }
};