async function wakeServer() {
  try {
    await fetch("/health/");
    window.location.href = "/home/";
  } catch (err) {
    setTimeout(wakeServer, 1000);
  }
}

setTimeout(wakeServer, 1500);
