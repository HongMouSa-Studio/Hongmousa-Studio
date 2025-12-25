---
title: "你的賬戶 (Account)"
layout: list
---

<section class="account-page auth-only">
  <div class="account-header">
    <h3>{{ i18n "account_welcome" }}, <span id="account-email" style="color: var(--accent-green);"></span></h3>
    <button id="logout-btn" class="btn-main" style="background: #ef4444; margin-top: 0;">
      {{ i18n "account_logout_btn" }}
    </button>
  </div>

  <div class="account-grid">
    <div class="account-card point-card">
      <h4><i class="fa-solid fa-star"></i> {{ i18n "account_section_points" }}</h4>
      <div class="point-value">
        <span id="member-points">0</span> {{ i18n "account_points_unit" }}
      </div>
    </div>

    <div class="account-card order-card">
      <h4><i class="fa-solid fa-box"></i> {{ i18n "account_section_orders" }}</h4>
      <div id="order-list" class="empty-state">
        <p>{{ i18n "account_no_orders" }}</p>
      </div>
    </div>
  </div>
</section>

<section class="login-only" style="text-align: center; padding: 5rem 1rem;">
  <p>{{ i18n "account_login_required" }}</p>
  <a href="{{ relURL "login/" }}" style="color: var(--accent-green); text-decoration: underline;">
    {{ i18n "account_go_to_login" }}
  </a>
</section>

<style>
  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 800px;
    margin-bottom: 2rem;
    gap: 1rem;
  }
  .account-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    width: 100%;
    max-width: 800px;
  }
  @media (max-width: 768px) {
    .account-grid {
      grid-template-columns: 1fr;
    }
  }
  .account-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #eee;
  }
  .account-card h4 {
    margin-bottom: 1.2rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #333;
  }
  .point-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-green);
  }
  .empty-state {
    color: #999;
    padding: 2rem 0;
    text-align: center;
  }
</style>

<script type="module" src="/js/account.js"></script>
