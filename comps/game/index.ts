import { Router } from "@vaadin/router";
import { result } from "../../results";
type Hand = {
  player: string,
  rival: string,
  status: string
}
customElements.define(
  "game-el",
  class Game extends HTMLElement {
    hands: Hand = { player: "", rival: "paper", status: "" };
    connectedCallback() {
      this.render();
      this.timer();
    }
    render() {
      const stonePicURL = require("url:../../piedra.svg");
      const paperPicURL = require("url:../../papel.svg");
      const scissorsPicURL = require("url:../../tijera.svg");
      const backgroundURL = require("url:../../fondo.png");
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="window">
                <div class="window__text">Se te acabó el tiempo😨</div>
                <button class="window__button">Reintentar</button>
                </div>
                <div class="main-counter">
                <div class="circular-counter">
                <div class="circular-counter-2">
                <span class="number"></span>
                </div>
                </div>
                </div>
            <div class="hands">
            <button class="hands__button-stone"><div class="stone"><img src=${stonePicURL} class="img"></div></button>
            <button class="hands__button-paper"><div class="paper"><img src=${paperPicURL} class="img"></div></button>
            <button class="hands__button-scissors"><div class="scissors"><img src=${scissorsPicURL} class="img"></div></button>
            </div>
            `;
      const style = document.createElement("style");
      style.textContent = `
      * { box-sizing: border box; }
      body { margin: 0; }
        .window {
          backdrop-filter: blur(10px);
          display: none; position: absolute; color: black;
          /* background-color: rgb(0, 0, 0); */
          /* opacity: .4; */
          top: 5%; left: 5%; right: 5%; bottom: 5%;
          text-align: center; align-items: center; justify-content: center;
          flex-direction: column; font-family: 'Odibee Sans';
          font-size:30px; font-weight:600; gap: 30px; border: solid black
      }        
            .inner-root {                
              background-image: url(${backgroundURL});
              min-width: 375px; min-height: 667px; display: flex; align-items: center;
              flex-direction: column; justify-content: space-between;
          }
          .main-counter{ padding-top:125px; }
          .circular-counter {                 
            display:flex; align-items: center; justify-content: center;      
            width: 243px; height: 243px; align-items: center; border-radius:50%;
            background: conic-gradient(blue 3.6deg, red 0deg)            
          }
          .circular-counter-2{     
            display:flex; align-items: center; justify-content: center; text-align: center;   
            width:223px; height: 223px; border-radius:50%;
            background-color: white;
            background-image: url(${backgroundURL});
          }
          .number{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px; height: 100px;
            font-family: 'Odibee Sans';
            font-size:70px; font-weight:600;
          }
          .button,.window__button {
              width: 322px; height: 87px; border-radius: 10px;
              border: 10px solid #001997;
              background: #006CFC; color: aliceblue;
          
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
            min-width: 70vw;display: flex;justify-content: space-between;           
          }
          .hands__button-stone, .hands__button-paper, .hands__button-scissors {
            border:none;
          }
          .stone:active {width: 100px;height: 150px;            
          }          
          .paper:active {width: 100px;height: 150px;          
          }          
          .scissors:active {width: 100px;height: 150px;           
          }          
          `;
      div.classList.add("inner-root"); this.appendChild(div); this.appendChild(style);
    }
    timer() {
      const circularProgress = this?.querySelector(".circular-counter") as any;
      const progressValue = this?.querySelector(".number") as any;

      let progressStartValue = 4,
        progressEndValue = 0;
      let progress = setInterval(() => {
        progressStartValue--;
        if (progressStartValue == progressEndValue && this.hands.player == "") {
          const windowEl = this.querySelector(".window") as HTMLElement;
          windowEl.style.display = "flex"
          clearInterval(progress)

        } else if (progressStartValue == progressEndValue && this.hands.player !== "") {
          clearInterval(progress);
          this.hands.status = "ready"
          console.log(this.hands.status)
          console.log("se imprime si pasa el status en el timer")
          this.addHand()
        }
        progressValue.textContent = `${progressStartValue}`
        circularProgress.style.background = `conic-gradient(blue ${progressStartValue * 90}deg, red 0deg) `
      }, 1000)

      const stoneButton = this.querySelector(".hands__button-stone");
      stoneButton?.addEventListener("click", (e) => { this.hands.player = "stone" })
      const paperButton = this.querySelector(".hands__button-paper");
      paperButton?.addEventListener("click", (e) => { this.hands.player = "paper" })
      const scissorsButton = this.querySelector(".hands__button-scissors");
      scissorsButton?.addEventListener("click", (e) => { this.hands.player = "scissors" })
      const windowButton = this.querySelector(".window__button");
      windowButton?.addEventListener("click", () => { Router.go("/instructions") })
    }
    addHand() {
      console.log("addHand")
      this.firstChild.remove()
      this.firstChild.remove()
      const stonePicURL = require("url:../../piedra.svg");
      const paperPicURL = require("url:../../papel.svg");
      const scissorsPicURL = require("url:../../tijera.svg");
      const backgroundURL = require("url:../../fondo.png");
      var img = {}; var classEl = {}
      var rivalImg = {}; var rivalClassEl = {}
      if (this.hands.player == "stone") { img = stonePicURL; classEl = "stone" }
      if (this.hands.player == "paper") { img = paperPicURL; classEl = "paper" }
      if (this.hands.player == "scissors") { img = scissorsPicURL; classEl = "scissors" }
      if (this.hands.rival == "stone") { rivalImg = stonePicURL; rivalClassEl = "rival-stone" }
      if (this.hands.rival == "paper") { rivalImg = paperPicURL; rivalClassEl = "rival-paper" }
      if (this.hands.rival == "scissors") { rivalImg = scissorsPicURL; rivalClassEl = "rival-scissors" }

      const div = document.createElement("div");
      div.innerHTML = `
      <div class="hands">
      <div class="rival-hand"><img src=${rivalImg} class=${rivalClassEl}></div>
      <div class="player-hand"><img src=${img} class=${classEl}></div>
      </div>           
      <results-el></results-el>       
  `;
      const style = document.createElement("style");
      style.textContent = `
      * { box-sizing: border box; }
      body { margin: 0; }
.inner-root {                
    background-image: url(${backgroundURL});
    min-width: 375px; min-height: 667px; display: flex; align-items: center; flex-direction: column;
    justify-content: space-between;
  }
.hands{
  min-width: 375px; min-height: 667px; display: flex; flex-direction: column; justify-content:space-between;
  align-items: center;
  }
.rival-hand { display: flex; align-items: center; justify-content: center; min-width: 375px; }
.${rivalClassEl} { width: 180px; height: 280px; text-align: center; transform: rotate(180deg); }
.player-hand { display: flex; align-items: center; justify-content: center; min-width: 375px; }
.${classEl} { text-align: center; width: 180px; height: 280px; }        
`;
      div.classList.add("inner-root"); this.appendChild(div); this.appendChild(style);
      setTimeout(() => { result() }, 3000)
    }
  }
);

