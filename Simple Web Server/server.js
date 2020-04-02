//************ */ Simple Code without any middleware  *********************

const http = require('http');   
const fs =require('fs');
const path = require('path');  //  path import to get the extension which will entered in url 
const url = require('url');
const port = "1899";


//types of extension you can give...
const contentTypes = {
  html : 'text/html',
  jpg : 'image/jpg',
  jpeg : 'image/jpeg',
  png : 'image/png',
  js : 'text/javascript',
  css: 'text/css'
}

http.createServer((req, res)=>{

  if(req.url!='/favicon.ico'){    // this condition used to avoid extra req which was sent by browser...
    let filename= url.parse(req.url).pathname;
    res.writeHead(200,{'Content-type' : 'text/plain'});   // define which typeof data is pass in res
    
    let ext= path.extname(req.url); // get extension
    
    if(ext!=="" && ext != null){
     filename= path.basename(filename);
     let readStream=fs.createReadStream(filename);  // create read stream and send that to write stream of http res.
     readStream.on('data', (chunk)=>{
       res.writeHead(200,{'Content-Tyype' : ext});
       res.write(chunk);
       res.end();
     })
     // readStream.pipe(res);    // above three can replace by one line ... pipe do the same thing...
    }
    else{
      // if ext not found..give error msg
      res.writeHead(404,{'Content-Type': 'text/plain'}) 
      res.write("Not Found Anything");
      res.end();
    }
  }


}).listen(port);
