let cidNome = ["Valdrada", "Diomira", "Isidora", "Dorotéia"];
let indCidNome = 0;

//CLASSES
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    let res = new Vector();
    res.x = this.x + v.x;
    res.y = this.y + v.y;

    return res;
  }

  sub(v) {
    let res = new Vector();
    res.x = this.x - v.x;
    res.y = this.y - v.y;

    return res;
  }

  mult(scalar) {
    let res = new Vector();

    res.x = this.x * scalar;
    res.y = this.y * scalar;
    return res;
  }

  div(scalar) {
    let res = new Vector();
    if (scalar !== 0) {
      res.x = this.x / scalar;
      res.y = this.y / scalar;
    } else {
      res.x = this.x;
      res.y = this.y;
    }
    return res;
  }

  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  defMag(valor) {
    this.normalize();
    this.x *= valor;
    this.y *= valor;
  }

  normalize() {
    const m = this.mag();
    if (m !== 0) {
      this.x /= m;
      this.y /= m;
    }
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }
}

class WordVec {
  constructor(palavra) {
    this.palavra = palavra;

    this.vel = new Vector();
    this.maxMagVelIni = 0.0; //0.1 - talvez isto n tenha sido genial...
    this.maxMagVelRepIni = 0.5; //voltar aqui (É um bocado suspeito q isto a 1 ainda se mexa... algo de errado n está correto)
    this.redVel = 1;
    this.maxMagVel = this.maxMagVelIni; //individual (atração)
    this.maxMagVelRep = this.maxMagVelRepIni;
    this.maxDistIncrement = 50;
    this.espPessoal = 5;
    this.tolerancia = 0;

    this.pos = new Vector();
    this.visualRep = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    /* this.visualRep = addText(0, 0, this.palavra, 3); */
    RepsWordPlaces.appendChild(this.visualRep);

    this.vizinhos = [];
    this.posNoTexto = [];

    for (let i = 0; i < palavra.length; i++) {
      let indexV = -1;

      for (let j = 0; j < letras.length; j++) {
        if (
          palavra
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .charAt(i)
            .toUpperCase() === letras[j]
        ) {
          indexV = j;
          break;
        }
      }
      if (indexV != -1) {
        this.pos = this.pos.add(CharIniPoses[indexV]);
      }
    }
    if (palavra.length > 0) {
      this.pos = this.pos.mult(1.0 / palavra.length);
    }
  }

  desenhaVisualRep(color, r) {
    this.visualRep.setAttribute("cx", this.pos.x + 50);
    this.visualRep.setAttribute("cy", this.pos.y + 50);
    this.visualRep.setAttribute("r", r);
    this.visualRep.setAttribute("fill", color);
  }

  atuaPosVisualRep() {
    this.visualRep.setAttribute("cx", this.pos.x + 50);
    this.visualRep.setAttribute("cy", this.pos.y + 50);
  }

  move() {
    if (
      this.pos.x < -50 ||
      this.pos.y < -50 ||
      this.pos.x > 50 ||
      this.pos.y > 50
    ) {
      this.vel = new Vector(0, 0);
      this.vel = this.vel.sub(this.pos);
      this.vel.defMag(5);
    }
    this.pos = this.pos.add(this.vel);
  }

  atuaFor() {
    this.redVel = this.redVel / 1.001;
    this.maxMagVel = this.maxMagVelIni * this.redVel; //individual (atração)
    this.maxMagVelRep = this.maxMagVelRepIni * this.redVel;
  }
}

class Conections {
  constructor(indObj1, indObj2, textoObj1) {
    this.indObj1 = indObj1;
    this.indObj2 = indObj2;
    this.prefDist = 5;
    this.maxRelDist = 30;
    this.forAtr = 0.5;

    this.conRepPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.conRepPath.setAttribute("stroke", "none");
    this.conRepPath.setAttribute("fill", "none");
    this.conRepPath.setAttribute("d", "M 0 0 L 0 0");
    const pathID = `path-${indObj1}-${indObj2}`;
    this.conRepPath.setAttribute("id", pathID);
    RepsConexPlaces.appendChild(this.conRepPath);

    this.conRepText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    this.conRepText.setAttribute("font-size", 2);
    this.conRepText.setAttribute("fill", "black");
    this.conRepText.setAttribute(
      "textLength",
      this.conRepPath.getTotalLength()
    );

    this.conRepTextPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "textPath"
    );
    this.conRepTextPath.setAttribute("href", `#${pathID}`);
    this.conRepTextPath.textContent = textoObj1;

