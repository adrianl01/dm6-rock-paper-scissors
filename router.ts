import "./src/components/welcome/index"
import "./src/components/game-room/index"
import "./src/components/new-game/index"
import "./src/components/instructions/index"
import "./src/components/game/index"
import { Router } from "@vaadin/router";


const root = document.querySelector(".root")
const router = new Router(root);
router.setRoutes([
    { path: "/", component: "welc-el" },
    { path: "/gameroom", component: "game-room-el" },
    { path: "/newgame", component: "new-game-el" },
    { path: "/instructions", component: "inst-el" },
    { path: "/game", component: "game-el" },
]);