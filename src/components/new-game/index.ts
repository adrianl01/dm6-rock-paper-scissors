import { Router } from "@vaadin/router";
import { state } from "../../pages/state";
customElements.define(
    "new-game-el",
    class Welcome extends HTMLElement {
        connectedCallback() {
            this.render(); this.listeners();
        }
        listeners() {
            const form = this.querySelector(".form")
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const form = e.target as any
                const playerName = form.name.value;
                state.setPlayerName(playerName);
                state.data.ownerName = true;
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
      <fieldset class="fieldset">
      <label for="name" class="form-name__label">
      Tu Nombre
      <input type="text" class="new-game-input" name="name" id="name">
  </label>
      </fieldset>
      <button type="submit" class="new-room-button">Nueva Sala</button>
      </form>
      <div class="hands">
          <img src=${stonePicURL} class="img">
          <img src=${paperPicURL} class="img">
          <img src=${scissorsPicURL} class="img">
      </div>
      <rooms-el></rooms-el>
      `;
            const style = document.createElement("style");
            style.textContent = `
            *{ box-sizing: border box;}
              body{ margin: 0; }
        .inner-root {
            font-family: 'Odibee Sans';
            background-image: url(${backgroundURL});
            min-width: 375px; height: 667px;
            display: flex; align-items: center;
            flex-direction: column;
          justify-content: space-between;
      }      
      .title {
          text-align: center; margin-top: 70px;
          color: #009048; font-family: 'Courier Prime', monospace;
          font-size: 70px; font-style: normal; font-weight: 1000;
        }      
        .form {
            display: flex; flex-direction: column;
            align-items: center; gap: 10px;
        }
        .fieldset {
            border: none;
            margin: 0; padding: 0;
            text-align: center;
        }
        .form-name__label {
            display: flex; flex-direction: column;
            gap: 5px; font-size: 45px;
        }
      .new-room-button{
          width: 302px; height: 67px; border-radius: 10px;
          border: 10px solid #001997; background: #006CFC; color: aliceblue;  
          color: #D8FCFC; text-align: center; font-family: 'Odibee Sans';
          font-size: 45px; font-style: normal; font-weight: 400;
          line-height: normal; letter-spacing: 2.25px;
        }        
      .new-game-input{
          width: 292px; height: 57px; border-radius: 10px;
          border: 10px solid #001997; background: #006CFC; color: aliceblue;  
          color: #D8FCFC; text-align: center; font-family: 'Odibee Sans';  font-size: 35px;
          font-style: normal; font-weight: 400; line-height: normal; letter-spacing: 2.25px;
        }        
      .hands {min-width: 70vw;display: flex; justify-content: space-between;  }      
      .button:hover {  background: #00449d; }      
      .button:active {  background: #009048; }
      `;
            div.classList.add("inner-root"); this.appendChild(div); this.appendChild(style);
            const boton = this.querySelector(".welcome-button");
            boton?.addEventListener("click", function () {
                Router.go("/instructions");
            });
        }
    }
);