    this.conRepText.appendChild(this.conRepTextPath);
    RepsConexPlaces.appendChild(this.conRepText);
  }

  redefPrefDist(tamDaPalavra) {
    this.prefDist = tamDaPalavra;
  }
}

class FraseInterativa {
  constructor(arrayIndexLiga, frase, paragrafo) {
    this.texto = frase;
    this.ligIndex = arrayIndexLiga;
    this.paragrafo = paragrafo;
    this.textRep = document.createElement("span");
    this.textRep.textContent = frase;
    textoEscrito.appendChild(this.textRep);
    this.fraseAtiva = false;
    this.fraseAtivada = false;

    this.textRep.addEventListener("mouseenter", () => {
      this.textRep.style.color = "red";
      this.fraseAtiva = true;
    });
    this.textRep.addEventListener("mouseleave", () => {
      this.textRep.style.color = "black";
      this.fraseAtiva = false;
    });
  }
}
class MapManeger {
  //Isto vai:
  //Criar o meu array de WordVecs com base no array de palavras do texto.
  constructor(arrayPalavras) {
    this.maxWordRepresentations = 3;
    this.wordPlaces = [];
    this.convertTextToWordVec = [];
    this.lig = [];
    this.conectionsRep = [];
    this.textoFrases = [];

    this.ligPositivas = 1;

    for (let i = 0; i < arrayPalavras.length; i++) {
      //let novaPalavra = true;
      let indexWordVecCorrespondente = -1;
      for (let j = 0; j < this.wordPlaces.length; j++) {
        if (
          arrayPalavras[i] === this.wordPlaces[j].palavra &&
          this.wordPlaces[j].posNoTexto.length < this.maxWordRepresentations &&
          ![".", ",", "!", "?", ";", ":", "/\n"].includes(
            this.wordPlaces[j].palavra
          )
        ) {
          indexWordVecCorrespondente = j;
          break;
        }
      }
      if (indexWordVecCorrespondente === -1) {
        this.wordPlaces.push(new WordVec(arrayPalavras[i]));
        this.wordPlaces[this.wordPlaces.length - 1].posNoTexto.push(i);
        this.convertTextToWordVec.push(this.wordPlaces.length - 1);
      } else {
        this.wordPlaces[indexWordVecCorrespondente].posNoTexto.push(i);
        this.convertTextToWordVec.push(indexWordVecCorrespondente);
      }
    }
  }

  popularLig() {
    let nParagrafos = 1;
    let indLigFrase = [];
    let frase = "";
    textoEscrito = document.createElement("p");
    texto.appendChild(textoEscrito);
    for (let i = 0; i < this.convertTextToWordVec.length; i++) {
      if (
        this.wordPlaces[this.convertTextToWordVec[i]].palavra != "." &&
        this.wordPlaces[this.convertTextToWordVec[i]].palavra != "/\n"
      ) {
        this.wordPlaces[this.convertTextToWordVec[i]].vizinhos.push(
          this.convertTextToWordVec[i + 1]
        );
        this.wordPlaces[this.convertTextToWordVec[i + 1]].vizinhos.push(
          this.convertTextToWordVec[i]
        );

        this.conectionsRep.push(
          new Conections(
            this.convertTextToWordVec[i],
            this.convertTextToWordVec[i + 1],
            this.wordPlaces[this.convertTextToWordVec[i]].palavra
          )
        );
        this.conectionsRep[this.conectionsRep.length - 1].redefPrefDist(
          this.wordPlaces[this.convertTextToWordVec[i]].palavra.length
        );
      }
      if (this.wordPlaces[this.convertTextToWordVec[i]].palavra === "\n") {
        nParagrafos += 1;
        textoEscrito = document.createElement("p");
        texto.appendChild(textoEscrito);
      }
      if (
        [".", ",", "!", "?", ";", ":"].includes(
          this.wordPlaces[this.convertTextToWordVec[i]].palavra
        )
      ) {
        frase = frase.replace(/\s$/, "");
        frase += this.wordPlaces[this.convertTextToWordVec[i]].palavra;
        indLigFrase.push(this.conectionsRep.length - 1);
        this.textoFrases.push(
          new FraseInterativa(indLigFrase, frase, nParagrafos)
        );
        console.log(this.textoFrases[this.textoFrases.length - 1]);
        indLigFrase = [];
        frase = " ";
      } else {
        frase += this.wordPlaces[this.convertTextToWordVec[i]].palavra + " ";
        indLigFrase.push(this.conectionsRep.length - 1);
      }
    }
  }

