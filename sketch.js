var canvas = document.createElement("canvas"),
  c = canvas.getContext("2d");
var w = canvas.width = window.innerWidth,
  h = canvas.height = window.innerHeight;

document.body.appendChild(canvas);

var woh = Math.floor(h/8),
    size = h/woh,
    wow = Math.floor(w/size),
    world = new Array(wow),
    life = 0,
    asum = new Array(wow),
    min = 2,
    max = min+1;
console.log(woh,wow);

class cell{
  constructor(x_,y_,s,l){
    this.x = x_;
    this.y = y_;
    this.size = s;
    this.life = l;
  }
  
  rules(sum){
    
    if(this.life == 1){
      if(sum >= min && sum <= max){
        this.life = 1;
      }else{
        this.life = 0;
      }
    }else{
      if(sum == max){
       this.life = 1; 
      }
    }
    
  }
  
  show(){
    
    if(this.life == 1){
       c.fillStyle="white";
       }else{
       c.fillStyle="black"; 
       }
    
    c.beginPath();
    c.fillRect(this.x,this.y,this.size,this.size);
    
  }
  
}

for(var i = 0; i < world.length; i++){
  world[i] = new Array(woh);
  asum[i] = new Array(woh);
  for(var j = 0; j < world[i].length; j++){
    /*if(i > 0 && i < 4 && j == 2){
      life = 1;
    }else{
      life = 0;
    }*/
    if(i > 0 && j > 0 && i < wow && j < woh && Math.random() > 0.8){
      life = 1;
    }else{
      life = 0;
    }
    world[i][j]=new cell(i*size,j*size,size,life);
  }
}

function draw() {
  
  for(var ix = 1; ix < world.length-1; ix++){
    for(var iy = 1; iy < world[ix].length-1; iy++){
      
      var sum = world[ix-1][iy-1].life+world[ix-1][iy].life+world[ix-1][iy+1].life+world[ix][iy-1].life+world[ix][iy+1].life+world[ix+1][iy-1].life+world[ix+1][iy].life+world[ix+1][iy+1].life; 
        
      
      asum[ix][iy] = sum;
    }
  }
    
    for(var i = 0; i < world.length; i++){
  for(var j = 0; j < world[i].length; j++){
    world[i][j].show();
    if(i > 0 && j > 0 && i < wow && j < woh){
      world[i][j].rules(asum[i][j]);
  }
      }
    }
}
  

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function loop() {

  setTimeout(function() {
    window.requestAnimFrame(loop);
    c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, w, h);
    draw();
  }, 1000 / 60);

}

window.addEventListener('resize', function() {
  w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight;
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
});

loop();