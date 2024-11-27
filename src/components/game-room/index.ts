import { Router } from "@vaadin/router";
import { state } from "../../pages/state";


customElements.define(
  "game-room-el",
  class Welcome extends HTMLElement {

    connectedCallback() {
      this.render();
      this.listeners();
    }
    listeners() {
      const form = this.querySelector(".form")
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.target as any
        const roomId = form.room.value;
        const rivalName = form.name.value;
        state.setRivalName(rivalName)
        state.data.roomId = roomId
        state.data.ownerName = false
        state.signUp();
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
      <form class="form" method="post">
      <label for="name" class="form-name__label">
      Tu Nombre
      <input type="text" class="game-room-input" name="name" id="name">
      </label>
      <fieldset class="fieldset">
      <input type="text" class="game-room-input" name="room" id="room">
      </fieldset>
      <button type="submit" class="game-room-button">Ingresar a la Sala</button>
      </form>
      <div class="hands">
          <img src=${stonePicURL} class="img">
          <img src=${paperPicURL} class="img">
          <img src=${scissorsPicURL} class="img">
      </div>
      `;
      // -------------------------------------------------------
      const style = document.createElement("style");
      style.textContent = `
            *{box-sizing: border-box;}
              body{margin: 0;}
        .inner-root {
            background-image: url(${backgroundURL});
            width: 100vw;height: 100vh;
            display: flex;align-items: center;
            flex-direction: column;justify-content: space-between;
      }      
      .title {
        margin: 0;text-align: center;color: #009048;
          font-family: 'Courier Prime', monospace;
          font-size: 70px;font-style: normal;font-weight: 1000;
        }      
        .form {
            display: flex;flex-direction: column;
            align-items: center;gap: 10px;
        }
        .fieldset {border: none;margin: 0;padding: 0;}
        .form-name__label {
            font-family: 'Odibee Sans'; text-align: center;
            display: flex; flex-direction: column;
            gap: 5px; font-size: 45px;
        }
      .game-room-button{
          width: 332px;height: 67px;
          border-radius: 10px;
          border: 10px solid #001997;
          background: #006CFC;color: aliceblue;
          
          color: #D8FCFC;
          text-align: center;
          font-family: 'Odibee Sans';
          font-size: 45px;font-style: normal;
          font-weight: 400;line-height: normal;
          letter-spacing: 2.25px;
        }        
      .game-room-input{
          width: 292px;height: 57px;border-radius: 10px;
          border: 10px solid #001997;background: #006CFC;
          color: aliceblue;
          
          color: #D8FCFC;text-align: center;font-family: 'Odibee Sans';
          font-size: 35px;font-style: normal;font-weight: 400;
          line-height: normal;letter-spacing: 2.25px;
        }        
      .hands {
        min-width: 70vw;display: flex;
        justify-content: space-between;
      }      
      .button:hover {background: #00449d;}      
      .button:active {background: #009048;}
      `;
      // ----------------------------------------------------------       
      div.classList.add("inner-root"); this.appendChild(div); this.appendChild(style);
    }
  }
);

