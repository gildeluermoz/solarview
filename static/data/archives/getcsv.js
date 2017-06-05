 function handleFiles(files) {
      // Check for the various File API support.
      if (window.FileReader) {
          // FileReader are supported.
          getAsText(files[0]);
      } else {
          alert('FileReader are not supported in this browser.');
      }
    }

    function getAsText(fileToRead) {
      var reader = new FileReader();
      // Read file into memory as UTF-8      
      reader.readAsText(fileToRead);
      // Handle errors load
      reader.onload = loadHandler;
      reader.onerror = errorHandler;
    }

    function loadHandler(event) {
      var csv = event.target.result;
      processData(csv);
    }
    var datas;
    function processData(csv) {
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
      console.log(lines);
      datas = lines;
      if(datas){
        for (var i=0; i<datas.length; i++) {
                    
          setTimeout(function(x){
            return function(){
              console.log(x);
              kPanel= datas[x][0];
              kbaloonDown= datas[x][1];
              kbaloonUp= datas[x][2];
              kAmbiance= datas[x][3];
              kVeranda= datas[x][4];
              theTime= datas[x][5];
              init();
            };
          }(i),2000*i);
        }
      }
    }

    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") {
          alert("Canno't read file !");
      }
    }