  atuaLigPos() {
    for (let i = 0; i < this.conectionsRep.length; i++) {
      this.conectionsRep[i].conRepPath.setAttribute(
        "d",
        `M ${this.wordPlaces[this.conectionsRep[i].indObj1].pos.x + 50} ${
          this.wordPlaces[this.conectionsRep[i].indObj1].pos.y + 50
        }
         L ${this.wordPlaces[this.conectionsRep[i].indObj2].pos.x + 50} ${
          this.wordPlaces[this.conectionsRep[i].indObj2].pos.y + 50
        }`
      );
      this.conectionsRep[i].conRepText.setAttribute(
        "textLength",
        this.conectionsRep[i].conRepPath.getTotalLength()
      );
      this.conectionsRep[i].conRepText.setAttribute(
        "lengthAdjust",
        "spacingAndGlyphs"
      );
    }
  }

  centrar() {
    let CentroMapa = new Vector();
    const centro = new Vector(0, 0);
    for (let i = 0; i < this.wordPlaces.length; i++) {
      CentroMapa = CentroMapa.add(this.wordPlaces[i].pos);
    }
    CentroMapa = CentroMapa.div(this.wordPlaces.length);
    const vCentrar = centro.sub(CentroMapa);
    for (let i = 0; i < this.wordPlaces.length; i++) {
      this.wordPlaces[i].pos = this.wordPlaces[i].pos.add(vCentrar);
    }
  }

  estabilizador() {
    let nViz = 6;
    const nodesAlt = [];
    for (let k = nViz; k > 0; k--) {
      for (let i = 0; i < this.wordPlaces.length; i++) {
        if (this.wordPlaces[i].vizinhos.length == k) {
          nodesAlt.push(i);
          for (let j = 0; j < k; j++) {
            let alterar = true;
            for (let p = 0; p < nodesAlt.length; p++) {
              if (nodesAlt[p] == this.wordPlaces[i].vizinhos[j]) {
                alterar = false;
                break;
              }
            }
            if (alterar) {
              let novaP = new Vector();
              novaP = this.wordPlaces[this.wordPlaces[i].vizinhos[j]].pos.sub(
                this.wordPlaces[i].pos
              );
              novaP.defMag(this.wordPlaces[i].espPessoal / (20.0 / k));
              this.wordPlaces[this.wordPlaces[i].vizinhos[j]].pos =
                this.wordPlaces[i].pos.add(novaP);
              nodesAlt.push(this.wordPlaces[i].vizinhos[j]);
            }
          }
        }
      }
    }
  }

  destacar() {
    for (let i = 0; i < this.textoFrases.length; i++) {
      if (this.textoFrases[i].fraseAtivada) {
        if (this.textoFrases[i].fraseAtiva == false) {
          //voltar a meter as palavras no outro layer
          for (let j = 0; j < this.textoFrases.length; j++) {
            if (
              this.textoFrases[j].paragrafo != this.textoFrases[i].paragrafo
            ) {
              this.textoFrases[j].textRep.style.color = "black";
              for (let k = 0; k < this.textoFrases[j].ligIndex.length; k++) {
                this.conectionsRep[
                  this.textoFrases[j].ligIndex[k]
                ].conRepText.style.fill = "black";
              }
            }
          }
          for (let j = 0; j < this.textoFrases[i].ligIndex.length; j++) {
            RepsConexPlaces.appendChild(
              this.conectionsRep[this.textoFrases[i].ligIndex[j]].conRepText
            );
            this.conectionsRep[
              this.textoFrases[i].ligIndex[j]
            ].conRepText.style.fill = "black";
          }
          this.textoFrases[i].fraseAtivada = false;
          console.log("Desfiz uma cena");
        }
      }
    }
    for (let i = 0; i < this.textoFrases.length; i++) {
      if (this.textoFrases[i].fraseAtivada == false) {
        if (this.textoFrases[i].fraseAtiva == true) {
          //meter as palavras do mapa destacadas
          for (let j = 0; j < this.textoFrases[i].ligIndex.length; j++) {
            RepConeDestacadas.appendChild(
              this.conectionsRep[this.textoFrases[i].ligIndex[j]].conRepText
            );
            this.conectionsRep[
              this.textoFrases[i].ligIndex[j]
            ].conRepText.style.fill = "red";
          }
          this.textoFrases[i].fraseAtivada = true;

          for (let j = 0; j < this.textoFrases.length; j++) {
            if (
              this.textoFrases[j].paragrafo != this.textoFrases[i].paragrafo
            ) {
              this.textoFrases[j].textRep.style.color = "rgb(200,200,200)";
              for (let k = 0; k < this.textoFrases[j].ligIndex.length; k++) {
                this.conectionsRep[
                  this.textoFrases[j].ligIndex[k]
                ].conRepText.style.fill = "rgb(200,200,200)";
              }
            }
          }
        }
      }
    }
  }
}

