import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialBoard(5);
  }

  // Initializează tabla de joc cu o dimensiune dată
  initialBoard = (size) => {
    let state = {
      boardSize: size,
      numRed: 0,
      numBlue: 0,
      turn: "red",
      winMessage: "",
      lineCoordinates: {},
      boxColors: {},
    };

    // primu 0 sau 1 inseama: 0=orizontala  ; 1 verticala
    // lineCoordinates = {
    //   '0,0,0': 1,    // 1= rosu
    //   '1,0,0': -1,     // -1=albastru
    //   '0,1,0': 0,     
    //   '1,1,0': 0,
    // };





    // Initializează coordonatele liniilor pentru fiecare casetă cu 0
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < state.boardSize + 1; j++) {
        for (let k = 0; k < state.boardSize; k++) {
          state.lineCoordinates[i + "," + j + "," + k] = 0;
        }
      }
    }

    // Initializează culorile casetelor cu negru  
    for (let i = 0; i < state.boardSize; i++) {
      for (let j = 0; j < state.boardSize; j++) {
        state.boxColors[i + "," + j] = "rgb(0,0,0)";
      }
    }

    return state;
  }

  // Metoda apelată când utilizatorul completează o linie
  fillLine = (event) => {
    var currentCoord = event.target.dataset.coord;

    // Verifică dacă linia este liberă (nu a fost completată încă)
    if (this.state.lineCoordinates[currentCoord] === 0) {
      let newState = this.state.lineCoordinates;

      // Actualizează starea cu noua linie, adică marchează linia cu culorile roșu sau albastru
      newState[currentCoord] = this.state.turn === "red" ? 1 : -1;

      this.setState(prevState => ({
        lineCoordinates: newState,
      }));

      // Extrage coordonatele liniilor pentru a determina dacă o casetă a fost completată
      var splitCoord = currentCoord.split(',');
      var i = splitCoord[0];
      var j = splitCoord[1];
      var k = splitCoord[2];

      let newBoxColors = this.state.boxColors;
      var madeSquare = 0;

      // Verifică dacă completarea liniei a format o casetă
      if (i === "0") {
        if (this.checkSquare(j, k) === 4) {
          madeSquare = 1;

          // Actualizează culoarea casetei corespunzătoare cu culorile roșu sau albastru semi-transparente
          newBoxColors[j + ',' + k] = (this.state.turn === "red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)";
          this.setState((prevState) => ({
            numRed: (prevState.turn === "red") ? prevState.numRed + 1 : prevState.numRed,
            numBlue: (prevState.turn === "blue") ? prevState.numBlue + 1 : prevState.numBlue,
            boxColors: newBoxColors,
          }));
        }
        // Verifică și liniile adiacente pentru a vedea dacă se completează o casetă
        if (this.checkSquare(parseFloat(j) - 1, k) === 4) {
          madeSquare = 1;

          // Actualizează culoarea casetei corespunzătoare cu culorile roșu sau albastru semi-transparente
          newBoxColors[(parseFloat(j) - 1) + ',' + k] = (this.state.turn === "red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)";
          this.setState((prevState) => ({
            numRed: (prevState.turn === "red") ? prevState.numRed + 1 : prevState.numRed,
            numBlue: (prevState.turn === "blue") ? prevState.numBlue + 1 : prevState.numBlue,
            boxColors: newBoxColors,
          }));
        }
      } else {
        if (this.checkSquare(k, j) === 4) {
          madeSquare = 1;

          // Actualizează culoarea casetei corespunzătoare cu culorile roșu sau albastru semi-transparente
          newBoxColors[k + ',' + j] = (this.state.turn === "red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)";
          this.setState((prevState) => ({
            numRed: (prevState.turn === "red") ? prevState.numRed + 1 : prevState.numRed,
            numBlue: (prevState.turn === "blue") ? prevState.numBlue + 1 : prevState.numBlue,
            boxColors: newBoxColors,
          }));
        }
        // Verifică și liniile adiacente pentru a vedea dacă se completează o casetă
        if (this.checkSquare(k, parseFloat(j) - 1) === 4) {
          madeSquare = 1;

          // Actualizează culoarea casetei corespunzătoare cu culorile roșu sau albastru semi-transparente
          newBoxColors[k + ',' + (parseFloat(j) - 1)] = (this.state.turn === "red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)";
          this.setState((prevState) => ({
            numRed: (prevState.turn === "red") ? prevState.numRed + 1 : prevState.numRed,
            numBlue: (prevState.turn === "blue") ? prevState.numBlue + 1 : prevState.numBlue,
            boxColors: newBoxColors,
          }));
        }
      }

      // Verifică dacă s-a completat o casetă sau nu, pentru a schimba tura
      if (madeSquare === 0) {
        this.setState((prevState) => ({
          turn: prevState.turn === "red" ? "blue" : "red",
        }));
      } else {
        // Dacă s-a completat o casetă, verifică dacă jocul s-a încheiat
        this.checkGameOver();
      }
    }
  }

  // Verifică dacă o casetă este completată, primind coordonatele casetei
  checkSquare = (j, k) => {
    var checker1 = Math.abs(this.state.lineCoordinates['0,' + j + ',' + k]);
    var checker2 = Math.abs(((parseFloat(j) + 1)) > this.state.boardSize ? 0 : this.state.lineCoordinates['0,' + (parseFloat(j) + 1) + ',' + k]);
    var checker3 = Math.abs(this.state.lineCoordinates['1,' + k + ',' + j]);
    var checker4 = Math.abs(((parseFloat(k) + 1)) > this.state.boardSize ? 0 : this.state.lineCoordinates['1,' + (parseFloat(k) + 1) + ',' + j]);
    return checker1 + checker2 + checker3 + checker4;


   // checker1 reprezintă starea liniei orizontale de sus: poate fi 1, -1 sau 0.
   // checker2 reprezintă starea liniei orizontale de jos: poate fi 1, -1 sau 0.
   //  checker3 reprezintă starea liniei verticale din stânga: poate fi 1, -1 sau 0.
   //  checker4 reprezintă starea liniei verticale din dreapta: poate fi 1, -1 sau 0.

   //checkerX=1  => linia este rosie
   //checkerX=-1  => linia este albastra
   // checkerX=0   => linia nu a fost desenata
  }

  // Verifică dacă jocul s-a încheiat
  checkGameOver = () => {
    this.setState((prevState) => ({
      winMessage: (prevState.numRed + prevState.numBlue === prevState.boardSize ** 2) ? this.makeWinMessage(prevState) : "",
    }));
  }

  // Generează mesajul câștigătorului sau mesajul de remiză
  makeWinMessage = (state) => {
    var winMessage;
    if (state.numRed > state.numBlue) {
      winMessage = "Rosu castiga! ";
    } else if (state.numRed < state.numBlue) {
      winMessage = "Albastru castiga! ";
    } else {
      winMessage = "Egalitate! ";
    }
    return winMessage;
  }

  // Metoda apelată când utilizatorul dorește să înceapă un joc nou
  restartGame = () => {
    if (window.confirm('Sigur?')) {
      this.setState(this.initialBoard(this.state.boardSize));
    }
  }

  // Returnează culoarea corespunzătoare valorii date (0 - alb, 1 - roșu, -1 - albastru)
  selectColor = (int) => {
    if (int === 0) {
      return "rgb(255, 255, 255)";
    } else if (int === 1) {
      return "rgb(255,0,0)";
    } else if (int === -1) {
      return "rgb(0,0,255)";
    }
  }

  // Metodele pentru hover-ul pe liniile jocului pentru a le evidenția în funcție de tura curentă
  tint = (event) => {
    var currentCoord = event.target.dataset.coord;
    if (this.state.lineCoordinates[currentCoord] === 0) {
      if (this.state.turn === "red") {
        event.target.style.backgroundColor = "rgba(255,0,0,0.5)";
      } else {
        event.target.style.backgroundColor = "rgba(0,0,255,0.5)";
      }
    }
  }

  untint = (event) => {
    var currentCoord = event.target.dataset.coord;
    if (this.state.lineCoordinates[currentCoord] === 0) {
      event.target.style.backgroundColor = "rgb(255,255,255)";
    }
  }

  // Creează tabla de joc cu liniile și casetele corespunzătoare
  makeBoard = (boardSize) => {
    var cols = [];
    for (let i = 0; i <= 2 * boardSize; i++) {
      var row = [];
      for (let j = 0; j <= 2 * boardSize; j++) {
        if (i % 2 === 0) {
          if (j % 2 === 0) {
            row.push(React.createElement("div", {
              className: "dot",
              id: "dot" + Math.floor(i / 2) + "," + Math.floor(j / 2),
            }, ""));
          } else {
            row.push(React.createElement("div", {
              className: "horizContainer",
              "data-coord": "0," + Math.floor(i / 2) + "," + Math.floor(j / 2),
              onClick: this.fillLine,
              style: { backgroundColor: this.selectColor(this.state.lineCoordinates["0," + Math.floor(i / 2) + "," + Math.floor(j / 2)]), },
              onMouseEnter: this.tint,
              onMouseLeave: this.untint,
            }, ""));
          }
        } else {
          if (j % 2 === 0) {
            row.push(React.createElement("div", {
              className: "vertContainer",
              "data-coord": "1," + Math.floor(j / 2) + "," + Math.floor(i / 2),
              onClick: this.fillLine,
              style: { backgroundColor: this.selectColor(this.state.lineCoordinates["1," + Math.floor(j / 2) + "," + Math.floor(i / 2)]), },
              onMouseEnter: this.tint,
              onMouseLeave: this.untint,
            }, ""));
          } else {
            row.push(React.createElement("div", {
              className: "box",
              id: "box" + Math.floor(i / 2) + ',' + Math.floor(j / 2),
              style: { backgroundColor: this.state.boxColors[Math.floor(i / 2) + ',' + Math.floor(j / 2)] },
            }, ""));
          }
        }
      }
      cols.push(React.createElement("div", { className: "row" }, row));
    }

    return (React.createElement("div", { id: "game-board" }, cols));
  }

  render() {
    return (
      <div id="game" className="centerContainer">
        <div id="header">
          <h1 id="welcome">Puncte si Cutii</h1>
          <p id="score"> Rosu: {this.state.numRed} Albastru: {this.state.numBlue} </p>
          {/* Buton pentru resetarea jocului */}
          <button onClick={this.restartGame}>Restart</button>
          <p id="winner"> {this.state.winMessage} </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          {this.makeBoard(this.state.boardSize)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
