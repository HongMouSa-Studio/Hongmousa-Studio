---
title: "My Account"
layout: list
---

<section class="account-page auth-only" style="text-align: center;">
  <h3>Welcome, <span id="account-email" style="font-weight: bold; color: var(--accent-green);"></span></h3>
 
  <div style="margin-top: 2rem;">
    <button id="logout-btn" class="btn-main" style="background: #ef4444; width: auto; padding: 0.6rem 2rem;">
      Logout
    </button>
  </div>
</section>

<section class="login-only" style="text-align: center;">
  <p>Please login first.</p>
  <a href="/login/" class="btn-main" style="display: inline-block; width: auto; margin-top: 1rem;">Go to login</a>
</section>

<script type="module" src="/js/account.js"></script>
