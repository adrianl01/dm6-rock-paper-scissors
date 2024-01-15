import { Router } from "@vaadin/router"; import { state } from "../../src/state";
type GameStatus = [{
  player: string,
  playerOnline: boolean,
  rival: string,
  rivalOnline: boolean
}];
customElements.define("inst-el", class Instructions extends HTMLElement {
  gameStatus: GameStatus[] = [];
  connectedCallback() {
    this.render();
    state.subscribe(() => {
      state.data.playerName
      state.pushGame(this.gameStatus)
    })
  }
  render() {
    var playerPageName; var rivalPageName; var playerPoints; var rivalPoints;
    const st = state.data
    if (st.ownerName) {
      playerPageName = st.playerName; rivalPageName = st.rivalName;
      playerPoints = st.playerNumber; rivalPoints = st.rivalNumber;
    } else if (st.ownerName == false) {
      playerPageName = st.rivalName; rivalPageName = st.playerName
      playerPoints = st.rivalNumber; rivalPoints = st.playerNumber;
    }
    const stonePicURL = require("url:../../piedra.svg"); const paperPicURL = require("url:../../papel.svg");
    const scissorsPicURL = require("url:../../tijera.svg"); const backgroundURL = require("url:../../fondo.png");
    const div1 = document.createElement("div");
    div1.innerHTML = `
      <header class="header">
        <div class="players">
        <div class="player-points">${playerPageName}:${playerPoints}</div>
        <div class="rival-points">${rivalPageName}:${rivalPoints}</div>
        </div>
        <div class="room-id"><div>Sala</div>${state.data.roomId}</div>
      </header>
          <h3 class="title">Compartí el código ${state.data.roomId} con tu contrincante</h3>
          <div class="hands">
          <img src=${stonePicURL} class="img">
          <img src=${paperPicURL} class="img">
          <img src=${scissorsPicURL} class="img">
          </div>
          `;
    const div2 = document.createElement("div");
    div2.innerHTML = `
    <header class="header">
    <div class="players">
    <div class="player-points">${playerPageName}:${playerPoints}</div>
    <div class="rival-points">${rivalPageName}:${rivalPoints}</div>
    </div>
    <div class="room-id"><div>Sala</div>${st.roomId}</div>
    </header>
    <h3 class="title">Presioná Jugar y elegí piedra, papel o tijera antes de que pasen los 3 segundos</h3>
    <button class="button">¡Jugar!</button>
    <div class="hands">
    <img src=${stonePicURL} class="img">
    <img src=${paperPicURL} class="img">
    <img src=${scissorsPicURL} class="img">
    </div>
    `;
    const style = document.createElement("style");
    style.textContent = `
      *{box-sizing: border-box;}
      body{margin: 0;}
          .inner-root {
            background-image: url(${backgroundURL});
            min-width: 100vw;height: 100vh;
            display: flex;align-items: center;text-align: center;
            flex-direction: column;justify-content: space-between;
        }        
        .header {
          display: flex; justify-content: space-between;
          font-family: 'Courier Prime', monospace;width:100vw;
          font-size: 20px; padding: 15px 25px;
        }
        .players {text-align: start}
        .rival-points {color: darkblue}
        .room-id {text-align: end}
        .title {
            color: #000;text-align: center;font-family: 'Courier Prime', monospace;
            font-size: 40px;font-style: normal;font-weight: 600;
            line-height: 100%; /* 40px */
        }        
        .button {
            width: 322px;height: 87px;border-radius: 10px;border: 10px solid #001997;
            background: #006CFC;color: aliceblue;color: #D8FCFC;
            text-align: center;font-family: 'Odibee Sans';
            font-size: 45px;font-style: normal;font-weight: 400;
            line-height: normal;letter-spacing: 2.25px;
        }        
        .hands { min-width: 70vw; display: flex;justify-content: space-between; }        
        .button:hover { background: #00449d; }        
        .button:active { background: #009048; }
        `;
    div1.classList.add("inner-root"); this.appendChild(div1); this.appendChild(style);
    const div3 = document.createElement("div");
    div3.innerHTML = `
    <header class="header">
    <div class="players">
    <div class="player-points">${playerPageName}:${playerPoints}</div>
    <div class="rival-points">${rivalPageName}:${rivalPoints}</div>
    </div>
    <div class="room-id"><div>Sala</div>${st.roomId}</div>
    </header>
    <h3 class="title">Esperando a que ${rivalPageName} presione jugar...</h3>
    <div class="hands">
    <img src=${stonePicURL} class="img">
    <img src=${paperPicURL} class="img">
    <img src=${scissorsPicURL} class="img">
    </div>        
    `;
    if (state.data.rivalName !== "") {
      console.log(st.rivalName)
      console.log(this.firstChild)
      this.firstChild.remove(); div2.classList.add("inner-root"); this.appendChild(div2);
      const boton = this.querySelector(".button") as HTMLButtonElement;
      boton.addEventListener("click", function (e) {
        e.preventDefault();
        Router.go("/game");
      });
    };
  }
}
);


