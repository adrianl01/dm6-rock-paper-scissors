import { Router } from "@vaadin/router";

customElements.define(
  "welc-el",
  class Welcome extends HTMLElement {
    connectedCallback() {
      this.render();
      this.listeners();
    }
    listeners() {
      const buttonNewGame = this.querySelector(".new-game-button") as HTMLElement
      buttonNewGame.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/newgame")
      })
      const buttonNewRoom = this.querySelector(".new-room-button") as HTMLElement
      buttonNewRoom.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/gameroom")
      })
    }
    render() {
      const stonePicURL = require("url:../../piedra.svg");
      const paperPicURL = require("url:../../papel.svg");
      const scissorsPicURL = require("url:../../tijera.svg");
      const backgroundURL = require("url:../../fondo.png");
      // -----------------------------------------------------
      const div = document.createElement("div");
      div.innerHTML = `
      <h1 class="title">Piedra Papel ó Tijera</h1>
      <button type="button" class="new-game-button">Nuevo Juego</button>
      <button type="button" class="new-room-button">Igresar a una Sala</button>
      <div class="hands">
          <img src=${stonePicURL} class="img">
          <img src=${paperPicURL} class="img">
          <img src=${scissorsPicURL} class="img">
      </div>
      `;
      // -------------------------------------------------------
      const style = document.createElement("style");
      style.textContent = `
      *{
        box-sizing: border box;
      }
      body{
        margin: 0;
      }
        .inner-root {
            background-image: url(${backgroundURL});
            min-width: 375px;
            height: 667px;
            display: flex;
            align-items: center;
            flex-direction: column;
          justify-content: space-between;
      }      
      .title {
          text-align: center;
          margin-top: 70px;
          color: #009048;
          font-family: 'Courier Prime', monospace;
          font-size: 70px;
          font-style: normal;
          font-weight: 1000;
        }      
      .new-game-button, .new-room-button{
          width: 322px;
          height: 87px;
          border-radius: 10px;
          border: 10px solid #001997;
          background: #006CFC;
          color: aliceblue;
          
          color: #D8FCFC;
          text-align: center;
          font-family: 'Odibee Sans';
          font-size: 45px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: 2.25px;
        }        
      .hands {
        min-width: 70vw;
        display: flex;
        justify-content: space-between;
      }      
      .button:hover {
          background: #00449d;
        }      
      .button:active {
          background: #009048;
      }
      `;
      // ----------------------------------------------------------       
      div.classList.add("inner-root");
      this.appendChild(div);
      this.appendChild(style);
      const boton = this.querySelector(".welcome-button");
      boton?.addEventListener("click", function () {
        Router.go("/instructions");
      });
    }
  }
);

