import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById("datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerInterval = null;

startBtn.disabled = true;

flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] && selectedDates[0] > new Date()) {
      userSelectedDate = selectedDates[0];
      startBtn.disabled = false;
    } else {
      userSelectedDate = null;
      startBtn.disabled = true;
      iziToast.error({
        message: "Please choose a date in the future",
        position: "topRight",
      });
    }
  },
});

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function startTimer() {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(() => {
    const timeLeft = userSelectedDate.getTime() - new Date().getTime();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      return;
    }

    updateTimer(convertMs(timeLeft));
  }, 1000);
}

startBtn.addEventListener("click", startTimer);