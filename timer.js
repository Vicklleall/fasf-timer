class Timer {
  constructor (parentNode) {
    // Create HTML nodes
    let timerBox = parentNode.appendChild(this.element('div', 'timer-box')),
        timerAnm = timerBox.appendChild(this.element('div', 'timer-anm')),
        timerVal = timerBox.appendChild(this.element('code', 'timer-val')),
        timerWave = timerAnm.appendChild(this.element('div', 'timer-wave')),
        timerM = timerAnm.appendChild(this.element('div', 'timer-m')),
        timerS = timerAnm.appendChild(this.element('div', 'timer-s'))
    // Inintial
    this.status = 0;
    this.duration = 1;
    this.anmWave = timerWave;
    this.startTime = Date.now();
    // Create text nodes
    this.number = [];
    for (let i = 0; i < 11; i++) {
      let e = timerVal.appendChild(this.element('span')),
          c = '00:00:00.00'[i];
      e.innerText = c;
      if (i > 7) {
        e.style.fontSize = '36px';
        e.style.width = i > 8 ? '28px' : '12px';
      } else {
        e.style.width = c === '0' ? '48px' : '16px';
      }
      if (c === '0') this.number.push(e);
    }
    // Animations
    // Rising animation
    this.rise = timerWave.animate([
      { filter: 'hue-rotate(210deg)' },
      { offset: 0.4, filter: 'hue-rotate(210deg)' },
      { offset: 0.7, filter: 'hue-rotate(160deg) brightness(1.2)' },
      { offset: 0.82, filter: 'hue-rotate(70deg) brightness(1.3)' },
      { offset: 0.92, filter: 'hue-rotate(60deg) brightness(1.4)' },
      { offset: 0.99, filter: 'hue-rotate(0)' },
      { backgroundPositionY: '-8px, -16px' }
    ], { duration: 1000, fill: 'forwards' });
    this.rise.pause();
    // Wave animation
    this.wave = timerWave.animate([
      { backgroundPositionX: '400px, 480px' },
      { backgroundPositionX: '0, 0' }
    ], { duration: 4000, fill: 'forwards', iterations: Infinity });
    // Minute hand animation
    this.min = timerM.animate([
      { transform: 'rotate(0)' },
      { transform: 'rotate(360deg)' }
    ], { duration: 3600000, fill: 'forwards', iterations: Infinity });
    this.min.pause();
    // Second hand animation
    this.sec = timerS.animate([
      { transform: 'rotate(0)' },
      { transform: 'rotate(360deg)' }
    ], { duration: 60000, fill: 'forwards', iterations: Infinity });
    this.sec.pause();
  }
  element (tagName, className) {
    let e = document.createElement(tagName);
    if (className) e.className = className;
    return e;
  }
  start () {
    this.startTime = this.pauseTime ? Date.now() - this.pauseTime : Date.now();
    this.run = setInterval(this.update, 33, this);
    this.anmWave.style.display = 'block';
    this.rise.currentTime = (Date.now() - this.startTime) / this.duration;
    this.rise.play();
    this.wave.play();
    this.min.play();
    this.sec.play();
    this.status = 1;
  }
  pause () {
    clearInterval(this.run);
    this.pauseTime = Date.now() - this.startTime;
    this.rise.pause();
    this.wave.pause();
    this.min.pause();
    this.sec.pause();
    this.status = 0;
  }
  reset () {
    clearInterval(this.run);
    for (let i = 0; i < 8; i++) {
      this.number[i].innerText = '0';
    }
    this.anmWave.style.display = 'none';
    this.rise.currentTime = 0;
    this.rise.pause();
    this.wave.pause();
    this.min.pause();
    this.min.currentTime = 0;
    this.sec.pause();
    this.sec.currentTime = 0;
    this.status = 0;
  }
  setDuration (str) {
    // Input format: 00:00:00.00
    this.duration = this.parse(str)
    this.rise.currentTime = (Date.now() - this.startTime) / this.duration;
    this.rise.playbackRate = 1 / this.duration;
  }
  setTime (str) {
    // Input format: 00:00:00.00
    let t = this.parse(str) * 1000;
    this.startTime = Date.now() - t;
    this.update(this);
    this.rise.currentTime = t / this.duration;
    this.min.currentTime = t % 3600000;
    this.sec.currentTime = t % 60000;
  }
  parse (str) {
    let [h, m, s] = str.split(':');
    return h * 3600 + m * 60 + Number(s);
  }
  pad (t) {
    return (t < 10 ? '0' : '') + t;
  }
  update (o) {
    let t = (Date.now() - o.startTime) / 1000,
        str = o.pad(t / 3600 << 0)
            + o.pad(t % 3600 / 60 << 0)
            + o.pad(t % 60 << 0)
            + (t % 1).toFixed(2).slice(2);
    for (let i = 0; i < 8; i++) {
      o.number[i].innerText = str[i];
    }
  }
}
