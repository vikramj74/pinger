class PingController {

    logState() {
        console.log(`Current pinger ID : ${this.currentPinger}\nPing count : ${this.pingCount}\nIs recurring : ${this.isCurrentPingerRecurring}\nIs pinging : ${this.isPinging}`);
    }

    onAlarmFired(message) {
        this.beep();
        this.pingCount++;
        this.lastPingedAt = (new Date(Date.now())).toString();
        this.syncView();
        alert('Ping : '+message);
        if(!this.isCurrentPingerRecurring) {
            this.clearCurrentPinger();
        } 
        this.logState();
    }

    clearCurrentPinger() {
        if(this.currentPinger === null) {
            console.log('No pinger to clear');
        } else {
            const clearPinger = (this.isCurrentPingerRecurring) ? window.clearInterval : window.clearTimeout;
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

    setAlarm(message, afterMillis, isRecurring) {
        const alarmCallback = () => {
            console.log('Timeout fired');
            this.onAlarmFired(message);
        };
        let pingMsg = 'ping';
        this.clearCurrentPinger();
        if(isRecurring) {
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
        this.pingStartedAt = (new Date(Date.now())).toString();
        this.syncView();
        console.log(`Timeout setup, will ${pingMsg} in : ${afterMillis} milliseconds`);
    }

    getPingDelay() {
        let pingDelay = this.pingDuration.value;
        switch(this.pingUnit.value) {
            case 'm' :
                pingDelay *= 60; 
                break;
            case 'h' :
                pingDelay *= 3600;
                break;
        }
        return pingDelay * 1000;
    }

    beep() {
        if(!this.audioContext) {
            console.log('Audio context unavailable');
            return;
        }
        let osc = this.audioContext.createOscillator(); 
        osc.connect(this.audioContext.destination);
        osc.start(this.audioContext.currentTime); 
        osc.stop(this.audioContext.currentTime+0.1);
    }

    bindListeners() {
        window.addEventListener('load', () => {
            this.togglePingBtn = document.querySelector('#toggle_alarm');
            this.pingDuration = document.querySelector('#duration');
            this.pingUnit = document.querySelector('#unit');
            this.pingText = document.querySelector('#alarm_text');
            this.pingIsRecurring = document.querySelector('#is_recurring');
            this.pingCountView = document.querySelector('#ping_count');
            this.pingStartedAtView = document.querySelector('#ping_started_at');
            this.lastPingedAtView = document.querySelector('#last_pinged_at');
            this.pingViewSection = document.querySelector('#ping_view');
            this.pingCountViewContainer = document.querySelector('#ping_count_container');
            this.lastPingedAtViewContainer = document.querySelector('#last_pinged_at_container');
            this.pingStartedAtViewContainer = document.querySelector('#ping_started_at_container');
            this.togglePingBtn.addEventListener('click', (event) => {
                if(this.isPinging) {
                    this.togglePingBtn.innerHTML = 'Setup Ping';
                    this.togglePingBtn.classList.add('setup');
                    this.togglePingBtn.classList.remove('clear');
                    this.clearCurrentPinger();
                } else {
                    this.togglePingBtn.innerHTML = 'Clear Ping';
                    this.togglePingBtn.classList.remove('setup');
                    this.togglePingBtn.classList.add('clear');
                    const alarmMessage = (this.pingText.value !== "") ? this.pingText.value : "You have been pinged !!!";
                    this.setAlarm(
                            alarmMessage,
                            this.getPingDelay(), 
                            this.pingIsRecurring.checked
                    );
                }
            });
        });
    }



    disableControls() {
        this.pingDuration.disabled = true;
        this.pingDuration.disabled = true;
        this.pingText.disabled = true;
        this.pingIsRecurring.disabled = true;
    }

    enableControls() {
        this.pingDuration.disabled = false;
        this.pingDuration.disabled = false;
        this.pingText.disabled = false;
        this.pingIsRecurring.disabled = false;

    }

    showElem(elem) {
        elem.classList.remove('hidden');
    }

    hideElem(elem) {
        elem.classList.add('hidden');
    }

    syncView() {
        this.pingCountView.innerHTML = (this.pingCount === -1) ? "N/A" : (this.pingCount+""); 
        this.pingStartedAtView.innerHTML = (this.pingStartedAt) ? this.pingStartedAt : "N/A";
        this.lastPingedAtView.innerHTML = (this.lastPingedAt) ? this.lastPingedAt : "N/A";
        this.pingViewSection.style.display = (this.pingCount === -1) ? "none" : "block";
        if(this.pingIsRecurring.checked) {
            this.showElem(this.pingCountViewContainer);
            this.showElem(this.lastPingedAtViewContainer);
        } else {
            this.hideElem(this.pingCountViewContainer);
            this.hideElem(this.lastPingedAtViewContainer);
        }
    }

    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentPinger = null;
        this.isCurrentPingerRecurring = false;
        this.pingCount = -1;
        this.isPinging = false;
        this.bindListeners();
    }
}
