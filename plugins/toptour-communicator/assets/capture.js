class TTGCapture extends AudioWorkletProcessor {
  constructor() { super(); this.buffer=new Float32Array(2048); this.at=0; }
  process(inputs) {
    const data=inputs[0]?.[0]; if(!data) return true;
    for(const value of data) {
      this.buffer[this.at++]=value;
      if(this.at===this.buffer.length) {
        const bytes=new ArrayBuffer(this.at*2), view=new DataView(bytes);
        for(let i=0;i<this.at;i++){const x=Math.max(-1,Math.min(1,this.buffer[i]));view.setInt16(i*2,Math.round(x*(x<0?32768:32767)),true);}
        this.port.postMessage({bytes,rate:sampleRate},[bytes]);this.at=0;
      }
    }
    return true;
  }
}
registerProcessor('ttg-capture',TTGCapture);
