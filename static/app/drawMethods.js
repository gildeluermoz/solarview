var drawFunctions = {
    methods: {
        drawBallon: function(cold, hot) {
            var ba = document.getElementById("ballonCanvas");
            var ctx = ba.getContext("2d");
            // Calculate color
            var r = Math.round(255 / (this.const.kSunMax - this.const.kSunMin) * (cold - this.const.kSunMin));
            var b = 255 - r;
            colorCold = "rgba(" + r + ",0," + b + ",1)";
            r = Math.round(255 / (this.const.kSunMax - this.const.kSunMin) * (hot - this.const.kSunMin));
            b = 255 - r;
            colorHot = "rgba(" + r + ",0," + b + ",1)";
            // Create gradient
            var grd = ctx.createLinearGradient(0, 0, 0, 100);
            grd.addColorStop(0, colorHot);
            grd.addColorStop(1, colorCold);
            // Fill with gradient
            ctx.fillStyle = grd;
            ctx.fillRect(10, 10, 50, 100);
        },

        drawBallonOut: function (t) {
            var bao = document.getElementById("ballonOutCanvas");
            if (this.hydroPump > 0) { bao.style.display = 'block'; }
            else { bao.style.display = 'none'; }
            // Calculate color
            r = Math.round(255 / (this.const.kSunMax - this.const.kSunMin) * (t - this.const.kSunMin));
            b = 255 - r;
            var color = "rgba(" + r + ",0," + b + ",1)";
            var ctx = bao.getContext("2d");
            ctx.strokeStyle = color;
            ctx.lineWidth = 15;
            ctx.moveTo(0, 0);
            ctx.lineTo(0, 100);
            ctx.stroke();
        },

        drawCapteur: function(t) {
            // Calculate color
            var r = Math.round(255 / (this.const.kSunMax - this.const.kSunMin) * (t - this.const.kSunMin));
            var b = 255 - r;
            var color = "rgba(" + r + ",0," + b + ",1)";
            var panel = document.getElementById("capteurCanvas");
            var ctx = panel.getContext("2d");
            ctx.strokeStyle = color;
            ctx.lineWidth = 10;
            ctx.moveTo(0, 0);
            ctx.lineTo(75, 150);
            ctx.stroke();
        },

        drawMaison: function(t) {
            // Calculate color
            var r = Math.round(255 / (this.const.kAmbianceMax - this.const.kAmbianceMin) * (t - this.const.kAmbianceMin));
            var b = 255 - r;
            var color = "rgba(" + r + ",0," + b + ",1)";
            //draw canvas
            var m = document.getElementById("maisonCanvas");
            var ctx = m.getContext("2d");
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 300, 450);
        },

        drawVeranda: function(t) {
            // Calculate color
            var r = Math.round(255 / (this.const.kAmbianceMax - this.const.kAmbianceMin) * (t - this.const.kAmbianceMin));
            var b = 255 - r;
            color = "rgba(" + r + ",0," + b + ",1)";
            //draw canvas
            var v = document.getElementById("verandaCanvas");
            var ctx = v.getContext("2d");
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 150, 180);
        },

        drawVmc: function (t) {
            var vm = document.getElementById("vmcCanvas");
            if (this.vmc > 0) { vm.style.display = 'block'; }
            else { vm.style.display = 'none'; }
            // Calculate color
            var r = Math.round(255 / (this.const.kAmbianceMax - this.const.kAmbianceMin) * (t - this.const.kAmbianceMin));
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
                so.style.display = 'none';
                pc.style.display = 'none';
                s.style.display = 'none';
            }
            // Calculate color
            var r = Math.round(255 / (this.const.kSunMax - this.const.kSunMin) * (t - this.const.kSunMin));
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
            if (this.solarPump > 0) { si.style.display = 'block'; }
            else { si.style.display = 'none'; }
            // Calculate color
            var r = Math.round(255 / (this.const.kSunMax - this.const.kSunMin) * (t - this.const.kSunMin));
            var b = 255 - r;
            var color = "rgba(" + r + ",0," + b + ",1)";
            var ctx = si.getContext("2d");
            ctx.strokeStyle = color;
            ctx.lineWidth = 6;
            ctx.moveTo(0, 0);
            ctx.lineTo(270, 0);
            ctx.stroke();
        }
    }
};