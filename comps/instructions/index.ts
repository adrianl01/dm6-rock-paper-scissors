import { Router } from "@vaadin/router"; import { state } from "../../src/state";

customElements.define("inst-el", class Instructions extends HTMLElement {
  connectedCallback() {
    console.log()
    const st = state.data
    if (st.ownerName == true) {
      st.gameStatus[0].player = st.playerName
      st.gameStatus[0].playerOnline = true
    }
    this.addDiv1(); this.addStyle();
    state.subscribe(() => {
      console.log("subscribe de instructions")
      if (st.ownerName == false) {
        st.gameStatus[0].rival = st.rivalName
        st.gameStatus[0].rivalOnline = true
      }
      console.log(st.gameStatus)
      const otherPlayerInfo = st.gameStatus as any
      if (st.gameStatus[0].player == "") {
        if (st.ownerName == false) {
          console.log(otherPlayerInfo);
          st.gameStatus[0].player = st.playerName
          st.gameStatus[0].playerOnline = otherPlayerInfo[0].playerOnline
          st.playerName = otherPlayerInfo[0].player
        }
      }

      if (st.gameStatus[0].rival == "") {
        if (st.ownerName == true) {
          console.log(otherPlayerInfo);
          st.gameStatus[0].rival = st.rivalName
          st.gameStatus[0].rivalOnline = otherPlayerInfo[0].rivalOnline
          st.rivalName = otherPlayerInfo[0].rival
        }
      }
      this.addHeader();
      const playerOnlineStatus = st.gameStatus[0].playerOnline
      const rivalOnlineStatus = st.gameStatus[0].rivalOnline
      if (rivalOnlineStatus == true) { this.addDiv2(); this.addStyle(); }
      if (st.ownerName == true && st.gameStatus[0].playerStatus == true) { this.addDiv3(); this.addStyle(); }
      if (st.ownerName == false && st.gameStatus[0].rivalStatus == true) { this.addDiv3(); this.addStyle(); }
      if (st.gameStatus[0].playerStatus == true && st.gameStatus[0].rivalStatus == true) { Router.go("/game") }
    })
    console.log(state.data.gameStatus[0]);
    if (state.data.playerName !== "") {
      state.pushGame(state.data.gameStatus);
      console.log("se ejecuta el pushGame");
    }
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
      console.log(playerPageName)
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
  }
  addDiv2() {
    console.log("addDiv2")
    const stonePicURL = require("url:../../piedra.svg"); const paperPicURL = require("url:../../papel.svg");
    const scissorsPicURL = require("url:../../tijera.svg");
    console.log(state.data.rivalName)
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
    this.firstChild.remove(); this.firstChild.remove(); div2.classList.add("inner-root"); this.appendChild(div2);
    this.addHeader();
    const boton = this.querySelector(".button") as HTMLButtonElement;
    boton.addEventListener("click", function (e) {
      e.preventDefault();
      const gameSttus = state.data.gameStatus;
      console.log(gameSttus);
      if (state.data.ownerName == true) { gameSttus[0].playerStatus = true };
      if (state.data.ownerName == false) { gameSttus[0].rivalStatus = true };
      state.pushGame(gameSttus);
    });
  }
  addDiv3() {
    console.log("addDiv3")
    const stonePicURL = require("url:../../piedra.svg"); const paperPicURL = require("url:../../papel.svg");
    const scissorsPicURL = require("url:../../tijera.svg");
    const div3 = document.createElement("div");
    div3.innerHTML = `
    <header class="header">
    <div class="players">
    <div class="player-points"></div>
    <div class="rival-points"></div>
    </div>
    <div class="room-id"><div>Sala</div>${state.data.roomId}</div>
    </header>
    <h3 class="title">Esperando a que ${state.data.gameStatus[0].rival} presione jugar...</h3>
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