//FUNÇÕES CRIADAS
function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function constrain(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function circ(x, y, r, color) {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", x);
  c.setAttribute("cy", y);
  c.setAttribute("r", r);
  c.setAttribute("fill", color);
  canvas.appendChild(c);
}

function addText(x, y, content, fontSize = "5", color = "black") {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y);
  text.setAttribute("fill", color);
  text.setAttribute("font-size", fontSize);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.textContent = content;
  return text;
}

//SET INICIAL DOS OBJETOS NO HTML
const body = document.querySelector("body");
const divPrin = document.getElementById("tudo");
const divMapTex = document.getElementById("mapa_texto");
const titulo = document.querySelector("h1");
const canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
canvas.setAttribute("viewBox", "0 0 100 100");
const texto = document.querySelector("#texto");

tudo.appendChild(canvas);
tudo.appendChild(divMapTex);

let textoEscrito;

const RepsWordPlaces = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "g"
);
const RepsConexPlaces = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "g"
);
const RepConeDestacadas = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "g"
);

canvas.appendChild(RepsConexPlaces);
canvas.appendChild(RepsWordPlaces);
canvas.appendChild(RepConeDestacadas);

//LISTA DE CARACTÉRES E PROPRIEDADES
const letras = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const CharIniPoses = [];
for (let i = 0; i < letras.length; i++) {
  let ang = ((2 * Math.PI) / letras.length) * i;
  CharIniPoses.push(new Vector(Math.cos(ang), Math.sin(ang)).mult(45));
  /* canvas.appendChild(
    addText(CharIniPoses[i].x + 50, CharIniPoses[i].y + 50, letras[i], 2)
  ); */
}

let mapa;
let modoFor = false;

//CRIAR O DRAW
function draw() {
  for (let i = 0; i < mapa.wordPlaces.length; i++) {
    mapa.wordPlaces[i].vel = new Vector();
  }
  if (modoFor) {
    for (let i = 0; i < mapa.conectionsRep.length; i++) {
      //Calcular Atrações
      let distEP = new Vector();
      let magV;

      distEP = mapa.wordPlaces[mapa.conectionsRep[i].indObj1].pos.sub(
        mapa.wordPlaces[mapa.conectionsRep[i].indObj2].pos
      );
      magV = map(
        distEP.mag(),
        mapa.conectionsRep[i].prefDist,
        mapa.conectionsRep[i].maxRelDist,
        0,
        mapa.conectionsRep[i].forAtr
      );

      let vetO1toO2 = mapa.wordPlaces[mapa.conectionsRep[i].indObj2].pos.sub(
        mapa.wordPlaces[mapa.conectionsRep[i].indObj1].pos
      );
      vetO1toO2.defMag(magV);

      let vetO2toO1 = mapa.wordPlaces[mapa.conectionsRep[i].indObj1].pos.sub(
        mapa.wordPlaces[mapa.conectionsRep[i].indObj2].pos
      );
      vetO2toO1.defMag(magV);

      mapa.wordPlaces[mapa.conectionsRep[i].indObj1].vel =
        mapa.wordPlaces[mapa.conectionsRep[i].indObj1].vel.add(vetO1toO2);
      mapa.wordPlaces[mapa.conectionsRep[i].indObj2].vel =
        mapa.wordPlaces[mapa.conectionsRep[i].indObj2].vel.add(vetO2toO1);
    }

    for (let i = 0; i < mapa.wordPlaces.length; i++) {
      for (let k = i + 1; k < mapa.wordPlaces.length; k++) {
        let vizinho = false;
        for (let v = 0; v < mapa.wordPlaces[i].vizinhos.length; v++) {
          if (k == mapa.wordPlaces[i].vizinhos[v]) {
            vizinho = true;

            break;
          }
        }
        if (
          mapa.wordPlaces[i].pos.sub(mapa.wordPlaces[k].pos).mag() <
            mapa.wordPlaces[i].espPessoal &&
          vizinho == false // Isto é opcional... ainda tou a pensar...
        ) {
          let vP1R = mapa.wordPlaces[i].pos.sub(mapa.wordPlaces[k].pos);
          let magV = constrain(
            map(
              vP1R.mag(),
              0,
              mapa.wordPlaces[i].espPessoal,
              mapa.wordPlaces[i].maxMagVelRep,
              0
            ),
            0,
            mapa.wordPlaces[i].maxMagVelRep
          );
          let vP2R = mapa.wordPlaces[k].pos.sub(mapa.wordPlaces[i].pos);
          vP1R.normalize();
          vP1R = vP1R.mult(magV);
          vP2R.normalize();
          vP2R.mult(magV);
          mapa.wordPlaces[i].vel = mapa.wordPlaces[i].vel.add(vP1R);
          mapa.wordPlaces[k].vel = mapa.wordPlaces[k].vel.add(vP2R);
        }
      }
      mapa.wordPlaces[i].move();
    }
  }
  mapa.centrar();
  mapa.atuaLigPos();
  mapa.destacar();
  /* for (let i = 0; i < mapa.wordPlaces.length; i++) {
    mapa.wordPlaces[i].desenhaVisualRep("black", 0.5); //Ver Círculos
  } */
  //LAST LINHA DO DRAW
  requestAnimationFrame(draw);
}

