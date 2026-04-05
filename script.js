// Update the image and PDF paths below if you rename files in assets/images or assets/docs.
// Spaces in filenames are okay here because the code safely encodes the URLs before rendering.

// Gameplay gallery images used in the Story section.
// Replace these paths later if you add newer screenshots.
const gameplayItems = [
  {
    title: "Level Selection",
    type: "Screenshots",
    description: "Level 1 selection screen showing the game's menu presentation and stage setup.",
    image: "assets/images/Level 1 Selection.png",
    alt: "Level 1 selection screen from The Last Stronghold"
  },
  {
    title: "Main Menu Environment",
    type: "World Visual",
    description: "Main menu background artwork that helps establish the game's atmosphere and tone.",
    image: "assets/images/Menu Background.png",
    alt: "Menu background image from The Last Stronghold"
  },
  {
    title: "Obelisk Defense Focus",
    type: "Objective",
    description: "The central obelisk visual that represents the core objective the player must protect.",
    image: "assets/images/Obelisk Black.png",
    alt: "Obelisk image from The Last Stronghold"
  },
  {
    title: "Poster Visual",
    type: "Gameplay Art",
    description: "Promotional poster art suitable for game overview sections and presentation use.",
    image: "assets/images/GamePoster.png",
    alt: "Game poster image from The Last Stronghold"
  }
];

// Promotional and feature-focused images.
const promoItems = [
  {
    title: "Corrupted Shard",
    type: "Feature Visual",
    description: "A dark artifact visual reinforcing the game's corruption theme and fantasy identity.",
    image: "assets/images/Corrupted Shard.png",
    alt: "Corrupted Shard image from The Last Stronghold"
  },
  {
    title: "Amethyst Crystal",
    type: "Arcane Asset",
    description: "A magical crystal visual that supports the arcane tone and resource-driven look of the project.",
    image: "assets/images/Amethyst Crystal.png",
    alt: "Amethyst Crystal image from The Last Stronghold"
  },
  {
    title: "Arcane Cannon",
    type: "Defense Tool",
    description: "A defensive weapon asset that highlights the tower defense mechanics and magical technology.",
    image: "assets/images/Arcane Cannon.png",
    alt: "Arcane Cannon image from The Last Stronghold"
  },
  {
    title: "Options Menu",
    type: "Interface",
    description: "Settings and interface screen showcasing the game's user-facing menu design.",
    image: "assets/images/Option Menu.png",
    alt: "Options menu image from The Last Stronghold"
  }
];

// Extra media section for branding and presentation visuals.
const extraItems = [
  {
    title: "Title Artwork",
    type: "Branding",
    description: "The main title art used in the landing section for a stronger first impression.",
    image: "assets/images/Game Title.png",
    alt: "Game title artwork for The Last Stronghold"
  },
  {
    title: "Poster Artwork",
    type: "Presentation",
    description: "A flexible capstone poster-style visual that also works well in documentation and gallery layouts.",
    image: "assets/images/GamePoster.png",
    alt: "Poster artwork for The Last Stronghold"
  }
];

// Documentation cards.
// "filePath" is the exact file opened by both the View and Download buttons.
const documentationItems = [
  {
    title: "Software Design Specification (SDS)",
    description: "Technical design details, system structure, and implementation planning for the capstone project.",
    filePath: "assets/docs/TheLastStronghold_SDS _1.2.pdf",
    thumbnail: "assets/images/GamePoster.png",
    available: true
  },
  {
    title: "Software Requirements Specification (SRS)",
    description: "Formal requirements, gameplay goals, and scope definition for The Last Stronghold.",
    filePath: "assets/docs/TheLastStronghold_SRS.pdf",
    thumbnail: "assets/images/Menu Background.png",
    available: true
  },
  {
    title: "Project Story / Narrative Document",
    description: "Three-act story document used as the narrative basis for the game's world and presentation.",
    filePath: "assets/docs/The_Last_Strongholds_Story_Three_Acts.pdf",
    thumbnail: "assets/images/Obelisk Black.png",
    available: true
  },
  {
    title: "Capstone Poster",
    description: "Poster-style visual presentation asset using the current game poster image.",
    filePath: "assets/images/GamePoster.png",
    thumbnail: "assets/images/GamePoster.png",
    available: true
  },
  {
    title: "Other Supporting Documents",
    description: "Reserve this slot for future additions such as testing notes, presentation slides, or appendices.",
    filePath: "",
    thumbnail: "assets/images/Option Menu.png",
    available: false
  }
];

