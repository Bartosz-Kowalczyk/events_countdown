class Countdown {
    constructor({title, date, id}) {
        this.title = title;
        this.date = date;
        this.timestamp = date.getTime();
        this.id = id;
        this.isFinished = false;

        this.container = document.getElementById(id);
        this.daysElement = this.container.querySelector('.days');
        this.hoursElement = this.container.querySelector('.hours');
        this.minutesElement = this.container.querySelector('.minutes');
        this.secondsElement = this.container.querySelector('.seconds');

        this.deleteButton = this.container.querySelector('.countdown-delete');
    }

    addDeleteListener = (callback) => {
        this.deleteButton.addEventListener('click', callback);
    }

    updateCountdownHtml = ({days, hours, minutes, seconds}) => {
        this.daysElement.textContent = days;
        this.hoursElement.textContent = hours;
        this.minutesElement.textContent = minutes;
        this.secondsElement.textContent = seconds;
    }

    countdownFinished = () => {
        if (this.isFinished) return;
        this.isFinished = true;

        this.container.classList.add('countdown-finished');
        this.container.querySelector('.timer').classList.add('hide');
        this.container.querySelector('.countdown-finished-info').classList.add('show');
        console.log(`Countdown ${this.id} finished.`)
    }

    getId = () => {
        return this.id;
    }

    getContainer = () => {
        return this.container;
    }

    destroyCountdown = () => {

    }
}