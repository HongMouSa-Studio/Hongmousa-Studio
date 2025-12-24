---
title: "My Account"
layout: list
---

<section class="account-page auth-only">
  <h3>Welcome, <span id="account-email"></span></h3>
 
  <div style="margin-top: 2rem;">
    <button id="logout-btn" class="btn-main" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">
      Logout
    </button>
  </div>
</section>

<section class="login-only">
  <p>Please login first.</p>
  <a href="/login/" style="color: var(--accent-green); text-decoration: underline;">Go to login</a>
</section>

<script type="module" src="/js/account.js"></script>
