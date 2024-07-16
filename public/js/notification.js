async function checkPermission() {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      return true;
    } else {
      const res = await Notification.requestPermission();
      return res === "granted" ? true : false;
    }
  } else {
    console.log("notificaton not supported");
  }
}

function notify(message) {
  const res = new Notification("Velgo", {
    body: message,
    icon: "https://cdn.glitch.global/0257ef2f-3a14-4c5a-9ea0-76b379c1e60a/VeloGo%20(13).png?v=1718985503161",
    vibrate: [200, 100, 200],
  });
  setTimeout(() => notificaton.close(), 5000);

  notificaton.addEventListener("click", () => {
    window.open("http://localhost:8080/bookings/myorders");
  });
}

if (checkPermission()) {
  notify("Someone has booked your ride bro");
}
