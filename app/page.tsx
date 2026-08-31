"use client";

import { useEffect, useRef, useState } from "react";

const DOWNLOAD_PATH = "/resume-egor-fenin-2026.docx";
const GITHUB_URL = "https://github.com/voityvaity";
const SITE_URL = "https://egorfenin.ru";

const coreSkills = [
  "Python",
  "Django + DRF",
  "SQL / PostgreSQL",
  "REST API",
  "Git",
  "Docker / Nginx",
  "GitHub Actions",
  "Unit- и API-тестирование",
];

const qualities = [
  "Целеустремлённость и готовность осваивать новые технологии",
  "Умение работать в команде и учиться",
  "Ответственный подход к выполнению задач",
];

const projects = [
  {
    name: "Foodgram",
    description:
      "Сервис рецептов с авторизацией, фильтрацией, подписками, избранным и списком покупок с суммированием ингредиентов.",
    stack: "Django · DRF · PostgreSQL · Docker · Nginx · Tests · CI",
    href: "https://github.com/voityvaity/foodgram",
    linkLabel: "Открыть код",
  },
  {
    name: "Kittygram",
    description:
      "Веб-сервис для публикации карточек котов и достижений: REST API, авторизация, медиафайлы, контейнеризация и CI/CD.",
    stack: "Django · DRF · PostgreSQL · Docker · Nginx · GitHub Actions",
    href: "https://github.com/voityvaity/kittygram_final",
    linkLabel: "Открыть код",
  },
];

type Dot = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
};