//CARREGAR FICHEIRO DE TEXTO
let textoCidade; // Variável para armzenamento
// Fetch para carregar o arquivo
async function carregarTexto(caminho) {
  try {
    const response = await fetch(caminho);
    if (!response.ok) {
      throw new Error("Erro ao carregar o arquivo: " + response.statusText);
    }
    const texto = await response.text();
    //console.log("Texto carregado:", texto);
    return texto;
  } catch (error) {
    console.error("Erro ao carregar o texto:", error);
    return null;
  }
}

// Função principal que depende do texto
async function main() {
  // Carregar o texto antes de continuar
  textoCidade = await carregarTexto("textos/" + cidNome[indCidNome] + ".txt");

  if (textoCidade) {
    //COLOCAR AQUI TODO O RESTANTE PROGRAMA... (Mesmo o Draw? - Isto vai ser giro...)
    const frases = textoCidade
      .split(/([.?! :;,/\n])/)
      .filter((parte) => parte !== " " && parte !== ""); //Ok já tenho o meu texto tratadinho e fofo...
    console.log(frases);

    mapa = new MapManeger(frases);
    mapa.popularLig();
    console.log(mapa.lig);
    titulo.textContent = cidNome[indCidNome];

    mapa.atuaLigPos();

    buscaEstruturaKindEv();

    requestAnimationFrame(draw);
    //-------------------------------------------------------------------------------------------------
  } else {
    console.error(
      "Não foi possível iniciar o programa porque o texto não foi carregado."
    );
  }
}

main();

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === " ") {
    modoFor = !modoFor;
  } else if (key === "e" || key === "E") {
    for (let i = 0; i < mapa.wordPlaces.length; i++) {
      mapa.wordPlaces[i].pos = new Vector(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      );
    }
    mapa.estabilizador();
  }
  if (key === "A" || key === "a") {
    buscaEstruturaKindEv(); // A este ponto da execussão, esta função já é bem inútil... já n vou lá com posições calculadas aleatóriamente... vou experimentar juntar este método com o do estabilizador...
  }
});

let isDragging = false;
let move;
let offsetX;
let offsetY;
canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  offsetX = event.clientX;
  offsetY = event.clientY;
});
canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    move = new Vector(event.clientX - offsetX, event.clientY - offsetY);
    for (let i = 0; i < mapa.wordPlaces.length; i++) {
      mapa.wordPlaces[i].pos = mapa.wordPlaces[i].pos.add(move.div(10));
    }
    offsetX = event.clientX;
    offsetY = event.clientY;
  }
});

canvas.addEventListener("mouseup", (event) => {
  if (isDragging) {
    move = new Vector(event.clientX - offsetX, event.clientY - offsetY);
    for (let i = 0; i < mapa.wordPlaces.length; i++) {
      mapa.wordPlaces[i].pos = mapa.wordPlaces[i].pos.add(move.div(10));
    }
  }
  isDragging = false;
});

