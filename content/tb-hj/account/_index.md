---
title: "你的賬戶 (Account)"
layout: list
---

<section class="account-page auth-only">
  <h3>歡迎, <span id="account-email"></span></h3>
 
  <div style="margin-top: 2rem;">
    <button id="logout-btn" class="btn-main" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">
      登出 (Logout)
    </button>
  </div>
</section>

<section class="login-only">
  <p>請先登入。</p>
  <a href="/tb-hj/login/" style="color: var(--accent-green); text-decoration: underline;">前往登入頁面</a>
</section>

<script type="module" src="/js/account.js"></script>