function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pointer = { x: -1000, y: -1000, px: -1000, py: -1000, speed: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const rebuild = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const spacing = width < 640 ? 26 : 31;
      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;
      dots = [];

      for (let y = offsetY; y < height; y += spacing) {
        for (let x = offsetX; x < width; x += spacing) {
          dots.push({ x, y, dx: 0, dy: 0, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const dot of dots) {
        const x = dot.x + dot.dx;
        const y = dot.y + dot.dy;
        const distance = Math.hypot(pointer.x - x, pointer.y - y);

        if (!reducedMotion && distance < 132) {
          const strength = (1 - distance / 132) * Math.min(13, 2 + pointer.speed * 0.38);
          const angle = Math.atan2(y - pointer.y, x - pointer.x);
          dot.vx += Math.cos(angle) * strength;
          dot.vy += Math.sin(angle) * strength;
        }

        dot.vx += -dot.dx * 0.035;
        dot.vy += -dot.dy * 0.035;
        dot.vx *= 0.86;
        dot.vy *= 0.86;
        dot.dx += dot.vx;
        dot.dy += dot.vy;

        context.beginPath();
        context.arc(dot.x + dot.dx, dot.y + dot.dy, distance < 86 ? 1.85 : 1.35, 0, Math.PI * 2);
        context.fillStyle = distance < 86 ? "#d51620" : "rgba(12, 12, 12, 0.62)";
        context.fill();
      }

      pointer.speed *= 0.88;
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    const handlePointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      const travel = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
      pointer.speed += (travel - pointer.speed) * 0.45;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
    };

    const handleLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
      pointer.px = -1000;
      pointer.py = -1000;
      pointer.speed = 0;
    };

    rebuild();
    draw();
    window.addEventListener("resize", rebuild);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("pointermove", handlePointer);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const downloadResume = async () => {
    if (downloadState === "loading") return;

    setDownloadState("loading");

    try {
      const response = await fetch(DOWNLOAD_PATH, { cache: "no-store" });
      if (!response.ok) throw new Error("Resume download failed");

      const file = await response.blob();
      if (file.size < 10_000) throw new Error("Resume file is incomplete");

      const objectUrl = URL.createObjectURL(file);
      const download = document.createElement("a");
      download.href = objectUrl;
      download.download = "Резюме_Егор_Фенин_2026.docx";
      download.style.display = "none";
      document.body.appendChild(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      setDownloadState("done");
    } catch {
      setDownloadState("error");
    }
  };

  const openResume = () => {
    setIsOpen(true);

    if (downloadState !== "done" && downloadState !== "loading") {
      void downloadResume();
    }
  };

  return (
    <main className={`page-shell ${isOpen ? "page-shell--open" : ""}`}>
      <DotField />

      {!isOpen && (
        <section className="hero" aria-labelledby="resume-title">
          <button className="resume-trigger" type="button" onClick={openResume} aria-describedby="open-note">
            <span className="resume-trigger__eyebrow">Python Developer</span>
            <span className="resume-trigger__title" id="resume-title">
              <span className="resume-trigger__rus">РЕ</span>
              <span className="resume-trigger__accent">ЗЮ</span>
              <span className="resume-trigger__rus">МЕ</span>
            </span>
            <span className="resume-trigger__name">Егор Фенин · 2026</span>
            <span className="resume-trigger__action" id="open-note">
              <span>Открыть резюме</span>
              <span className="resume-trigger__arrow" aria-hidden="true">↘</span>
            </span>
            <span className="resume-trigger__download">Word-файл скачается автоматически</span>
          </button>
          <p className="hero__hint">Проведите курсором по фону</p>
        </section>
      )}

      {isOpen && (
        <article className="resume" aria-labelledby="candidate-name">
          <header className="resume__masthead">
            <div className="resume__topline">
              <span>RESUME / 2026</span>
              <button
                className="download-button"
                type="button"
                onClick={() => void downloadResume()}
                disabled={downloadState === "loading"}
                aria-live="polite"
              >
                <span>
                  {downloadState === "loading"
                    ? "Готовим файл…"
                    : downloadState === "done"
                      ? "Скачать ещё раз"
                      : downloadState === "error"
                        ? "Повторить скачивание"
                        : "Скачать .DOCX"}
                </span>
                <b aria-hidden="true">↓</b>
              </button>
              <button className="close-button" type="button" onClick={() => setIsOpen(false)} aria-label="Свернуть резюме">
                Свернуть <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="resume__identity">
              <p className="resume__role">Python Developer</p>
              <h1 id="candidate-name">
                <span>Егор</span>
                <em>Фенин</em>
              </h1>
              <div className="resume__contacts" aria-label="Контактная информация">
                <a href="tel:+79191207070">+7 919 120-70-70</a>
                <a href="mailto:feninea@mail.ru">feninea@mail.ru</a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
                <a href={SITE_URL}>egorfenin.ru</a>
              </div>
            </div>
          </header>

          <section className="resume__section resume__story">
            <div className="section-number" aria-hidden="true">01</div>
            <div>
              <p className="section-mark">ОБО МНЕ · ОБРАЗОВАНИЕ И ДОСТИЖЕНИЯ</p>
              <h2>Python backend-разработка.</h2>
              <div className="profile-grid">
                <article>
                  <span>ПРОФИЛЬ</span>
                  <p>Прошёл курс «Python-разработчик» Яндекс Практикума. Разрабатываю REST API на Django и DRF, работаю с PostgreSQL, пишу unit- и API-тесты, настраиваю Docker, Nginx и CI.</p>
                </article>
                <article>
                  <span>ОБРАЗОВАНИЕ</span>
                  <p>Обучался в Санкт-Петербургском государственном университете на математико-механическом факультете; поступил после победы во Всероссийской олимпиаде по физике.</p>
                </article>
              </div>
              <div className="event-row" aria-label="Последние профессиональные мероприятия">
                <span>ARCHI.Tech 2025 <small>Тимлид · собрал команду · топ-5 кейса по цифровому рублю</small></span>
                <span>Young Con 2025 <small>Яндекс</small></span>
              </div>
            </div>
          </section>

          <section className="resume__section resume__projects">
            <div className="section-number" aria-hidden="true">02</div>
            <div>
              <p className="section-mark">ПРОЕКТЫ</p>
              <h2>Код, который можно посмотреть.</h2>
              <div className="project-grid">
                {projects.map((project) => (
                  <article className="project-card" key={project.name}>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <p className="project-card__stack">{project.stack}</p>
                    <a href={project.href} target="_blank" rel="noreferrer">
                      {project.linkLabel} <span aria-hidden="true">↗</span>
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="resume__section resume__skills">
            <div className="section-number" aria-hidden="true">03</div>
            <div>
              <p className="section-mark">ИНСТРУМЕНТЫ</p>
              <h2>Технический стек</h2>
              <ul className="skill-grid">
                {coreSkills.map((skill, index) => (
                  <li key={skill}><span>{String(index + 1).padStart(2, "0")}</span>{skill}</li>
                ))}
              </ul>
              <div className="knowledge-note">
                <span>+</span>
                <p>Базовое понимание алгоритмов и структур данных, интеграция с внешними API и принципы работы веб-серверов.</p>
              </div>
            </div>
          </section>

          <section className="resume__section resume__details">
            <div className="section-number" aria-hidden="true">04</div>
            <div className="details-grid">
              <div>
                <p className="section-mark">АНГЛИЙСКИЙ</p>
                <p className="language-level">B1—B2</p>
                <p>Чтение технической документации и общение с англоязычными коллегами.</p>
              </div>
              <div>
                <p className="section-mark">ЛИЧНЫЕ КАЧЕСТВА</p>
                <ul className="quality-list">
                  {qualities.map((quality) => <li key={quality}>{quality}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <footer className="resume__footer">
            <p>Открыт к задачам<br />в backend-команде.</p>
            <span>Рассматриваю позицию<br /><strong>Python Developer</strong></span>
          </footer>
        </article>
      )}
    </main>
  );
}
