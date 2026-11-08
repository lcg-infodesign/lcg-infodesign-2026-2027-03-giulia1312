let myTable;

let maxLength = 0;
let minTemp = 100;
let maxTemp = -100;


function preload() {
  myTable = loadTable("assets/rivers_world_-_Data.csv", "csv", "header");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");

  for (let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++) {

    // valore lunghezza
    let length = myTable.getNum(numRiga, "length");
    if (length > maxLength) {
      maxLength = length;
    }

    // valore temperatura media
    let temp = myTable.getNum(numRiga, "avg_temp");
    if (temp > maxTemp) {
      maxTemp = temp;
    }
    if (temp < minTemp) {
      minTemp = temp;
    }
  }

  console.log("lunghezza massima:", maxLength);
  console.log("temperatura min e max:", minTemp, maxTemp);
}

//colore in base alla temperatura: azzurro -> giallo -> rosso/arancione
function coloreTemp(temp) {
  let azzurro = color(90, 200, 255);
  let giallo = color(255, 225, 150);
  let rosso = color(255, 80, 40);

  let t = map(temp, minTemp, maxTemp, 0, 1);
  if (t < 0.5) {
    return lerpColor(azzurro, giallo, t * 2);
  }
  return lerpColor(giallo, rosso, (t - 0.5) * 2);
}

function draw() {
  background(10, 20, 50);

  //titolo e legenda
  fill(255);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(32);
  text("I 100 fiumi più lunghi del mondo", windowWidth / 2, 50);
  textStyle(NORMAL);
  textSize(14);
  text("Ogni glifo è un fiume: passa il mouse sopra una barra per leggerne il nome.", windowWidth / 2, 120);
  text("Altezza della barra = lunghezza (massimo " + maxLength + " km)", windowWidth / 2, 145);
  text("Colore della barra = temperatura media:", windowWidth / 2, 170);

  //legenda colori: tre cerchi (freddo, medio, caldo)
  for (let i = 0; i < 3; i++) {
    let tempLegenda = map(i, 0, 2, minTemp, maxTemp);
    fill(coloreTemp(tempLegenda));
    ellipse(windowWidth / 2 + (i - 1) * 110, 198, 20, 20);
    fill(255);
    text(tempLegenda + " °C", windowWidth / 2 + (i - 1) * 110, 228);
  }

  let larghezza = windowWidth / myTable.getRowCount();
  let base = windowHeight - 40;
  let posx = 0;
  let testo = "";

  for (let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++) {

    let length = myTable.getNum(numRiga, "length");
    let altezza = map(length, 0, maxLength, 0, windowHeight - 290);

    let temp = myTable.getNum(numRiga, "avg_temp");

    //glifo barra colorata
    fill(coloreTemp(temp));
    rect(posx + 1, base - altezza, larghezza - 2, altezza);

    let nome = myTable.getString(numRiga, "name");

    if (mouseX > posx && mouseX < posx + larghezza && mouseY > base - altezza && mouseY < base) {
      testo = nome + ", " + length + " km, " + temp + " °C";
    }

    //aumento posizione x
    posx = posx + larghezza;
  }

  //etichetta testo nome del fiume
  if (testo != "") {
    textAlign(LEFT);
    fill(255);
    rect(mouseX, mouseY - 16, textWidth(testo) + 10, 22);
    fill(0);
    text(testo, mouseX + 5, mouseY);
  }
}