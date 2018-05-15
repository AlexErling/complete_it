$(function() {



  // Some global variables
  var startTime = 0,
      elapsed   = 0,
      timerId   = 0,
      $timer    = $("h1 span");
      alarm = "0:00";

  function formatTime(time) {
    var hrs = Math.floor(time / 60 / 60 / 1000),
        min = Math.floor((time - hrs*60*60*1000) / 60 / 1000),
        sec = Math.floor((time - hrs*60*60*1000 - min*60*1000) / 1000);

    hrs = hrs < 10 ? "0" + hrs : hrs;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return hrs + ":" + min + ":" + sec;
  }

  function elapsedTimeFrom(time) {
    return formatTime(time - startTime + elapsed);
  }

  function showElapsed() {
    $timer.text(elapsedTimeFrom(Date.now()));
  }

  function startTimer() {
    // React only if timer is stopped
    startTime = startTime || Date.now();
    timerId = timerId || setInterval(showElapsed, 1000);
  }

  function pauseTimer() {
    // React only if timer is running
    if (timerId) {
      clearInterval(timerId);
      elapsed += Date.now() - startTime;
      startTime = 0;
      timerId = 0;
    }
  }

  function resetTimer() {
    clearInterval(timerId);
    $timer.text("00:00:00");
    startTime = 0;
    elapsed = 0;
    timerId = 0;
  }

  function alarmDone() {
    pauseTimer();
    var snd = new Audio("sounds/alert.wav");
    snd.volume = .5; // buffers automatically when created
    snd.play();
    snd.addEventListener('ended', showAlert);
  }

  function showAlert() {
    alert("Alarm Compelted")
  }

  function setAlarm() {
    resetTimer();
    alarm = prompt("Enter Alarm Time (in minutes)", "")
    alarm = alarm * 1000 * 60;
    startTimer();
    setTimeout(alarmDone, alarm);
  }



  function editTimer() {
    pauseTimer();
    $timer.prop("contenteditable", true);
    $timer.css("border", "1px solid red");
  }

  function setElapsed() {
    var time = $timer.text(),
        arr  = time.split(":");
    $timer.prop("contenteditable", false);
    $timer.css("border", "1px solid black");
    elapsed = parseInt(arr[0]*60*60, 10);
    elapsed += parseInt(arr[1]*60, 10);
    elapsed += parseInt(arr[2], 10);
    elapsed *= 1000;
  }

  function sendTime() {
    pauseTimer();
    // Set hidden input value before send
    $("[name='time']").val(formatTime(elapsed));
  }

  $("[name='start']").click(startTimer);
  $("[name='stop']").click(pauseTimer);
  $("[name='reset']").click(resetTimer);
  $("[name='alarm']").click(setAlarm);
  $timer.dblclick(editTimer);
  $timer.blur(setElapsed);
  $("form").submit(sendTime);

});
