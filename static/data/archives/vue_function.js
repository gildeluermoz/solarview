		    speedSlider: function(){ 
		    	self = this;
				var slid = new Slider('#speedSlid', {
					formatter: function(value) {
						return value + ' ms= 1 minute';
					}
				});
				slid.on("slide", function(sliderValue) {
					self.cadence = sliderValue;
					console.log('cadence :'+self.cadence+ ' - slidervalue : '+sliderValue)
				});
			},

			updateCanvas: function(index) {		         	
		      	if(this.dataLines.length>0){
	              	this.dateTime= this.dataLines[index][this.sourceindex.dateTime];
	              	this.kPanel= this.dataLines[index][this.sourceindex.t1];
	              	this.kBaloonDown= this.dataLines[index][this.sourceindex.t2];
	              	this.kBaloonUp= this.dataLines[index][this.sourceindex.t3];
	              	this.kAmbiance= this.dataLines[index][this.sourceindex.t4];
	              	this.kVeranda= this.dataLines[index][this.sourceindex.t5];
	              	this.drawBallon(this.kBaloonDown,this.kBaloonUp);
					this.drawCapteur(this.kPanel);
					this.drawVeranda(this.kVeranda);
					this.drawMaison(this.kAmbiance);
	            }
		    },

		    handleFiles: function() {
				myFiles = document.getElementById("csvFileInput").files;
				// Check for the various File API support.
		      	if (window.FileReader) {
		          	// FileReader are supported.
		          	this.getAsText(myFiles[0]);
		      	} else {
		          	alert('FileReader are not supported in this browser.');
		      	}
		    },

		    getAsText: function(fileToRead) {
		      var reader = new FileReader();
		      // Read file into memory as UTF-8      
		      reader.readAsText(fileToRead);
		      // Handle errors load
		      reader.onload = this.loadHandler;
		      reader.onerror = this.errorHandler;
		    },

		    loadHandler: function(event) {
		      csv = event.target.result;
		      var allTextLines = csv.split(/\r\n|\n/);
		        var lines = [];
		        for (var i=0; i<allTextLines.length; i++) {
		            var data = allTextLines[i].split(';');
		                var tarr = [];
		                for (var j=0; j<data.length; j++) {
		                    tarr.push(data[j]);
		                }
		                lines.push(tarr);
		        }
	        	this.dataLines = lines;
	        	this.lastTimeIndex = lines.length-1;
	        	this.updateCanvas(1);
		      	// this.processData(lines);
		    },
		    
		    processData: function(lines) {		        
		      	if(lines){
			        for (var i=0; i<lines.length; i++) {   
			          	setTimeout(function(x){
				            return function(){
				              	this.kPanel= lines[x][this.sourceindex.t1];
				              	this.kBaloonDown= lines[x][this.sourceindex.t2];
				              	this.kBaloonUp= lines[x][this.sourceindex.t3];
				              	this.kAmbiance= lines[x][this.sourceindex.t4];
				              	this.kVeranda= lines[x][this.sourceindex.t5];
				              	this.dateTime= lines[x][this.sourceindex.dateTime];
				              	this.drawBallon(this.kBaloonDown,this.kBaloonUp);
								this.drawCapteur(this.kPanel);
								this.drawVeranda(this.kVeranda);
								this.drawMaison(this.kAmbiance);
				            }
			          	}(i).bind(this),this.cadence*i);
			        }
		      	}
		    },

		    errorHandler: function(evt) {
		      if(evt.target.error.name == "NotReadableError") {
		          alert("Canno't read file !");
		      }
		    },

var myDate=new Date(year,month,date,0,0,0).getTime();
var day_milli= 1000*60*60*24;
var newDate=new Date(myDate + day_milli * (duration -1));
alert(newDate);