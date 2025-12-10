/**
    전역으로 사용하는 axios 설정
    csrf 토큰 요청시 주의사항
    - 쿠키 요청을 항상 true로 설정
    - CRA Proxy 사용여부에 따라 ip 주소 변경
*/
import axios from "axios";

const REFRESH_KEY = "didRefreshOnce";

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // 403일 때만 처리
    if (status === 403) {
      const url = err.config?.url;

      // 1) /csrf/create 같은 내부 요청은 무시
      if (url === "/csrf/create") {
        return Promise.reject(err);
      }

      // 2) 새로고침 1번만 허용
      const didRefresh = localStorage.getItem(REFRESH_KEY);

      if (!didRefresh) {
        localStorage.setItem(REFRESH_KEY, "true");
        window.location.reload();   // 🔥 단 한 번만 새로고침
        return;
      }

      // 3) 새로고침 한 번 했는데도 계속 403이면 오류 페이지로 이동
      window.location.href = "/error/forbidden";
    }

    if (status === 500) {
      window.location.href = "/error/common";
    }

    return Promise.reject(err);
  }
);


export default axios;
