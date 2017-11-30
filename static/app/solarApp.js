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
			pCurrent : 0, //puissance instantanée
			cadence:100,//vitesse de rafraichissement
			// productionKwh:0,
			// productionCorrKwh:0,
			qDay:0,
			qYear:0,
			pCurrent:0,
			showBallonOut:true,//pilote l'affichage de la circulation radiateur
			showSolarFlow:true,//pilote l'affichage de la circulation solaire
			
			//csv:null,//CSV source file
			

			dataLines:[],//prepared datas from databases

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
			    	// this.calculateKwh();
			    	this.updateCanvas(0);
			  	}, response => {
			    	alert('biiiiiiiiiiip! error !')
			  	});
	  		},
	  		drawBallon: function(cold, hot){
				var ba = document.getElementById("ballonCanvas");
				var ctx = ba.getContext("2d");
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

			drawBallonOut: function (t) {
				var bao = document.getElementById("ballonOutCanvas");
				if (this.hydroPump > 0) { bao.style.display = 'block'; }
				else { bao.style.display = 'none'; }
				// Calculate color
				r = 255 / (this.const.kSunMax - this.const.kSunMin) * (t - this.const.kSunMin)
				b = 255 - r;
				var color = "rgba(" + r + ",0," + b + ",1)";
				var ctx = bao.getContext("2d");
				ctx.strokeStyle = color;
				ctx.lineWidth = 15;
				ctx.moveTo(0, 0);
				ctx.lineTo(0, 100);
				ctx.stroke();
			},

			drawCapteur: function(t){
				// Calculate color
				var r = 255/(this.const.kSunMax-this.const.kSunMin)*(t-this.const.kSunMin)
				var b = 255-r;
				var color = "rgba("+r+",0,"+b+",1)";
				var panel = document.getElementById("capteurCanvas");
				var ctx = panel.getContext("2d");
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
				var m = document.getElementById("maisonCanvas");
				var ctx = m.getContext("2d");
				ctx.fillStyle = color;
				ctx.fillRect(0,0,300,450);
			},

			drawVeranda: function(t){
				// Calculate color
				var r = 255/(this.const.kAmbianceMax-this.const.kAmbianceMin)*(t-this.const.kAmbianceMin)
				var b = 255-r;
				color = "rgba("+r+",0,"+b+",1)";
				//draw canvas
				var v = document.getElementById("verandaCanvas");
				var ctx = v.getContext("2d");
				ctx.fillStyle = color;
				ctx.fillRect(0,0,150,180);
			},

			drawVmc: function (t) {
				var vm = document.getElementById("vmcCanvas");
				if (this.vmc > 0) { vm.style.display = 'block';}
				else { vm.style.display = 'none' ;}
				// Calculate color
				var r = 255 / (this.const.kAmbianceMax - this.const.kAmbianceMin) * (t - this.const.kAmbianceMin)
				var b = 255 - r;
				var color = "rgba(" + r + ",0," + b + ",1)";
				var ctx = vm.getContext("2d");
				ctx.strokeStyle = color;
				ctx.lineWidth = 15;
				ctx.moveTo(0, 0);
				ctx.lineTo(50, 0);
				ctx.stroke();
			},

			drawSolarOut: function (t) {
				var so = document.getElementById("solarOutCanvas");
				var pc = document.getElementById("pCurrent");
				var s = document.getElementById("T6");
				if (this.solarPump > 0) { 
					so.style.display = 'block';
					pc.style.display = 'block';
					s.style.display = 'block';
				}
				else { 
					so.style.display = 'none' ;
					pc.style.display = 'none' ;
					s.style.display = 'none' ;
				}
				// Calculate color
				var r = 255 / (this.const.kSunMax - this.const.kSunMin) * (t - this.const.kSunMin)
				var b = 255 - r;
				var color = "rgba(" + r + ",0," + b + ",1)";
				var ctx = so.getContext("2d");
				ctx.strokeStyle = color;
				ctx.lineWidth = 6;
				ctx.moveTo(0, 0);
				ctx.lineTo(205, 0);
				ctx.stroke();
			},
			
			drawSolarIn: function (t) {
				var si = document.getElementById("solarInCanvas");
				if (this.solarPump > 0) { si.style.display = 'block';}
				else { si.style.display = 'none';}
				// Calculate color
				var r = 255 / (this.const.kSunMax - this.const.kSunMin) * (t - this.const.kSunMin)
				var b = 255 - r;
				var color = "rgba(" + r + ",0," + b + ",1)";
				var ctx = si.getContext("2d");
				ctx.strokeStyle = color;
				ctx.lineWidth = 6;
				ctx.moveTo(0, 0);
				ctx.lineTo(270, 0);
				ctx.stroke();
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
				// this.speedSlider();
				this.timeSlider();
				this.getData();
			}
	  	}
	});
	solarApp.init();
}