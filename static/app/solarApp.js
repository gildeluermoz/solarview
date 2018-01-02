window.onload=function(){

	var solarApp = new Vue({
	  	el: '#solar-app',
	  	data: {
	    	const:{
	    		//Température haute maison
				kAmbianceMax: 30,
				//Témpérature basse maison
				kAmbianceMin: 5,
				//Température haute solaire
				kSunMax: 95,
				//Témpérature basse solaire
				kSunMin: 0
	    	},
	    	
	    	//Selected date from form
			sYear : 2017,
			sMonth: 04,
			sDay  : 30,

	    	//SET INITIALES VALUES
			cTime : "00:00",
			kPanel : 0,//T1
			kBaloonDown : 20,//T2
			kBaloonUp : 20,//T3
			kAmbiance : 19,//T4
			kVeranda : 20,//T5
			kGlycolOut : 10,//T6
			kExt : 0, //température extérieure
			meteoTime : 0, //température extérieure
			pCurrent : 0, //puissance instantanée
			cadence:100,//vitesse de rafraichissement
			// productionKwh:0,
			// productionCorrKwh:0,
			qDay:0,
			qYear:0,
			pCurrent:0,
			showBallonOut:true,//pilote l'affichage de la circulation radiateur
			showSolarFlow:true,//pilote l'affichage de la circulation solaire
			
			appSlider:{},
			
			dataLines:[],//prepared datas from databases
			dayStats:[],//prepared day statistics from databases
			dayMeteo:[],//prepared day meteo values from databases
			dayMeteoStats:[],//prepared meteo stats for the day from databases

			minMaison:0,
			maxMaison:0,
			moyMaison:0,
			minVeranda:0,
			maxVeranda:0,
			minCapteur:0,
			maxCapteur:0,
			minExt:0,
			maxExt:0,
			moyExt:0,
			minDelta:0,
			maxDelta:0,
			moyDelta:0,
			currentDelta:0,

			//CSV column index config
			sourceindex:{
	    		dateTime:1,
	    		t1:2,
	    		t2:3,
	    		t3:4,
	    		t4:5,
				t5:6,
				t6:7,
				pcurrent:10,
				qday:11,
				qyear:12,
				r2:15,
				r3:16,
				h1:17
	    	},

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
		    dayOptions : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],

			firstTimeIndex : 1,
			lastTimeIndex : 1440,
			currentTimeIndex : 0
		},
		mixins: [drawFunctions],
	  	methods:{
			tomorrow: function (curYear, curMonth, curDay) {
				var currentDate = new Date(new Date(curYear, curMonth - 1, curDay).getTime() + 86400000);
				this.sDay = currentDate.getDate();
				this.sMonth = currentDate.getMonth() + 1;
				this.sYear = currentDate.getFullYear();
				this.getData();
			},
			yesterday: function (curYear, curMonth, curDay) {
				var currentDate = new Date(new Date(curYear, curMonth - 1, curDay).getTime() - 86400000);
				this.sDay = currentDate.getDate();
				this.sMonth = currentDate.getMonth() + 1;
				this.sYear = currentDate.getFullYear();
				this.getData();
			},
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
			},
			getData: function(){
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
						this.updateCanvas(0);
					}, response => {
						alert('biiiiiiiiiiip! error !')
					});
						
				}, response => {
					alert('biiiiiiiiiiip! error !')
				});
			},
			
	  		timeSlider: function(){ 
		    	self = this;
				self.appSlider = new Slider('#timeSlid', {
					tooltip:'hide'
				});
				self.appSlider.on("slide", function(sliderValue) {
					self.updateCanvas(sliderValue);
				});
			},

		    updateCanvas: function(index) {		    	         	
		      	if(this.dataLines.length>0){
					var line = this.dataLines[index];
					var meteo = this.dayMeteo;
					//température des sondes
					this.sYear = line.cyear;
	              	this.sMonth = line.cmonth;
	              	this.sDay = line.cday;
	              	this.cTime = line.ctime;
	              	this.kPanel = line.t1;
	              	this.kBaloonDown = line.t2;
	              	this.kBaloonUp = line.t3;
	              	this.kAmbiance = line.t4;
	              	this.kVeranda = line.t5;
					this.kGlycolOut = line.t6;
					this.pCurrent = line.pcurrent;//puissance instantanée
					this.qDay = line.qday;//Cumul production
					this.qYear = line.qyear;//Cumul production
					this.solarPump = line.h1;//pompe solaire
					this.hydroPump = line.r2;//circulateur radiateurs
					this.vmc = line.r3;//circulateur radiateurs
					for (let m of meteo) {
						if (m.ctime >= (parseInt(line.ctime.slice(0,2))-2)){
							this.kExt = Math.round(m.t * 10)/10;
							this.meteoTime = m.ctime;
							break;
						}
					}
					this.currentDelta = Math.round((this.kAmbiance - this.kExt) * 10) / 10;
	              	// this.productionKwh = line.prod;
					// this.productionCorrKwh = line.prodCorr;
	              	this.drawBallon(this.kBaloonDown,this.kBaloonUp);
	              	this.drawBallonOut(this.kBaloonUp);
					this.drawCapteur(this.kPanel);
					this.drawVeranda(this.kVeranda);
					this.drawVmc(this.kVeranda);
					this.drawMaison(this.kAmbiance);
					this.drawSolarOut(this.kPanel);	
					this.drawSolarIn(this.kGlycolOut);
					
	            }
		    },

			// calculateKwh: function() {		         	
		    //   	if(this.dataLines.length>0){
		    //   		this.productionKwh = 0;
		    //   		this.productionCorrKwh = 0;
		    //   		var prod = 0;
		    //   		var prodCorr = 0;
		    //   		var kBallonDiff = 0;
		    //   		//température initial du ballon
		    //   		var kBallonInitial = (parseInt(this.dataLines[1].t2)+parseInt(this.dataLines[1].t3))/2;
			//         for (var i=1; i<this.dataLines.length; i++) {
			//         	//température moyenne actuelle du ballon
			//         	var kBallonCurrent = (parseInt(this.dataLines[i].t2)+parseInt(this.dataLines[i].t3))/2;
			//         	//température moyenne du ballon à la mesure précédente
			//         	var kBallonPrev = (parseInt(this.dataLines[i-1].t2)+parseInt(this.dataLines[i-1].t3))/2;
			//         	if(kBallonCurrent > kBallonPrev){
			//         		kBallonDiff = kBallonCurrent - kBallonPrev;
			//         		prod += 1.163*0.5*kBallonDiff;
			//         	}
			//         	if(kBallonCurrent > kBallonInitial){
			//         		prodCorr = 1.163*0.5*(kBallonCurrent - kBallonInitial);
			//         	}
			//         	this.dataLines[i]["prod"] =  Math.round(prod*100)/100;
			// 			this.dataLines[i]["prodCorr"]  =  Math.round(prodCorr*100)/100;
			//         }		        
	        //     }
		    // },

			init: function(){
				this.drawBallon(this.kBaloonDown,this.kBaloonUp);
				this.drawBallonOut(this.kBaloonUp);
				this.drawCapteur(this.kPanel);
				this.drawVeranda(this.kVeranda);
				this.drawVmc(this.kVeranda);
				this.drawMaison(this.kAmbiance);
				this.drawSolarOut(this.kPanel);
				this.drawSolarIn(this.kGlycolOut);
				this.timeSlider();
				this.getData();
				this.getMonthsList();
				this.getYearsList();
			}
	  	}
	});
	solarApp.init();
}