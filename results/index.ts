import { state } from "../src/state";
function result() {
    customElements.define("results-el", class Results extends HTMLElement {
        connectedCallback() { this.render(); this.points(); }
        points() {
            console.log("points de result");
            const pointsStone = [{ hand: "stone", result: "Empate😁" }, { hand: "paper", result: "Perdiste🙃" }, { hand: "scissors", result: "Ganaste!😃" }];
            const pointsPaper = [{ hand: "stone", result: "Ganaste!😃" }, { hand: "paper", result: "Empate😁" }, { hand: "scissors", result: "Perdiste🙃" }];
            const pointsScissors = [{ hand: "stone", result: "Perdiste🙃" }, { hand: "paper", result: "Ganaste!😃" }, { hand: "scissors", result: "Empate😁" }];
            let rivalResult; let playerResult;
            if (state.data.ownerName == true) {
                playerResult = state.data.gameStatus.hands.player;
                rivalResult = state.data.gameStatus.hands.rival;
            } else if (state.data.ownerName == false) {
                playerResult = state.data.gameStatus.hands.rival;
                rivalResult = state.data.gameStatus.hands.player;
            };
            if (playerResult == "stone") {
                for (const r of pointsStone) {
                    if (r.hand == rivalResult) {
                        const finalText = r.result;
                        const windowResEl = this.querySelector(".window__result");
                        windowResEl.textContent = finalText;
                    }
                }
            };
            if (playerResult == "paper") {
                for (const r of pointsPaper) {
                    if (r.hand == rivalResult) {
                        const finalText = r.result;
                        const windowResEl = this.querySelector(".window__result");
                        windowResEl.textContent = finalText;
                    }
                }
            };
            if (playerResult == "scissors") {
                for (const r of pointsScissors) {
                    if (r.hand == rivalResult) {
                        const finalText = r.result;
                        const windowResEl = this.querySelector(".window__result");
                        windowResEl.textContent = finalText;
                    }
                }
            };
            const resultsTexts = this.querySelector(".window__result").textContent;
            const st = state.data;
            var player: number; var rival: number;
            console.log(st.playerNumber); console.log(st.rivalNumber);
            if (state.data.ownerName == true) { player = st.playerNumber; rival = st.rivalNumber; };
            if (state.data.ownerName == false) { rival = st.playerNumber; player = st.rivalNumber; };
            if (resultsTexts == "Ganaste!😃") {
                console.log(player);
                player++
                console.log("player", player)

            } else if (resultsTexts == "Perdiste🙃") {
                console.log(rival);
                rival++
                console.log("rival", rival)
            } else if (resultsTexts == "Empate😁") {
                var draw
                console.log("draw", draw)
            }
            if (state.data.ownerName == true) { st.playerNumber = player; st.rivalNumber = rival; };
            if (state.data.ownerName == false) { st.rivalNumber = player; st.playerNumber = rival; };
            console.log("cálculo de puntos")
            state.pushGame(state.data.gameStatus)
            let playerPoints: string; let rivalPoints: string;
            playerPoints = state.data.playerNumber.toString(), rivalPoints = state.data.rivalNumber.toString();
            const pointsRivalEl = this.querySelector(".points__rival");
            const pointsPlayerEl = this.querySelector(".points__player");

            if (state.data.ownerName == true) { pointsRivalEl.textContent = `Rival:${rivalPoints}`, pointsPlayerEl.textContent = `Vos:${playerPoints}` };
            if (state.data.ownerName == false) { pointsRivalEl.textContent = `Rival:${playerPoints}`, pointsPlayerEl.textContent = `Vos:${rivalPoints}` };
            // setTimeout(() => { console.log("roomCleaner result"); state.roomCleaner(); }, 3000);
        }
        render() {
            console.log("render results");
            const div = document.createElement("div");
            div.innerHTML = `                
                <div class="window__text">
                <div class="window__result"></div>                
                <div class="points__rival"></div>                
                <div class="points__player"></div>                
                </div>
                <button class="window__button">Reintentar</button>                      
                `
            const style = document.createElement("style");
            style.textContent = `
                .window {
                    backdrop-filter: blur(10px);
                    display: flex;
                    position: absolute;
                    color: red;
                    /* background-color: rgb(0, 0, 0); */
                    /* opacity: .4; */
                    top: 5%;
                    left: 5%;
                    right: 5%;
                    bottom: 5%;
                    text-align: center;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    font-family: 'Odibee Sans';
                    font-size:30px;
                    font-weight:600;
                    gap: 30px;
                    border: solid black
                }
                .window__button {
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
                `;
            div.classList.add("window");
            this.appendChild(div);
            this.appendChild(style);
            const button = this.querySelector(".window__button")
            button?.addEventListener("click", () => {
                const st = state.data; const status = st.ownerName;
                if (status) {
                    st.results = true;
                    st.gameStatus.playerOnline = false;
                    st.gameStatus.playerStatus = false;
                    st.gameStatus.hands.player = "",
                        state.pushGame(st.gameStatus);
                }
                if (status == false) {
                    st.results = true;
                    st.gameStatus.rivalOnline = false;
                    st.gameStatus.rivalStatus = false;
                    st.gameStatus.hands.rival = "",
                        state.pushGame(st.gameStatus);
                };
            });
        };
    });
}
export { result }