//Função do tipo algoritmo de procura cega bem estúpido... (Eu diria que tem poucas probabilidades de se safar mas enfim...) De facto não se safou grande coisa.
function buscaEstrutura() {
  let distsAtual;
  for (let i = 0; i < mapa.conectionsRep.length; i++) {
    let distSin = mapa.wordPlaces[mapa.conectionsRep[i].indObj1].pos.sub(
      mapa.wordPlaces[mapa.conectionsRep[i].indObj2].pos
    );
    distSin = distSin.mag();
    distsAtual += distSin * distSin;
  }

  for (let tent = 0; tent < 10000; tent++) {
    let distsTentativa = 0;
    let tentativaMapa = mapa;
    for (let i = 0; i < tentativaMapa.wordPlaces.length; i++) {
      tentativaMapa.wordPlaces[i].pos = new Vector(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      );
    }
    for (let i = 0; i < tentativaMapa.conectionsRep.length; i++) {
      let distSin = tentativaMapa.wordPlaces[
        tentativaMapa.conectionsRep[i].indObj1
      ].pos.sub(
        tentativaMapa.wordPlaces[tentativaMapa.conectionsRep[i].indObj2].pos
      );
      distSin = distSin.mag();
      distsTentativa += distSin * distSin;
    }
    if (distsTentativa < distsAtual) {
      mapa = tentativaMapa;
      distsAtual = distsTentativa;
    }
  }
}

function buscaEstruturaKindEv() {
  let distsAtual;
  for (let i = 0; i < mapa.conectionsRep.length; i++) {
    let distSin = mapa.wordPlaces[mapa.conectionsRep[i].indObj1].pos.sub(
      mapa.wordPlaces[mapa.conectionsRep[i].indObj2].pos
    );
    distSin = distSin.mag();
    distsAtual += distSin * distSin;
  }

  for (let tent = 0; tent < 10000; tent++) {
    let distsTentativa = 0;
    let tentativaMapa = mapa;
    for (let i = 0; i < tentativaMapa.conectionsRep.length; i++) {
      if (
        tentativaMapa.wordPlaces[
          tentativaMapa.conectionsRep[i].indObj1
        ].pos.sub(
          tentativaMapa.wordPlaces[tentativaMapa.conectionsRep[i].indObj2].pos
        ).mag >
        2 * tentativaMapa.conectionsRep[i].prefDist
      ) {
        tentativaMapa.wordPlaces[tentativaMapa.conectionsRep[i].indObj1].pos =
          new Vector(Math.random() * 100 - 50, Math.random() * 100 - 50);
        tentativaMapa.wordPlaces[tentativaMapa.conectionsRep[i].indObj2].pos =
          new Vector(Math.random() * 100 - 50, Math.random() * 100 - 50);
      }
    }
    for (let i = 0; i < tentativaMapa.conectionsRep.length; i++) {
      let distSin = tentativaMapa.wordPlaces[
        tentativaMapa.conectionsRep[i].indObj1
      ].pos.sub(
        tentativaMapa.wordPlaces[tentativaMapa.conectionsRep[i].indObj2].pos
      );
      distSin = distSin.mag();
      distsTentativa += distSin * distSin;
    }
    if (distsTentativa < distsAtual) {
      mapa = tentativaMapa;
      distsAtual = distsTentativa;
    }
  }
}

document.addEventListener("keydown", async (event) => {
  const key = event.key;

  if (key === "t") {
    //Teste de mudar de cidade... Isto de certeza que vai dar fezes (De facto deu) -> Agora funciona
    indCidNome += 1;
    indCidNome = indCidNome % cidNome.length;

    const paragrafos = divMapTex.querySelectorAll("p");
    paragrafos.forEach((p) => p.remove());
    RepConeDestacadas.innerHTML = "";
    RepsConexPlaces.innerHTML = "";
    RepsWordPlaces.innerHTML = "";

    //Not working... Now its working :)
    //cidNome = "Diomira"; //Agora esta porcaria tem q ser variável...
    textoCidade = false;
    textoCidade = await carregarTexto("textos/" + cidNome[indCidNome] + ".txt");
    console.log(textoCidade);
    if (textoCidade) {
      const frases = textoCidade
        .split(/([.?! :;,/\n])/)
        .filter((parte) => parte !== " " && parte !== ""); //Ok já tenho o meu texto tratadinho e fofo...
      console.log(frases);

      mapa = new MapManeger(frases);
      mapa.popularLig();
      console.log(mapa.lig);
      titulo.textContent = cidNome[indCidNome];

      mapa.atuaLigPos();

      buscaEstruturaKindEv();

      //requestAnimationFrame(draw);
      //-------------------------------------------------------------------------------------------------
    } else {
      console.error(
        "Não foi possível iniciar o programa porque o texto não foi carregado."
      );
    }
  }
});

