document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("foodHistory")) || [];

  if (history.length === 0) {
    list.innerHTML = "<li>Ei vielä ehdotuksia.</li>";
    return;
  }

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} – ${item.name}`;
    list.appendChild(li);
  });
});
