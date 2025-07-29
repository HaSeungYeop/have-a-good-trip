document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotClose = document.getElementById("chatbot-close");

  // ✅ 세션 ID 생성 (페이지 로드 시 1회)
  const sessionId = "sess_" + Math.random().toString(36).substring(2, 12);

  // 챗봇 열기/닫기
  if (chatbotToggle && chatbotContainer && chatbotClose) {
    chatbotToggle.addEventListener("click", () => {
      chatbotContainer.classList.toggle("d-none");
    });

    chatbotClose.addEventListener("click", () => {
      chatbotContainer.classList.add("d-none");
    });
  }

  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const submitButton = chatForm?.querySelector('button[type="submit"]');

  if (chatForm && userInput && submitButton) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const message = userInput.value.trim();
      if (!message) return;

      appendMessage("user", message);
      userInput.value = "";

      showLoadingMessage();
      disableInput(true);

      try {
        const res = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: message,
            session_id: sessionId  // ✅ 세션 ID 추가
          })
        });

        if (!res.ok) {
          throw new Error("서버 응답 오류");
        }

        const data = await res.json();

        removeLoadingMessage();
        appendMessage("bot", data.response);

      } catch (err) {
        console.error("❌ fetch 에러:", err);
        removeLoadingMessage();
        appendMessage("bot", "⚠️ 서버 응답에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        disableInput(false);
      }
    });
  }

  function appendMessage(sender, text) {
    const chatLog = document.getElementById("chat-log");
    if (!chatLog) return;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender);
    messageDiv.textContent = text;

    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function showLoadingMessage() {
    const chatLog = document.getElementById("chat-log");
    if (!chatLog) return;

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("bot", "loading-message");
    loadingDiv.id = "loading-message";
    loadingDiv.innerHTML = `
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    chatLog.appendChild(loadingDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function removeLoadingMessage() {
    const loadingMessage = document.getElementById("loading-message");
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }

  function disableInput(disabled) {
    if (userInput) {
      userInput.disabled = disabled;
      userInput.placeholder = disabled ? "AI가 답변 중입니다..." : "여행지를 입력해 보세요";
    }
    if (submitButton) {
      submitButton.disabled = disabled;
      submitButton.textContent = disabled ? "답변 중..." : "전송";
    }
  }

  const initialGreeting = "안녕하세요! 여행 전문가 챗봇입니다. 여행지를 추천받고 싶으시거나 일정 계획이 필요하시면 편하게 말씀해 주세요.";
  setTimeout(() => {
    appendMessage("bot", initialGreeting);
  }, 500);
});
