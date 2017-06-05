window.onload=function(){

	var solarApp = new Vue({
	  	el: '#solar-app',
	  	data: {
	    	const:{
	    		//Température haute maison
				kAmbianceMax: 28,
				//Témpérature basse maison
				kAmbianceMin: 7,
				//Température haute solaire
				kSunMax: 110,
				//Témpérature basse solaire
				kSunMin: -10
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
			cadence:100,//vitesse de rafraichissement
			productionKwh:0,
			productionCorrKwh:0,
			
			//csv:null,//CSV source file
			

			dataLines:[],//prepared datas from databases

			//CSV column index config
			sourceindex:{
	    		dateTime:1,
	    		t1:2,
	    		t2:3,
	    		t3:4,
	    		t4:5,
	    		t5:6
	    	},

	    	monthOptions: [
		      { text: 'janvier', value: 01 },
		      { text: 'février', value: 02 },
		      { text: 'mars', value: 03 },
		      { text: 'avril', value: 04 },
		      { text: 'mai', value: 05 },
		      { text: 'juin', value: 06 },
		      { text: 'juillet', value: 07 },
		      { text: 'août', value: 08 },
		      { text: 'septembre', value: 09 },
		      { text: 'octobre', value: 10 },
		      { text: 'novembre', value: 11 },
		      { text: 'décembre', value: 12 }
		    ],
		    dayOptions : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],

			firstTimeIndex : 1,
			lastTimeIndex : 1440,
			currentTimeIndex : 0
		},
	  	methods:{
	  		getData: function(){
	  			this.$http.get('/api/regul/getoneday/'+this.sYear+'/'+this.sMonth+'/'+this.sDay).then(response => {
			    	this.dataLines = response.body;
			    	this.calculateKwh();
			    	this.updateCanvas(0);
			  	}, response => {
			    	alert('biiiiiiiiiiip! error !')
			  	});
	  		},
	  		drawBallon: function(cold, hot){
				var c = document.getElementById("ballonCanvas");
				var ctx = c.getContext("2d");
				// Calculate color
				var r = 255/(this.const.kSunMax-this.const.kSunMin)*(cold-this.const.kSunMin)
				var b = 255-r;
				colorCold = "rgba("+r+",0,"+b+",1)";
				r = 255/(this.const.kSunMax-this.const.kSunMin)*(hot-this.const.kSunMin)
				b = 255-r;
				colorHot = "rgba("+r+",0,"+b+",1)";
				// Create gradient
				var grd = ctx.createLinearGradient(0,0,0,100);
				grd.addColorStop(0,colorHot);
				grd.addColorStop(1,colorCold);
				// Fill with gradient
				ctx.fillStyle = grd;
				ctx.fillRect(10,10,50,100);
			},

			drawCapteur: function(t){
				// Calculate color
				var r = 255/(this.const.kSunMax-this.const.kSunMin)*(t-this.const.kSunMin)
				var b = 255-r;
				var color = "rgba("+r+",0,"+b+",1)";
				var c = document.getElementById("capteurCanvas");
				var ctx = c.getContext("2d");
				ctx.strokeStyle = color;
			    ctx.lineWidth=10;
				ctx.moveTo(0,0);
				ctx.lineTo(75,150);
				ctx.stroke();
			},

			drawMaison: function(t){
				// Calculate color
				var r = 255/(this.const.kAmbianceMax-this.const.kAmbianceMin)*(t-this.const.kAmbianceMin)
				var b = 255-r;
				var color = "rgba("+r+",0,"+b+",1)";
				//draw canvas
				var c = document.getElementById("maisonCanvas");
				var ctx = c.getContext("2d");
				ctx.fillStyle = color;
				ctx.fillRect(0,0,300,450);
			},

			drawVeranda: function(t){
				// Calculate color
				var r = 255/(this.const.kAmbianceMax-this.const.kAmbianceMin)*(t-this.const.kAmbianceMin)
				var b = 255-r;
				color = "rgba("+r+",0,"+b+",1)";
				//draw canvas
				var c = document.getElementById("verandaCanvas");
				var ctx = c.getContext("2d");
				ctx.fillStyle = color;
				ctx.fillRect(0,0,150,180);
			},

			timeSlider: function(){ 
		    	self = this;
				var slid = new Slider('#timeSlid', {
					tooltip:'hide'
				});
				slid.on("slide", function(sliderValue) {
					self.updateCanvas(sliderValue);
					// self.calculateKwh(sliderValue);
				});
			},

		    updateCanvas: function(index) {		    	         	
		      	if(this.dataLines.length>0){
		      		var line = this.dataLines[index];
	              	this.sYear= line.cyear;
	              	this.sMonth= line.cmonth;
	              	this.sDay= line.cday;
	              	this.cTime= line.ctime;
	              	this.kPanel= line.t1;
	              	this.kBaloonDown= line.t2;
	              	this.kBaloonUp= line.t3;
	              	this.kAmbiance= line.t4;
	              	this.kVeranda= line.t5;
	              	this.productionKwh = line.prod;
	              	this.productionCorrKwh = line.prodCorr;
	              	this.drawBallon(this.kBaloonDown,this.kBaloonUp);
					this.drawCapteur(this.kPanel);
					this.drawVeranda(this.kVeranda);
					this.drawMaison(this.kAmbiance);
	            }
		    },

			calculateKwh: function() {		         	
		      	if(this.dataLines.length>0){
		      		this.productionKwh = 0;
		      		this.productionCorrKwh = 0;
		      		var prod = 0;
		      		var prodCorr = 0;
		      		var kBallonDiff = 0;
		      		//température initial du ballon
		      		var kBallonInitial = (parseInt(this.dataLines[1].t2)+parseInt(this.dataLines[1].t3))/2;
			        for (var i=1; i<this.dataLines.length; i++) {
			        	//température moyenne actuelle du ballon
			        	var kBallonCurrent = (parseInt(this.dataLines[i].t2)+parseInt(this.dataLines[i].t3))/2;
			        	//température moyenne du ballon à la mesure précédente
			        	var kBallonPrev = (parseInt(this.dataLines[i-1].t2)+parseInt(this.dataLines[i-1].t3))/2;
			        	if(kBallonCurrent > kBallonPrev){
			        		kBallonDiff = kBallonCurrent - kBallonPrev;
			        		prod += 1.163*0.5*kBallonDiff;
			        	}
			        	if(kBallonCurrent > kBallonInitial){
			        		prodCorr = 1.163*0.5*(kBallonCurrent - kBallonInitial);
			        	}
			        	this.dataLines[i]["prod"] =  Math.round(prod*100)/100;
						this.dataLines[i]["prodCorr"]  =  Math.round(prodCorr*100)/100;
			        }		        
	            }
		    },

			init: function(){
				this.drawBallon(this.kBaloonDown,this.kBaloonUp);
				this.drawCapteur(this.kPanel);
				this.drawVeranda(this.kVeranda);
				this.drawMaison(this.kAmbiance);
				// this.speedSlider();
				this.timeSlider();
				this.getData();
			}
	  	}
	});
	solarApp.init();
}