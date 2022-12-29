class CountdownManager {
  init() {
    this.newCountdownButton = document.getElementById("new-countdown");
    this.eventTitle = document.getElementById("event-title");
    this.datePicker = document.getElementById("date-picker");

    this.countdownCounter = 0;

        this.countdownsContainer = document.querySelector('.countdowns-container');
        this.countdowns = [];

        this.savedCountdowns = document.cookie.slice((document.cookie.indexOf('=') + 1));;

        this.importCountdownsFromCookies();

    this.disableTickerPastDate();
    this.addListeners();
    this.startCountdowns();
  }

    importCountdownsFromCookies = () => {

        if (this.savedCountdowns !== "") {

            let lastCountdownCounter = this.countdownCounter;

            let countdownsObj = JSON.parse(this.savedCountdowns);

            for (const savedCountdown of countdownsObj) {
                this.addNewCountdown({
                    title: savedCountdown.title,
                    date: new Date(savedCountdown.date),
                    container: this.countdownsContainer
                });
                lastCountdownCounter = parseInt(savedCountdown.id.slice((savedCountdown.id.lastIndexOf('n') + 1)));
                if (lastCountdownCounter > this.countdownCounter) this.countdownCounter = lastCountdownCounter;

                delete countdownsObj.savedCountdown;
            }
            this.checkcountdowns();
        }
    }

    saveCountdownsInCookies = () => {
        let cookie = 'countdowns=' + JSON.stringify(this.countdowns);
        document.cookie = cookie;
    }

  disableTickerPastDate = () => {
    let currentDate = new Date().toISOString();
    currentDate = currentDate.slice(0, currentDate.lastIndexOf(":"));
    this.datePicker.setAttribute("min", currentDate);
    this.datePicker.setAttribute("value", currentDate);
  };

  addListeners = () => {
    this.newCountdownButton.addEventListener("click", () => {
      const dateStr = this.datePicker.value;
      const eventTitle = this.eventTitle.value;

      if (dateStr === "" || eventTitle === "") return;
      this.addNewCountdown({
        title: eventTitle,
        date: new Date(dateStr),
        container: this.countdownsContainer,
      });
    });
  };

  addNewCountdown = ({ title, date, container }) => {
    const countdownId = "countdown" + this.countdownCounter++;
    const code = `<div class="countdown" id="${countdownId}">
                        <h2 class="countdown-title">${title}</h2>
                        <div class="countdown-body">
                            <ul class="timer">
                                <li><span class="days"></span>dni</li>
                                <li><span class="hours"></span>godzin</li>
                                <li><span class="minutes"></span>minut</li>
                                <li><span class="seconds"></span>sekund</li>
                            </ul>
                            <div class="countdown-finished-info">Odliczanie zakończone!</div>
                        </div>
                        <button class="countdown-delete">
                        <img src="./img/close.png" alt="przycisk usuwający odliczanie" />
                        </button>
                    </div>
        `;

    let element = document.createElement("div");
    element.innerHTML = code;
    element = element.firstChild;

    container.appendChild(element);

    const countdown = new Countdown({
      title: title,
      date: date,
      id: countdownId,
    });

    countdown.addDeleteListener(() => {
      this.removeCountdownFromHtml(countdown);
    });

        this.countdowns.push(countdown);
        this.saveCountdownsInCookies();

    }

  startCountdowns = () => {
    this.intervalId = setInterval(this.checkcountdowns, 1000);
  };

  checkcountdowns = () => {
    const now = new Date().getTime();
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    this.countdowns.forEach((countdown) => {
      const distance = countdown.timestamp - now;
      const days = Math.floor(distance / day);
      const hours = Math.floor((distance % day) / hour);
      const minutes = Math.floor((distance % hour) / minute);
      const seconds = Math.floor((distance % minute) / second);

      if (distance > 0) {
        countdown.updateCountdownHtml({
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          distance: distance,
        });
      } else {
        countdown.countdownFinished();
      }
    });
  };

  removeCountdownFromHtml = (countdown) => {
    const countdownId = countdown.getId();
    const countdownContainer = countdown.getContainer();

    this.countdownsContainer.removeChild(countdownContainer);

        this.countdowns = this.countdowns.filter((countdown) => countdown.id != countdownId);

        this.saveCountdownsInCookies();

        countdown.destroyCountdown();
    }

}

const countdownManager = new CountdownManager();
countdownManager.init();
