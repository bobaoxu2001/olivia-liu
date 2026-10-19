// Focus switch: highlights the experience, projects and skills that match a
// role family, and points every résumé link at the matching résumé version.
// The choice is kept in the URL (?focus=risk) so a tailored link can be shared.

(function () {
  const FOCI = {
    all: { name: "everything", resume: "resume/Olivia-Liu-Resume-FPA.pdf", label: "résumé" },
    fin: { name: "finance and FP&A", resume: "resume/Olivia-Liu-Resume-FPA.pdf", label: "FP&A résumé" },
    risk: { name: "risk", resume: "resume/Olivia-Liu-Resume-Risk.pdf", label: "risk analyst résumé" },
    data: { name: "data", resume: "resume/Olivia-Liu-Resume-Data.pdf", label: "data analyst résumé" },
    biz: { name: "business analysis", resume: "resume/Olivia-Liu-Resume-Business.pdf", label: "business analyst résumé" },
  };

  const buttons = Array.from(document.querySelectorAll("[data-focus]"));
  const tagged = Array.from(document.querySelectorAll("[data-lens]"));
  const entries = Array.from(document.querySelectorAll(".entry"));
  const resumeLinks = Array.from(document.querySelectorAll("[data-resume-link]"));
  const status = document.querySelector("[data-focus-status]");
  const lensBar = document.querySelector(".lens");

  function apply(key, { announce = true, updateUrl = true } = {}) {
    if (!FOCI[key]) key = "all";
    const focus = FOCI[key];

    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.focus === key)));

    let matched = 0;
    tagged.forEach((el) => {
      const hit = key === "all" || el.dataset.lens.split(" ").includes(key);
      el.classList.toggle("is-dim", !hit);
      if (hit) matched += 1;
    });

    entries.forEach((entry) => {
      const anyHit = entry.querySelector("[data-lens]:not(.is-dim)");
      entry.classList.toggle("is-quiet", !anyHit);
    });

    resumeLinks.forEach((a) => {
      a.href = focus.resume;
      if (a.dataset.resumeStyle === "long") {
        a.textContent = "Download " + focus.label;
      }
    });

    if (status && announce) {
      status.textContent =
        key === "all"
          ? "Showing everything."
          : "Highlighting " + matched + " of " + tagged.length + " items relevant to " + focus.name + ".";
    }

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (key === "all") url.searchParams.delete("focus");
      else url.searchParams.set("focus", key);
      history.replaceState(null, "", url);
    }
  }

  buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.focus)));

  const initial = new URLSearchParams(window.location.search).get("focus");
  apply(initial || "all", { announce: false, updateUrl: false });

  // Anchor jumps land below the sticky focus bar.
  function measure() {
    if (lensBar) document.documentElement.style.setProperty("--lens-h", lensBar.offsetHeight + "px");
  }
  measure();
  window.addEventListener("resize", measure);
})();
