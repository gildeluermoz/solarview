window.onload=function(){

	var solarApp = new Vue({
	  	el: '#solar-app',
		mixins: [appDatas, calculateMethods, drawFunctions, actionsMethods],
	  	methods:{
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