class TimeFormat {
    constructor(time) {
        this.time = time;
    }

    toTimeObject() {
        return {
            day: this.time.getDate().toString().padStart(2, '0'),
            month: (this.time.getMonth() + 1).toString().padStart(2, '0'),
            year: this.time.getFullYear(),
            hour: this.time.getHours(),
            minutes: this.time.getMinutes().toString().padStart(2, '0'),
        };
    }

    toTimeString() {
        const { day, month, year, hour, minutes } = this.toTimeObject();
        return hour + ':' + minutes + ' ' + day + '-' + month + '-' + year;
    }
}

export { TimeFormat };
