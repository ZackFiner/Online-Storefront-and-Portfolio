

class ActivitySensor {
    constructor() {
        this.state = {
            last_action : Date.now(),
            refresh_events : ["click", "mousemove", "keydown"],
            interval_callbacks: [],
            created_intervals: [],
        };
    }

    attachListeners = (root) => {
        const events = this.state.refresh_events;
        for (const event of events) {
            root.addEventListener(event, this.notifyAction(root));
        }
        
        /*
        setInterval(() => {
            console.log(this.getTimeSinceActivity());
        }, 1000)*/
    }

    detachListeners = (root) => {
        const created_intervals = this.state.created_intervals;
        const events = this.state.refresh_events;
        for (const event of events) {
            root.removeEventListener(event, this.notifyAction(root));
        }
        for (const id of created_intervals) {
            clearInterval(id); // reset the timer if it exists
        }
    }

    notifyAction = root => () => {
        this.state.last_action = Date.now();
        this.resetTimers();
    }

    resetTimers = () => {
        const callback_intervals = this.state.interval_callbacks;
        const created_intervals = this.state.created_intervals;
        for (const id of created_intervals) {
            clearInterval(id);
        }
        this.state.created_intervals = [];
        for (const callback_interval of callback_intervals) {
            this.state.created_intervals.push(
                setInterval(callback_interval.callback, callback_interval.interval));
        }

    }

    getTimeSinceActivity = () => {
        return Date.now() - this.state.last_action;
    }

    addInactivityTrigger = (callback, interval) => {
        const interval_callback = {callback, interval};
        this.state.interval_callbacks.push(interval_callback);
    }
}

export default ActivitySensor;