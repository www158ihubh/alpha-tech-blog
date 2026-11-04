/* 涂曦月 · 求职作品集 交互脚本 */
(function () {
  "use strict";

  /* ---------- 轮播 ---------- */
  const slides = Array.from(document.querySelectorAll("#showcaseViewport .slide"));
  const dotsBox = document.getElementById("slideDots");
  let cur = 0, timer = null;

  if (slides.length && dotsBox) {
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "第 " + (i + 1) + " 张");
      if (i === 0) b.classList.add("on");
      b.addEventListener("click", () => go(i, true));
      dotsBox.appendChild(b);
    });
    const dots = Array.from(dotsBox.children);

    function go(i, manual) {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === cur));
      dots.forEach((d, k) => d.classList.toggle("on", k === cur));
      if (manual) restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(cur + 1), 5000);
    }
    document.getElementById("slidePrev").addEventListener("click", () => go(cur - 1, true));
    document.getElementById("slideNext").addEventListener("click", () => go(cur + 1, true));
    restart();
  }

  /* ---------- 移动端菜单 ---------- */
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("open", !open);
    });
    mobileNav.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("open");
      })
    );
  }

  /* ---------- 导航高亮(滚动监听) ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"], .mobile-nav a[href^="#"]'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function setActive() {
    const pos = window.scrollY + 120;
    let idx = 0;
    sections.forEach((sec, i) => { if (sec.offsetTop <= pos) idx = i; });
    navLinks.forEach(a => {
      const sec = a.getAttribute("href");
      const target = sections[idx];
      a.classList.toggle("active", !!target && sec === "#" + target.id);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  /* ---------- 入场动画 ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("in"));
  }

  /* ---------- 返回顶部 ---------- */
  const backTop = document.getElementById("backTop");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- 联系表单(mailto 提交) ---------- */
  const form = document.getElementById("contactForm");
  const tip = document.getElementById("formTip");
  if (form && tip) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if (!name || !email || !message) {
        tip.textContent = "请填写姓名、邮箱与留言后再发送。";
        tip.style.color = "#ff5d8f";
        return;
      }
      const subject = encodeURIComponent("【作品集联系】来自 " + name);
      const body = encodeURIComponent(message + "\n\n联系方式:" + email + (form.phone.value.trim() ? " / " + form.phone.value.trim() : ""));
      window.location.href = "mailto:3067508795@qq.com?subject=" + subject + "&body=" + body;
      tip.textContent = "已打开邮件客户端,若未弹出请直接发送至 3067508795@qq.com。";
      tip.style.color = "#2fe6a8";
    });
  }

  /* ---------- 年份 ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
