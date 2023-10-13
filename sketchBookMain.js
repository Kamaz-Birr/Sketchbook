/*The Quasi-Generative Painting App (ver 1.0) by John (Yohan) Orewa
****
/

let col1, col2;   // Color picker variables
let startDraw;    // Boolean to begin or end drawing
let canvas2;      // Secondary canvas
let brushSize;    // Brush size variable 
let button1;
const brushArray = [];     // Brush Array
let currentBrush = 0;      // Current brush to use
let i = 0;        // iterator

function setup() {
  createCanvas(600, 600);  // Canvas for the background
  background(0, 0);  // Redundant? Yeah, most definately XD
  canvas2 = createGraphics(600, 600); // Extra canvas for the brush strokes
  canvas2.clear();
  startDraw = false;
  
  // Set up brushes
  brushSize = 20;
  circleBrush = new CircleBrush(brushSize);
  brushArray.push(circleBrush);
  squareBrush = new SquareBrush(brushSize);
  brushArray.push(squareBrush);
  triangleBrush = new TriangleBrush(brushSize);
  brushArray.push(triangleBrush);
  watercolourBrush1 = new WatercolourBrush1(brushSize);
  brushArray.push(watercolourBrush1);
  watercolourBrush2 = new WatercolourBrush2(brushSize);
  brushArray.push(watercolourBrush2);
  
  // Set up colour pickers
  col1 = createColorPicker('#ed225d');  // Brush colour picker
  col2 = createColorPicker('#000000');  // Background. colour picker
  col1.position(width/2-20, height + 5);
  col2.position(width/2-20, height + 25)
  
  // Set up buttons
  button1 = createButton('Change Brush');
  button1.position(0, height + 20);
  button1.mousePressed(changeBrush);
  button2 = createButton('Save');
  button2.position(width - 40, height + 20);
  button2.mousePressed(saveImage);
}

function draw() {
  background(col2.color());
  
  if(startDraw) {
    brushArray[currentBrush].draw();
  }
  
  image(canvas2, 0, 0);
}

function mouseClicked() {
  if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
    if(startDraw == false) {
      startDraw = true;
    } else {
      startDraw = false;
    }
  }
}

function saveImage() {
  saveCanvas();
}

function changeBrush() {
  i++;
  currentBrush = i % brushArray.length;
}


// Brush Classes
class CircleBrush {
  constructor(b_size) {
    this.b_size = b_size;
    this.defaultSize = b_size;
  }
  
  draw() {
    // Reset brush. size if mouse isn't pressed
    if(mouseIsPressed) {
      this.b_size += 0.5;
    } else {
      this.b_size = this.defaultSize;
    }
    canvas2.noStroke();
    canvas2.fill(red(col1.color()), green(col1.color()), blue(col1.color()), 10);
    canvas2.circle(mouseX, mouseY, this.b_size);
    canvas2.circle((mouseX + pmouseX)/2, (mouseY + pmouseY)/2, this.b_size);
    canvas2.circle(pmouseX, pmouseY, this.b_size);
    
    // Guide to show current tool
    fill(255, 100);
    circle(mouseX, mouseY, this.b_size);
  }
}

class SquareBrush {
  constructor(b_size) {
    this.b_size = b_size;
    this.defaultSize = b_size;
  }
  
  draw() {
    if(mouseIsPressed) {
      this.b_size += 0.5;
    } else {
      this.b_size = this.defaultSize;
    }
    rectMode(CENTER);
    canvas2.noStroke();
    canvas2.fill(red(col1.color()), green(col1.color()), blue(col1.color()), 10);
    canvas2.square(mouseX, mouseY, this.b_size);
    canvas2.square((mouseX + pmouseX)/2, (mouseY + pmouseY)/2, this.b_size);
    canvas2.square(pmouseX, pmouseY, this.b_size);
    
    fill(255, 100);
    square(mouseX, mouseY, this.b_size);
  }
}

class TriangleBrush {
  constructor(b_size) {
    this.b_size = b_size;
    this.defaultSize = b_size;
  }
  
  draw() {
    if(mouseIsPressed) {
      this.b_size++;
    } else {
      this.b_size = this.defaultSize;
    }
    canvas2.noStroke();
    canvas2.fill(red(col1.color()), green(col1.color()), blue(col1.color()), 10);
    canvas2.triangle(mouseX, mouseY, mouseX + this.b_size/2, mouseY - this.b_size, mouseX + this.b_size, mouseY);
    
    fill(255, 100);
    triangle(mouseX, mouseY, mouseX + this.b_size/2, mouseY - this.b_size, mouseX + this.b_size, mouseY);
  }
}

class WatercolourBrush1 {
  constructor(b_size) {
    this.b_size = b_size;
    this.defaultSize = b_size;
  }
  
  draw() {
    if(mouseIsPressed) {
      this.b_size += 0.1;
    } else {
      this.b_size = this.defaultSize;
    }
    canvas2.fill(col1.color().levels[0]+random(-25,25), col1.color().levels[1]+random(-25,25), col1.color().levels[2]+random(-25,25), 6);
    
    for (let j = 0; j < 3; j++) {
      canvas2.push();
      canvas2.translate(mouseX, mouseY);
      canvas2.rotate(random(PI * 2));
      canvas2.beginShape();
      for (let m = 0; m < PI * 2; m++) {
        let r = random(this.b_size, this.b_size+10);
        let x = cos(m) * r;
        let y = sin(m) * r;
        vertex(x, y);
      }
      canvas2.endShape(CLOSE);
      canvas2.pop();
    }
  }
}

class WatercolourBrush2 {
  constructor(b_size, vertices, modifiers) {
    this.b_size = b_size;
    if(!vertices) {
      let n = 4;
      vertices = [];
      for(let i = 0; i < n; i++) {
        let angle = i * (TAU/n);
        vertices.push(createVector(cos(angle) * this.b_size, sin(angle) * this.b_size));
      }
    }
    this.vertices = vertices;
    
    if(!modifiers) {
      modifiers = [];
      for(let i = 0; i < this.vertices.length; i++) {
        modifiers.push(random(0.1, 0.8));
      }
    }
    this.modifiers = modifiers;  
  }
  
  distribute(x) {
    return pow((x - 0.5) * 1.58740105, 3) + 0.5;
  }
  
  rand() {
    return this.distribute(random(1));
  }
  
  grow() {
    const grownVerts = [];
    const grownMods = [];
    for(let i = 0; i < this.vertices.length; i++) {
      const j = (i + 1) % this.vertices.length;
      const v1 = this.vertices[i];
      const v2 = this.vertices[j];
      
      const mod = this.modifiers[i];
      
      grownVerts.push(v1);
      grownMods.push(mod + (this.rand() - 0.5) * 0.1);
      
      const segment = p5.Vector.sub(v2, v1);
      const len = segment.mag();
      segment.mult(this.rand());
      
      const v = p5.Vector.add(segment, v1);
      
      segment.rotate(-PI/2 + (this.rand() - 0.5) * PI/4);
      segment.setMag(this.rand() * len/2 * mod);
      v.add(segment);
      
      grownVerts.push(v);
      grownMods.push(mod + (this.rand() - 0.5) * 0.1);
    }
    return new WatercolourBrush2(this.b_size, grownVerts, grownMods);
  }
  
  dup() {
    return new WatercolourBrush2(this.b_size, Array.from(this.vertices), Array.from(this.modifiers));
  }
  
  drawShape() {
    canvas2.push();
    canvas2.translate(mouseX, mouseY);
    canvas2.beginShape();
    for(let v of this.vertices) {
      vertex(v.x, v.y);
    }
    canvas2.endShape(CLOSE);
    canvas2.pop();
    
    canvas2.push();
    canvas2.translate(pmouseX, pmouseY);
    canvas2.beginShape();
    for(let v of this.vertices) {
      vertex(v.x, v.y);
    }
    canvas2.endShape(CLOSE);
    canvas2.pop();
  }
  
  draw() {
    canvas2.tint(255, 10);
    const numLayers = 30;
    canvas2.noStroke();
    canvas2.fill(red(col1.color()), green(col1.color()), blue(col1.color()), 5);
    
    this.grow().grow();
    
    for(let i = 0; i < numLayers; i++) {
      if(i == int(numLayers/3) || i == int(2 * numLayers/3)) {
        this.grow().grow();
      }
      
      this.grow().drawShape();
    }
  }
}
