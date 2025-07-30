document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const email = formData.get("email");
      const username = formData.get("username");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirm_password");
  
      if (password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
  
      try {
        const res = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            username,
            password
          })
        });
  
        if (res.ok) {
          alert("회원가입이 완료되었습니다.");
          window.location.href = "/login";
        } else {
          const errorData = await res.json();
          alert(`회원가입 실패: ${errorData.detail}`);
        }
      } catch (error) {
        console.error("회원가입 요청 실패:", error);
        alert("서버 연결에 실패했습니다.");
      }
    });
  });
  