const gameplayGallery = document.getElementById("gameplayGallery");
const promoGallery = document.getElementById("promoGallery");
const extraGallery = document.getElementById("extraGallery");
const docsGrid = document.getElementById("docsGrid");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const trailerVideo = document.getElementById("trailerVideo");
const trailerFallback = document.getElementById("trailerFallback");
const soundToggle = document.getElementById("soundToggle");
const downloadModal = document.getElementById("downloadModal");
const openDownloadModal = document.getElementById("openDownloadModal");
const openDownloadModalSecondary = document.getElementById("openDownloadModalSecondary");
const closeDownloadModal = document.getElementById("closeDownloadModal");
const downloadForm = document.getElementById("downloadForm");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("submitDownloadForm");
const dobInput = document.getElementById("dob");
const ageVerifiedInput = document.getElementById("ageVerified");
const submitButtonDefaultText = submitButton ? submitButton.textContent : "Submit and Download";

function safePath(path) {
  // Encodes spaces safely so files like "Game Title.png" still work in the browser.
  return encodeURI(path);
}

function renderGallery(target, items) {
  // Build media cards from the arrays above so they stay easy to edit later.
  target.innerHTML = items
    .map(
      (item) => `
        <article class="gallery-card card">
          <div class="gallery-frame">
            <img class="gallery-image" src="${safePath(item.image)}" alt="${item.alt}">
          </div>
          <div class="gallery-copy">
            <span class="gallery-tag">${item.type}</span>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderDocumentation() {
  // Each documentation card can be turned on later by changing "available" to true.
  docsGrid.innerHTML = documentationItems
    .map((item) => {
      const viewClass = item.available ? "button button-secondary" : "button button-secondary is-disabled";
      const downloadClass = item.available ? "button button-primary" : "button button-primary is-disabled";
      const resolvedPath = item.available ? safePath(item.filePath) : "#documentation";
      const thumbnailPath = safePath(item.thumbnail);

      return `
        <article class="doc-card card">
          <div class="doc-card-header">
            <img class="doc-thumbnail" src="${thumbnailPath}" alt="${item.title} preview">
          </div>
          <div class="doc-card-body">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="doc-actions">
              <a
                class="${viewClass}"
                href="${resolvedPath}"
                ${item.available ? 'target="_blank" rel="noreferrer"' : 'aria-disabled="true"'}
              >
                View
              </a>
              <a
                class="${downloadClass}"
                href="${resolvedPath}"
                ${item.available ? "download" : 'aria-disabled="true"'}
              >
                Download
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setMaxDobToToday() {
  // Prevent future dates from being selected in the browser UI.
  const today = new Date().toISOString().split("T")[0];
  dobInput.max = today;
}

function closeMenu() {
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

function updateActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const scrollPosition = window.scrollY + 140;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const id = section.getAttribute("id");
    const matchingLink = document.querySelector(`.nav-link[href="#${id}"]`);

    if (!matchingLink) {
      return;
    }

    matchingLink.classList.toggle(
      "is-active",
      scrollPosition >= sectionTop && scrollPosition < sectionBottom
    );
  });
}

function openModal() {
  downloadModal.classList.add("is-open");
  downloadModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  formStatus.textContent = "";
  document.getElementById("fullName").focus();
}

