const manifest=new(require('./manifest'))('./output.txt');
let id=1
let k =2
let author="Mr. Smit";
let description="Smite commit";
let type="checkout";
let tag="asdf";
let value="adsf";

manifest.createEntry(id,author,description,type,tag,value);

let m = manifest.content[id];
let o = manifest.createEntry(m.value,author,description,'checkin',tag,id.toString(10));



  manifest.updateEntry(m.value,"value","1")



console.log(manifest.content);