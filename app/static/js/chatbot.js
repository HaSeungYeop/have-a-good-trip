document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userInput = document.getElementById("user-input").value;

  const formData = new FormData();
  formData.append("message", userInput);

  const res = await fetch("/chat", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  document.getElementById("chat-response").innerText = data.response;
});