function closeModal() {
  downloadModal.classList.remove("is-open");
  downloadModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setStatus(message, state = "") {
  formStatus.textContent = message;
  formStatus.className = "form-status";

  if (state) {
    formStatus.classList.add(`is-${state}`);
  }
}

function calculateAge(dateString) {
  const dob = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(dob.getTime())) {
    return NaN;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!birthdayHasPassed) {
    age -= 1;
  }

  return age;
}

function validateDownloadForm(formData) {
  const name = formData.get("name").toString().trim();
  const email = formData.get("email").toString().trim();
  const dob = formData.get("dob").toString();
  const ageVerified = formData.get("ageVerified") === "on";

  if (!name || !email || !dob) {
    return "Please complete all required fields.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }

  const age = calculateAge(dob);

  if (Number.isNaN(age)) {
    return "Please provide a valid date of birth.";
  }

  if (age < 18) {
    return "You must be at least 18 years old to download this beta.";
  }

  if (!ageVerified) {
    return "Please confirm that you are at least 18 years old.";
  }

  return "";
}

async function handleDownloadSubmit(event) {
  event.preventDefault();

  // Stop accidental double-click submits while the current request is still running.
  if (submitButton.disabled) {
    return;
  }

  const formData = new FormData(downloadForm);
  const validationMessage = validateDownloadForm(formData);

  if (validationMessage) {
    setStatus(validationMessage, "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Preparing Download...";
  setStatus("Checking your details and preparing the beta download...", "");

  // This is the exact JSON body sent to the Cloudflare Pages Function.
  const payload = {
    name: formData.get("name").toString().trim(),
    email: formData.get("email").toString().trim(),
    dob: formData.get("dob").toString(),
    ageVerified: formData.get("ageVerified") === "on"
  };

  try {
    // The frontend validates first for usability, then the backend validates again for security.
    const response = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "The download request could not be completed.");
    }

    // If the backend approves the form, start the file download immediately.
    setStatus("Success. Your free beta download is starting now.", "success");

    const downloadLink = document.createElement("a");
    downloadLink.href = result.downloadUrl;
    downloadLink.download = "";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    downloadForm.reset();

    window.setTimeout(() => {
      closeModal();
    }, 1200);
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = submitButtonDefaultText;
  }
}

function setupTrailer() {
  // If the local placeholder MP4 is missing, show a clear note instead of a blank player.
  trailerVideo.addEventListener("error", () => {
    trailerFallback.hidden = false;
  });

  soundToggle.addEventListener("click", () => {
    trailerVideo.muted = !trailerVideo.muted;
    soundToggle.textContent = trailerVideo.muted ? "Unmute Trailer" : "Mute Trailer";

    if (trailerVideo.paused) {
      trailerVideo.play().catch(() => {
        // Some browsers block playback changes until user interaction.
      });
    }
  });
}

function setupModal() {
  openDownloadModal.addEventListener("click", openModal);
  if (openDownloadModalSecondary) {
    openDownloadModalSecondary.addEventListener("click", openModal);
  }
  closeDownloadModal.addEventListener("click", closeModal);

  downloadModal.addEventListener("click", (event) => {
    const target = event.target;

    if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && downloadModal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function setupNavigation() {
  navToggle.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
  updateActiveNav();
}

function init() {
  // Exit early if the page structure is incomplete during local edits.
  if (!gameplayGallery || !promoGallery || !extraGallery || !docsGrid || !downloadForm || !ageVerifiedInput) {
    return;
  }

  renderGallery(gameplayGallery, gameplayItems);
  renderGallery(promoGallery, promoItems);
  renderGallery(extraGallery, extraItems);
  renderDocumentation();
  setMaxDobToToday();
  setupTrailer();
  setupModal();
  setupNavigation();
  downloadForm.addEventListener("submit", handleDownloadSubmit);
}

init();
