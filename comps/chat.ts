import { state } from "../src/state";
type Message = {
    from: string,
    message: string
}

customElements.define("chatr-el",
    class ChatRoom extends HTMLElement {
        messages: Message[] = [];

        connectedCallback() {
            if (state.data.rtdbRoomId !== " ") {
                console.log("RENDERR")
                this.render();
            }
            state.subscribe(() => {
                console.log("SUBSCRIBE")
                const currentState = state.getState();
                this.messages = currentState.messages;
                console.log("antes del addMessage:", this.messages)
                this.addMessage()
            })
        }

        addlisteners() {
            const form = this.querySelector(".form");
            form?.addEventListener("submit", function (e) {
                e.preventDefault()
                const target = e.target as any;
                const formInput = target.input.value;
                console.log("formInput:" + formInput)
                state.pushMessage(formInput);
            });
        }

        addMessage() {
            this.messages.map((m) => {
                console.log("dentro del chat")
                const div = document.createElement("div")
                div.innerHTML =
                    `<div class="message">
                                <div class="message-from">From:${m.from}</div>
                                <div class="message-message">${m.message}</div>
                                </div>`;
                return this.querySelector(".feed").appendChild(div)
            })
        }

        render() {
            console.log("EL RENDER RENDERIZZA")
            setTimeout(() => {
                console.log(this.messages)
            }, 2000)

            const roomId = state.getState().roomId;
            const div = document.createElement("div");
            div.innerHTML = `
            <div class="absolute">
            <header class="header">Id del Room:${roomId}</header>
            <h2 class="title">Chat</h2>        
            </div>
            <div class="feed">
                  
           </div>
           <form class="form">    
               <fieldset>              
                <input class="class-input" type="text" name="input">
               <fieldset/>    
                   <button type="submit" class="button">Enviar</button>
           </form>
                `;
            const style = document.createElement("style")
            style.textContent = `                
                .root {
                    width: 375px;
                    font-family: 'Roboto', sans-serif;
                    min-height: 667px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }            
                .absoulte{
                    position: absolute            
                }            
                .header {
                    width: 375px;
                    height: 60px;
                    background-color: palegreen;
                }
                .title {
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    font-size: 80;
                }
                .feed{
                    display: flex;
                    flex-direction: column;
                    height: 393px;
                    width: 375px;
                    background-color:green;
                }
            .form {
                display: flex;
                flex-direction: column;
                gap: 7px;
                background-color: aquamarine;
                padding: 10px 5px;
                position:bottom;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .label {
                font-size: 25;
            }
            .class-input {
                width: 312px;
                height: 55px;
                border-radius: 5px;
                font-size: 20px;
                border: solid black 3px;
            }
            .button {
                width: 312px;
                height: 55px;
                border-radius: 5px;
                font-size: 20px;
                border: solid black 3px;
            }
            .button:active {
                background-color: aqua;
            }
            `;
            div.classList.add("root")
            this.appendChild(style);
            this.appendChild(div);
            this.addlisteners();
        }
    }
)


