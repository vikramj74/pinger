'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PingController = function () {
    _createClass(PingController, [{
        key: 'logState',
        value: function logState() {
            console.log('Current pinger ID : ' + this.currentPinger + '\nPing count : ' + this.pingCount + '\nIs recurring : ' + this.isCurrentPingerRecurring + '\nIs pinging : ' + this.isPinging);
        }
    }, {
        key: 'onAlarmFired',
        value: function onAlarmFired(message) {
            this.beep();
            this.pingCount++;
            this.lastPingedAt = new Date(Date.now()).toString();
            this.syncView();
            alert('Ping : ' + message);
            if (!this.isCurrentPingerRecurring) {
                this.clearCurrentPinger();
            }
            this.logState();
        }
    }, {
        key: 'clearCurrentPinger',
        value: function clearCurrentPinger() {
            if (this.currentPinger === null) {
                console.log('No pinger to clear');
            } else {
                var clearPinger = this.isCurrentPingerRecurring ? window.clearInterval : window.clearTimeout;
                clearPinger(this.currentPinger);
                this.isCurrentPingerRecurring = false;
                this.currentPinger = null;
                this.pingCount = -1;
                this.pingStartedAt = null;
                this.lastPingedAt = null;
                this.syncView();
                console.log('Current pinger was cleared');
                this.logState();
                this.isPinging = false;
                this.togglePingBtn.innerHTML = 'Setup Ping';
                this.togglePingBtn.classList.add('setup');
                this.togglePingBtn.classList.remove('clear');
                this.showElem(this.pingCountViewContainer);
                this.showElem(this.lastPingedAtViewContainer);
                this.enableControls();
            }
        }
    }, {
        key: 'setAlarm',
        value: function setAlarm(message, afterMillis, isRecurring) {
            var _this = this;

            var alarmCallback = function alarmCallback() {
                console.log('Timeout fired');
                _this.onAlarmFired(message);
            };
            var pingMsg = 'ping';
            this.clearCurrentPinger();
            if (isRecurring) {
                pingMsg = 'keep pinging';
                this.currentPinger = setInterval(alarmCallback, afterMillis);
                this.isCurrentPingerRecurring = true;
            } else {
                this.currentPinger = setTimeout(alarmCallback, afterMillis);
                this.isCurrentPingerRecurring = false;
            }
            this.pingCount = 0;
            this.isPinging = true;
            this.disableControls();
            this.pingStartedAt = new Date(Date.now()).toString();
            this.syncView();
            console.log('Timeout setup, will ' + pingMsg + ' in : ' + afterMillis + ' milliseconds');
        }
    }, {
        key: 'getPingDelay',
        value: function getPingDelay() {
            var pingDelay = this.pingDuration.value;
            switch (this.pingUnit.value) {
                case 'm':
                    pingDelay *= 60;
                    break;
                case 'h':
                    pingDelay *= 3600;
                    break;
            }
            return pingDelay * 1000;
        }
    }, {
        key: 'beep',
        value: function beep() {
            if (!this.audioContext) {
                console.log('Audio context unavailable');
                return;
            }
            var osc = this.audioContext.createOscillator();
            osc.connect(this.audioContext.destination);
            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + 0.1);
        }
    }, {
        key: 'bindListeners',
        value: function bindListeners() {
            var _this2 = this;

            window.addEventListener('load', function () {
                _this2.togglePingBtn = document.querySelector('#toggle_alarm');
                _this2.pingDuration = document.querySelector('#duration');
                _this2.pingUnit = document.querySelector('#unit');
                _this2.pingText = document.querySelector('#alarm_text');
                _this2.pingIsRecurring = document.querySelector('#is_recurring');
                _this2.pingCountView = document.querySelector('#ping_count');
                _this2.pingStartedAtView = document.querySelector('#ping_started_at');
                _this2.lastPingedAtView = document.querySelector('#last_pinged_at');
                _this2.pingViewSection = document.querySelector('#ping_view');
                _this2.pingCountViewContainer = document.querySelector('#ping_count_container');
                _this2.lastPingedAtViewContainer = document.querySelector('#last_pinged_at_container');
                _this2.pingStartedAtViewContainer = document.querySelector('#ping_started_at_container');
                _this2.togglePingBtn.addEventListener('click', function (event) {
                    if (_this2.isPinging) {
                        _this2.togglePingBtn.innerHTML = 'Setup Ping';
                        _this2.togglePingBtn.classList.add('setup');
                        _this2.togglePingBtn.classList.remove('clear');
                        _this2.clearCurrentPinger();
                    } else {
                        _this2.togglePingBtn.innerHTML = 'Clear Ping';
                        _this2.togglePingBtn.classList.remove('setup');
                        _this2.togglePingBtn.classList.add('clear');
                        var alarmMessage = _this2.pingText.value !== "" ? _this2.pingText.value : "You have been pinged !!!";
                        _this2.setAlarm(alarmMessage, _this2.getPingDelay(), _this2.pingIsRecurring.checked);
                    }
                });
            });
        }
    }, {
        key: 'disableControls',
        value: function disableControls() {
            this.pingDuration.disabled = true;
            this.pingDuration.disabled = true;
            this.pingText.disabled = true;
            this.pingIsRecurring.disabled = true;
        }
    }, {
        key: 'enableControls',
        value: function enableControls() {
            this.pingDuration.disabled = false;
            this.pingDuration.disabled = false;
            this.pingText.disabled = false;
            this.pingIsRecurring.disabled = false;
        }
    }, {
        key: 'showElem',
        value: function showElem(elem) {
            elem.classList.remove('hidden');
        }
    }, {
        key: 'hideElem',
        value: function hideElem(elem) {
            elem.classList.add('hidden');
        }
    }, {
        key: 'syncView',
        value: function syncView() {
            this.pingCountView.innerHTML = this.pingCount === -1 ? "N/A" : this.pingCount + "";
            this.pingStartedAtView.innerHTML = this.pingStartedAt ? this.pingStartedAt : "N/A";
            this.lastPingedAtView.innerHTML = this.lastPingedAt ? this.lastPingedAt : "N/A";
            this.pingViewSection.style.display = this.pingCount === -1 ? "none" : "block";
            if (this.pingIsRecurring.checked) {
                this.showElem(this.pingCountViewContainer);
                this.showElem(this.lastPingedAtViewContainer);
            } else {
                this.hideElem(this.pingCountViewContainer);
                this.hideElem(this.lastPingedAtViewContainer);
            }
        }
    }]);

    function PingController() {
        _classCallCheck(this, PingController);

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentPinger = null;
        this.isCurrentPingerRecurring = false;
        this.pingCount = -1;
        this.isPinging = false;
        this.bindListeners();
    }

    return PingController;
}();