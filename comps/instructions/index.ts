import { Router } from "@vaadin/router";

customElements.define(
  "inst-el",
  class Welcome extends HTMLElement {
    connectedCallback() {
      this.render();
      this.listeners();
    }

    listeners() {

    }
    render() {
      const stonePicURL = require("url:../../piedra.svg");
      const paperPicURL = require("url:../../papel.svg");
      const scissorsPicURL = require("url:../../tijera.svg");
      const backgroundURL = require("url:../../fondo.png");
      const div = document.createElement("div");
      div.innerHTML = `
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
      *{
        box-sizing: border box;
      }
      body{
        margin: 0;
      }
          .inner-root {
            background-image: url(${backgroundURL});
            min-width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            text-align: center;
            flex-direction: column;
            justify-content: space-between;
        }        
        .title {
            color: #000;
            text-align: center;
            font-family: 'Courier Prime', monospace;
            font-size: 40px;
            font-style: normal;
            font-weight: 600;
            line-height: 100%; /* 40px */
        }        
        .button {
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
      div.classList.add("inner-root");
      this.appendChild(div);
      this.appendChild(style);
      const boton = this.querySelector(".button") as HTMLButtonElement;
      boton.addEventListener("click", function (e) {
        e.preventDefault();
        Router.go("/game");
      });
    }
  }
);


