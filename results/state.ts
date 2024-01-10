const state = {
    data: {
        player: 0,
        rival: 0
    },
    listeners: [],
    init() {
        const localData = sessionStorage.getItem("points");
        if (localData == undefined || null) {
            sessionStorage.setItem("points", JSON.stringify(this.data))
        } else {
            this.setState(JSON.parse(localData as any))
        }
    },
    getState() {
        return this.data;
    },
    setState(newState) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb();
        }
        // --------------------------
        const stringed = JSON.stringify(newState)
        sessionStorage.setItem("points", stringed)
    },
    subscribe(callback: (any) => any) {
        this.listeners.push(callback)
    }
}



export { state }