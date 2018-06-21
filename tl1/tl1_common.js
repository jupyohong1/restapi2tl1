// tl1/tl1_common.js
const CRLF = '\r\n';
const TL1_COMMON = {};

TL1_COMMON.GetSendMsg = function() {
  this.cmd = '';
  this.tid = '';
  this.aid = '';
  this.ctag = '';
  this.param = '';
};

TL1_COMMON.GetSendMsg.prototype.toString = function() {
  return this.cmd + ':' + this.tid + ':' + this.aid + ':' + this.ctag + ':'
  + this.param + ';' + CRLF;
};

TL1_COMMON.GetRecvMsg = function() {
  this.tid = '';
  this.datetime = '';
  this.type = '';
  this.ctag = '';
  this.code = '';
  this.items = [];
  this.errcode = '';
  this.errtxt = '';
};

TL1_COMMON.GetRecvMsg.prototype.parseHdr = function(msg) {
  let sp = 0;
  let ep = 0;
  let i = 0;
  let spHdr = 0;
  let epHdr = 0;
  let tmpMsg = msg.trim();

  // console.log(msg);

  while ((ep = tmpMsg.indexOf(CRLF, sp)) >= 0) {
    let line = tmpMsg.slice(sp, ep);
    // console.log(`line: ${line}`);
    if (i==0) {
      spHdr = 0, epHdr = line.indexOf(' ');
      this.tid = line.slice(spHdr, epHdr);

      spHdr = epHdr+1;
      epHdr = line.indexOf(' ', spHdr);
      this.datetime = line.slice(spHdr, epHdr);

      spHdr = epHdr+1;
      this.datetime += ' ' + line.slice(spHdr);
    } else if (i==1) {
      spHdr = 0, epHdr = 2;
      this.type = line.slice(spHdr, epHdr).trim();

      spHdr = epHdr+1;
      epHdr = line.indexOf(' ', spHdr);
      this.ctag = line.slice(spHdr, epHdr);

      spHdr = epHdr+1;
      this.code = line.slice(spHdr);
    } else {
      if (this.code == 'COMPLD') {
        spHdr = line.indexOf('"');
        if (spHdr >= 0) {
          let item = line.slice(spHdr);
          // console.log(`item: ${item}`);
          this.items.push(item);
        }
      } else {
        if (i==2) {
          this.errcode = line.trim();
        } else if (i==3) {
          this.errtxt = line.trim();
        }
      }
    }

    sp = ep+2;
    // console.log("TMP_MSG:" + tmp_msg.toString());
    i++;
  }

  // console.log(this);
};

module.exports = TL1_COMMON;
