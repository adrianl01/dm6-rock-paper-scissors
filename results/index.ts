import { state } from "../src/state";

function result() {
    customElements.define("results-el", class Results extends HTMLElement {
        connectedCallback() { this.points(); this.render(); }
        points() {
            const pointsStone = [{ hand: "stone", result: "Empate😁" }, { hand: "paper", result: "Perdiste🙃" }, { hand: "scissors", result: "Ganaste!😃" }]
            const pointsPaper = [{ hand: "stone", result: "Ganaste!😃" }, { hand: "paper", result: "Empate😁" }, { hand: "scissors", result: "Perdiste🙃" }]
            const pointsScissors = [{ hand: "stone", result: "Perdiste🙃" }, { hand: "paper", result: "Ganaste!😃" }, { hand: "scissors", result: "Empate😁" }]
            function resultsText() {
                const rivalResult = state.data.rivalNumber
                const playerResult = state.data.playerNumber
                if (playerResult == "stone") {
                    for (const r of pointsStone) {
                        if (r.hand == rivalResult) {
                            const finalText = r.result
                            return finalText
                        }
                    }
                }
                if (playerResult == "paper") {
                    for (const r of pointsPaper) {
                        if (r.hand == rivalResult) {
                            const finalText = r.result
                            return finalText
                        }
                    }
                }
                if (playerResult == "scissors") {
                    for (const r of pointsScissors) {
                        if (r.hand == rivalResult) {
                            const finalText = r.result
                            return finalText
                        }
                    }
                }
            }
            const resultsTexts = resultsText()
            // ----------------------------------------------------------------            
            var data = state.getState();
            console.log(data)
            // ----------------------------------------------------------------
            function pointsFunc() {
                if (resultsTexts == "Ganaste!😃") {
                    var player = data.player++
                    console.log("player", player)
                    return player
                } else if (resultsTexts == "Perdiste🙃") {
                    var rival = data.rival++
                    console.log("rival", rival)
                    return rival
                } else if (resultsTexts == "Empate😁") {
                    var draw = data.player
                    console.log("draw", draw)
                    return draw
                }
            }
            const result = pointsFunc()

            console.log("función", result)
            // ----------------------------------------------------------------     
            data = state.getState()
            const playerPoints = data.player
            const rivalPoints = data.rival
            console.log("player final", playerPoints)
            console.log("rival final", rivalPoints)
            console.log("data", data)

            state.setState({
                ...data,
                player: playerPoints,
                rival: rivalPoints
            })
        } render() {

            const div = document.createElement("div");
            div.innerHTML = `                
                <div class="window__text">
                <div class="window__result">${resultsTexts}</div>                
                <div class="points__rival">Máquina:${rivalPoints}</div>                
                <div class="points__player">Vos:${playerPoints}</div>                
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
                history.pushState({}, "", "/instructions")
                location.reload()
            })
        }
    });
}
export { result }
