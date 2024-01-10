import { state } from "./state";
import "../router.ts"

(function () {
    state.init();
    // state.setEmailAndFullName("gustavo.adrian.leiva879@gmail.com", "Gustavo Adrián Leiva");
    // state.singIn((err) => {
    //     if (err) console.error("Hubo un error en el singIn")
    //     state.askNewRoom(() => {
    //         state.accessToRoom();
    //     })
    // })
})()