import { sanitySettings as config } from "./sanity-config.js";

const isConfigured =
  config &&
  config.projectId &&
  config.projectId !== "YOUR_SANITY_PROJECT_ID" &&
  /^[a-z0-9-]+$/.test(config.projectId) &&
  /^[a-z0-9-]+$/.test(config.dataset);

if (isConfigured) {
  loadPublishedContent().catch((error) => {
    console.error("Could not load published website content from Sanity.", error);
  });
}

async function loadPublishedContent() {
  const query = `{
    "settings": *[_type == "siteSettings" && _id == "siteSettings"][0] {
      heroHeading, heroDescription, "heroImageUrl": heroImage.asset->url,
      introHeading, introSubheading, introDescription, approachHeading, approachDescription,
      serviceArea, contactPhone, contactEmail, footerTagline
    },
    "services": *[_type == "service"] | order(order asc) {
      title, eyebrow, description, "imageUrl": image.asset->url, imageAlt, linkLabel
    },
    "completedProjects": *[_type == "project" && status == "completed"] | order(order asc) {
      title, category, location, "imageUrl": image.asset->url, imageAlt
    },
    "ongoingProjects": *[_type == "project" && status == "ongoing"] | order(order asc) {
      title, category, location, currentStage, "imageUrl": image.asset->url, imageAlt
    },
    "reviews": *[_type == "review" && approved == true] | order(order asc) {
      quote, clientName, projectDetails
    }
  }`;

  const endpoint = new URL(
    `https://${config.projectId}.apicdn.sanity.io/v2025-02-19/data/query/${config.dataset}`,
  );
  endpoint.searchParams.set("query", query);

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Sanity returned HTTP ${response.status}.`);
  }

  const { result } = await response.json();
  if (!result || typeof result !== "object") {
    throw new Error("Sanity returned an invalid content response.");
  }

  applySiteSettings(result.settings);
  if (Array.isArray(result.services) && result.services.length) {
    renderServices(result.services);
  }
  renderProjects(
    "completed-projects",
    result.completedProjects,
    "COMPLETED PROJECT",
    false,
  );
  renderProjects(
    "ongoing-projects",
    result.ongoingProjects,
    "ONGOING PROJECT",
    true,
  );
  renderReviews(result.reviews);
}

function applySiteSettings(settings) {
  if (!settings) return;

  const textFields = [
    "heroHeading",
    "heroDescription",
    "introHeading",
    "introSubheading",
    "introDescription",
    "approachHeading",
    "approachDescription",
    "serviceArea",
    "contactPhone",
    "contactEmail",
    "footerTagline",
  ];

  for (const field of textFields) {
    const element = document.querySelector(`[data-cms="${field}"]`);
    const value = settings[field];
    if (element && typeof value === "string" && value.trim()) {
      element.textContent = value;
    }
  }

  if (settings.heroHeading) {
    document.querySelector('[data-cms="heroHeading"]').style.whiteSpace = "pre-line";
  }
  if (settings.approachHeading) {
    document.querySelector('[data-cms="approachHeading"]').style.whiteSpace = "pre-line";
  }

  const heroImage = document.querySelector('[data-cms-image="heroImage"]');
  const imageUrl = getSanityImageUrl(settings.heroImageUrl, 1800);
  if (heroImage && imageUrl) {
    heroImage.style.backgroundImage = `url("${imageUrl}")`;
  }
}

function renderServices(services) {
  const grid = document.querySelector("#service-grid");
  if (!grid) return;

  grid.replaceChildren(
    ...services.map((service, index) => {
      const card = document.createElement("article");
      card.className = "service-card";

      const image = document.createElement("div");
      image.className = "service-image";
      image.setAttribute("role", "img");
      image.setAttribute("aria-label", service.imageAlt || service.title || "Service photo");
      const imageUrl = getSanityImageUrl(service.imageUrl, 950);
      if (imageUrl) image.style.backgroundImage = `url("${imageUrl}")`;

      const meta = document.createElement("div");
      meta.className = "service-meta";
      meta.append(
        createTextElement("span", "", String(index + 1).padStart(2, "0")),
        createTextElement("span", "", service.eyebrow || ""),
      );

      card.append(
        image,
        meta,
        createTextElement("h3", "", service.title || ""),
        createTextElement("p", "", service.description || ""),
      );

      const link = createTextElement("a", "", service.linkLabel || "Ask us about this service");
      link.href = "#contact";
      link.append(createTextElement("span", "", "↗"));
      card.append(link);
      return card;
    }),
  );
}

function renderProjects(containerId, projects, statusLabel, ongoing) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  const group = grid.closest(".portfolio-group");
  const projectList = Array.isArray(projects) ? projects : [];
  if (!projectList.length) {
    if (group) group.hidden = true;
    return;
  }

  if (group) group.hidden = false;
  grid.replaceChildren(
    ...projectList.map((project, index) => {
      const card = document.createElement("article");
      card.className = `project-card${ongoing ? " ongoing-card" : ""}`;

      const image = document.createElement("div");
      image.className = "project-image";
      image.setAttribute("role", "img");
      image.setAttribute("aria-label", project.imageAlt || project.title || "Project photo");
      const imageUrl = getSanityImageUrl(project.imageUrl, 1100);
      if (imageUrl) image.style.backgroundImage = `url("${imageUrl}")`;

      const imageLabel = createTextElement("span", "project-image-label", statusLabel);
      image.append(imageLabel);
      if (ongoing) {
        const status = createTextElement("span", "status-pill", "");
        status.append(createTextElement("span", "", ""), document.createTextNode(project.currentStage || "In progress"));
        image.append(status);
      }

      const details = createTextElement("div", "project-details", "");
      const meta = createTextElement("div", "project-meta", "");
      meta.append(
        createTextElement(
          "span",
          "",
          ongoing && project.currentStage
            ? `CURRENT STAGE: ${project.currentStage}`
            : statusLabel,
        ),
        createTextElement("span", "", String(index + 1).padStart(2, "0")),
      );
      details.append(
        meta,
        createTextElement("h4", "", project.title || ""),
        createTextElement(
          "p",
          "",
          [project.location, project.category].filter(Boolean).join(" · "),
        ),
      );
      card.append(image, details);
      return card;
    }),
  );
}

function renderReviews(reviews) {
  const section = document.querySelector("#reviews");
  const grid = document.querySelector("#client-reviews");
  if (!section || !grid) return;

  const reviewList = Array.isArray(reviews) ? reviews : [];
  const reviewsNavLink = document.querySelector('.primary-nav a[href="#reviews"]');
  if (!reviewList.length) {
    section.hidden = true;
    if (reviewsNavLink) reviewsNavLink.hidden = true;
    return;
  }

  section.hidden = false;
  if (reviewsNavLink) reviewsNavLink.hidden = false;
  grid.replaceChildren(
    ...reviewList.map((review) => {
      const card = createTextElement("article", "review-card", "");
      card.append(createTextElement("span", "quote-mark", "“"));
      card.append(createTextElement("p", "", review.quote || ""));

      const author = createTextElement("div", "review-author", "");
      const initial = (review.clientName || "C").trim().charAt(0).toUpperCase();
      author.append(createTextElement("span", "author-initial", initial));

      const name = createTextElement("span", "", review.clientName || "");
      name.append(createTextElement("small", "", review.projectDetails || ""));
      author.append(name);
      card.append(author);
      return card;
    }),
  );
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function getSanityImageUrl(value, width) {
  if (typeof value !== "string") return null;

  try {
    const imageUrl = new URL(value);
    if (
      imageUrl.protocol !== "https:" ||
      imageUrl.hostname !== "cdn.sanity.io" ||
      !imageUrl.pathname.startsWith("/images/")
    ) {
      return null;
    }
    imageUrl.searchParams.set("auto", "format");
    imageUrl.searchParams.set("w", String(width));
    imageUrl.searchParams.set("q", "85");
    return imageUrl.toString();
  } catch {
    return null;
  }
}
