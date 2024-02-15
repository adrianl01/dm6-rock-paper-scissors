import { Router } from "@vaadin/router"; import { state } from "../../src/state";

customElements.define("inst-el", class Instructions extends HTMLElement {
  connectedCallback() {
    const st = state.data;
    if (st.ownerName == true) {
      st.gameStatus.player = st.playerName;
      st.gameStatus.playerOnline = true;
      if (st.gameStatus.rivalOnline == true) { st.gameStatus.rivalOnline = false };
      state.pushGame(st.gameStatus)
    }
    if (st.ownerName == false) {
      st.gameStatus.rival = st.rivalName
      st.gameStatus.rivalOnline = true
      // state.pushGame(st.gameStatus)
    }
    this.addStyle(); this.addDiv1();
    if (st.gameStatus.playerOnline && st.gameStatus.rivalOnline) { this.addDiv2(); this.addStyle(); }
    state.subscribe(() => {
      console.log("subscribe de instructions")
      const otherPlayerInfo = st.gameStatus as any
      if (st.ownerName == false) {
        if (st.gameStatus.player == "") { st.gameStatus.player = st.playerName }
        st.gameStatus.playerOnline = otherPlayerInfo.playerOnline
        st.playerName = otherPlayerInfo.player
      }
      if (st.ownerName == true) {
        if (st.gameStatus.rival == "") { st.gameStatus.rival = st.gameStatus.rival };
        st.gameStatus.rivalOnline = otherPlayerInfo.rivalOnline;
        st.rivalName = otherPlayerInfo.rival;
      };
      if (location.pathname == "/instructions") {
        this.addHeader();
        console.log(st.gameStatus.playerStatus)
        const rivalOnlineStatus = st.gameStatus.rivalOnline;
        if (rivalOnlineStatus == true) { console.log(rivalOnlineStatus); this.addDiv2(); this.addStyle(); }
        if (st.ownerName == true && st.gameStatus.playerStatus == true) { this.addDiv3(); this.addStyle(); }
        if (st.ownerName == false && st.gameStatus.rivalStatus == true) { this.addDiv3(); this.addStyle(); }
        if (st.gameStatus.playerStatus == true && st.gameStatus.rivalStatus == true) {
          Router.go("/game"); console.log("Se ejecuta el /game")
        }
      } else { };
    })
    if (state.data.ownerName == false && state.data.playerName !== "") { state.pushGame(state.data.gameStatus) }
  }
  addHeader() {
    console.log("addHeader")
    const palyerEl = this.querySelector(".player-points")
    const rivalEl = this.querySelector(".rival-points")
    var playerPageName; var rivalPageName; var playerPoints; var rivalPoints;
    const st = state.data
    console.log(st)
    playerPageName = st.playerName; rivalPageName = st.rivalName;
    playerPoints = st.playerNumber; rivalPoints = st.rivalNumber;
    console.log(playerPageName)
    console.log(rivalPageName)
    if (st.ownerName) {
      palyerEl.innerHTML = `${playerPageName}:${playerPoints}`;
      rivalEl.innerHTML = `${rivalPageName}:${rivalPoints}`
    } else if (st.ownerName == false) {
      rivalEl.innerHTML = `${playerPageName}:${playerPoints}`;
      palyerEl.innerHTML = `${rivalPageName}:${rivalPoints}`
    }
  }
  addStyle() {
    const backgroundURL = require("url:../../fondo.png");
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
    this.appendChild(style);
  }
  addDiv1() {
    console.log("addDiv1")
    const stonePicURL = require("url:../../piedra.svg"); const paperPicURL = require("url:../../papel.svg");
    const scissorsPicURL = require("url:../../tijera.svg");
    const div1 = document.createElement("div");
    div1.innerHTML = `
      <header class="header">
        <div class="players">
        <div class="player-points"></div>
        <div class="rival-points"></div>
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
    div1.classList.add("inner-root"); this.appendChild(div1);
    this.addHeader();
    // if (state.data.ownerName == false) { if (state.data.gameStatus.playerOnline) { this.addDiv2(); } }
  }
  addDiv2() {
    console.log("addDiv2")
    const stonePicURL = require("url:../../piedra.svg"); const paperPicURL = require("url:../../papel.svg");
    const scissorsPicURL = require("url:../../tijera.svg");
    const div2 = document.createElement("div");
    div2.innerHTML = `
    <header class="header">
    <div class="players">
    <div class="player-points"></div>
    <div class="rival-points"></div>
    </div>
    <div class="room-id"><div>Sala</div>${state.data.roomId}</div>
    </header>
    <h3 class="title">Presioná Jugar y elegí piedra, papel o tijera antes de que pasen los 3 segundos</h3>
    <button class="button">¡Jugar!</button>
    <div class="hands">
    <img src=${stonePicURL} class="img">
    <img src=${paperPicURL} class="img">
    <img src=${scissorsPicURL} class="img">
    </div>
    `;
    console.log(this.childNodes.length);
    if (this.childNodes.length > 0) { this.firstChild.remove(); this.firstChild.remove(); }
    div2.classList.add("inner-root"); this.appendChild(div2);
    this.addHeader();
    const boton = this.querySelector(".button") as HTMLButtonElement;
    boton.addEventListener("click", function (e) {
      e.preventDefault();
      const gameSttus = state.data.gameStatus;
      if (state.data.ownerName == true) { gameSttus.playerStatus = true };
      if (state.data.ownerName == false) { gameSttus.rivalStatus = true };
      state.pushGame(gameSttus)
    });
  }
  addDiv3() {
    console.log("addDiv3")
    const stonePicURL = require("url:../../piedra.svg"); const paperPicURL = require("url:../../papel.svg");
    const scissorsPicURL = require("url:../../tijera.svg");
    const div3 = document.createElement("div");
    let player
    if (state.data.ownerName == true) { player = state.data.gameStatus.rival }
    if (state.data.ownerName == false) { player = state.data.gameStatus.player }
    div3.innerHTML = `
    <header class="header">
    <div class="players">
    <div class="player-points"></div>
    <div class="rival-points"></div>
    </div>
    <div class="room-id"><div>Sala</div>${state.data.roomId}</div>
    </header>
    <h3 class="title">Esperando a que ${player} presione jugar...</h3>
    <div class="hands">
    <img src=${stonePicURL} class="img">
    <img src=${paperPicURL} class="img">
    <img src=${scissorsPicURL} class="img">
    </div>        
    `;
    this.firstChild.remove(); this.firstChild.remove(); div3.classList.add("inner-root"); this.appendChild(div3);
    this.addHeader();
  }
}
);


