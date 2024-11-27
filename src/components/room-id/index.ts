import { state } from "../../pages/state";
type RoomIds = []
function funcRoomId() {
    customElements.define("rooms-el", class Results extends HTMLElement {
        roomIds: RoomIds[] = [];
        connectedCallback() {
            this.render();
            this.rooms();
            this.listeners();
        }
        render() {
            this.roomIds = state.data.rooms;
            const div = document.createElement("div");
            div.innerHTML = `                
            <div class="window__text">
            <div class="window-title">Salas Creadas con Este Nombre</div>                
            <div class="rooms-list"></div>  
            <button class="new-room-button">nueva sala</button>                            
            </div>                     
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
                    font-weight:400;
                    gap: 30px;
                    border: solid black
                }
                .window-title {
                    font-size:30px;
                }
                .room-button, .new-room-button {
                    width: 322px;height: 67px;
                    border-radius: 10px;
                    border: 10px solid #001997;
                    background: #006CFC;         
                    color: #D8FCFC;
                    text-align: center;
                    font-family: 'Odibee Sans';
                    font-size: 25px;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: 2.25px;
                }                 
                .rooms-list {
                    display:flex;
                    flex-direction: column;
                    height: 100;
                }                
                `;
            div.classList.add("window");
            this.appendChild(div);
            this.appendChild(style);
        }
        rooms() {
            this.roomIds.map((r) => {
                const div = document.createElement("button")
                div.innerHTML = `${r.toString()}`;
                div.classList.add("room-button");
                return this.querySelector(".rooms-list").appendChild(div);
            })
        }
        listeners() {
            const butEl = this.querySelector(".rooms-list")
            butEl.addEventListener("click", (e) => {
                e.preventDefault();
                const tar = e.target as any;
                state.data.roomId = tar.textContent;
                state.accessToRoom();
            })
            const newButEl = this.querySelector(".new-room-button");
            newButEl.addEventListener("click", () => { state.askNewRoom() });
        }
    });
}
export { funcRoomId }