//Botoes
let svgSeta;
let svgPlay;
let svgPause;
let svgRefre;
const frontB = document.querySelector("#front-button");
const backB = document.querySelector("#back-button");
const ppB = document.querySelector("#play-pause-button");
const refreshB = document.querySelector("#refresh-button");

fetch("icons/Setinha.svg")
  .then((res) => res.text())
  .then((svgCodigo) => {
    svgSeta = svgCodigo;
    frontB.innerHTML = svgCodigo;
    backB.innerHTML = svgCodigo;
  });

fetch("icons/Play.svg")
  .then((res) => res.text())
  .then((svgCodigo) => {
    svgPlay = svgCodigo;
    ppB.innerHTML = svgCodigo;
  });
fetch("icons/Pause.svg")
  .then((res) => res.text())
  .then((svgCodigo) => {
    svgPause = svgCodigo;
  });

fetch("icons/Refresh.svg")
  .then((res) => res.text())
  .then((svgCodigo) => {
    svgRefre = svgCodigo;
    refreshB.innerHTML = svgCodigo;
  });

frontB.addEventListener("mousedown", async (event) => {
  indCidNome += 1;
  indCidNome = indCidNome % cidNome.length;

  const paragrafos = divMapTex.querySelectorAll("p");
  paragrafos.forEach((p) => p.remove());
  RepConeDestacadas.innerHTML = "";
  RepsConexPlaces.innerHTML = "";
  RepsWordPlaces.innerHTML = "";

  textoCidade = false;
  textoCidade = await carregarTexto("textos/" + cidNome[indCidNome] + ".txt");
  console.log(textoCidade);
  if (textoCidade) {
    const frases = textoCidade
      .split(/([.?! :;,/\n])/)
      .filter((parte) => parte !== " " && parte !== "");
    console.log(frases);

    mapa = new MapManeger(frases);
    mapa.popularLig();
    console.log(mapa.lig);
    titulo.textContent = cidNome[indCidNome];

    mapa.atuaLigPos();

    buscaEstruturaKindEv();
  } else {
    console.error(
      "Não foi possível iniciar o programa porque o texto não foi carregado."
    );
  }
});

backB.addEventListener("mousedown", async (event) => {
  indCidNome -= 1;
  if (indCidNome == -1) {
    indCidNome += cidNome.length;
  }

  const paragrafos = divMapTex.querySelectorAll("p");
  paragrafos.forEach((p) => p.remove());
  RepConeDestacadas.innerHTML = "";
  RepsConexPlaces.innerHTML = "";
  RepsWordPlaces.innerHTML = "";

  textoCidade = false;
  textoCidade = await carregarTexto("textos/" + cidNome[indCidNome] + ".txt");
  console.log(textoCidade);
  if (textoCidade) {
    const frases = textoCidade
      .split(/([.?! :;,/\n])/)
      .filter((parte) => parte !== " " && parte !== "");
    console.log(frases);

    mapa = new MapManeger(frases);
    mapa.popularLig();
    console.log(mapa.lig);
    titulo.textContent = cidNome[indCidNome];

    mapa.atuaLigPos();

    buscaEstruturaKindEv();
  } else {
    console.error(
      "Não foi possível iniciar o programa porque o texto não foi carregado."
    );
  }
});

ppB.addEventListener("mousedown", (event) => {
  if (modoFor) {
    ppB.innerHTML = svgPlay;
  } else {
    ppB.innerHTML = svgPause;
  }
  modoFor = !modoFor;
});

refreshB.addEventListener("mousedown", (event) => {
  for (let i = 0; i < mapa.wordPlaces.length; i++) {
    mapa.wordPlaces[i].pos = new Vector(
      Math.random() * 100 - 50,
      Math.random() * 100 - 50
    );
  }
  mapa.estabilizador();
});
