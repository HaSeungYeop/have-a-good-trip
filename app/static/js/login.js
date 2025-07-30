document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      const email = formData.get("email");
      const password = formData.get("password");
  
      try {
        const res = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        });
  
        if (res.ok) {
          const data = await res.json();
          // ✅ JWT 토큰 저장 (localStorage)
          localStorage.setItem("access_token", data.access_token);
          alert("로그인 성공!");
          window.location.href = "/";  // 메인 페이지로 이동
        } else {
          const errorData = await res.json();
          alert(`로그인 실패: ${errorData.detail}`);
        }
      } catch (error) {
        console.error("로그인 요청 실패:", error);
        alert("서버 연결에 실패했습니다.");
      }
    });
  });
  