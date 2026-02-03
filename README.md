<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/GabrielLacerda000/zendo">
    <img src="src/assets/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Zendo</h3>

  <p align="center">
    A local-first desktop to-do application built with Tauri v2 + Vue 3 + TypeScript
    <br />
    <a href="https://github.com/GabrielLacerda000/zendo"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/GabrielLacerda000/zendo/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/GabrielLacerda000/zendo/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Zendo is a local-first desktop to-do application that keeps your data on your machine. Built with modern technologies, it offers a fast and responsive experience with features like drag-and-drop organization, system tray integration, and customizable todo lists.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Vue][Vue.js]][Vue-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Tauri][Tauri]][Tauri-url]
* [![Vite][Vite]][Vite-url]
* [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
* [![Pinia][Pinia]][Pinia-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

* [Bun](https://bun.sh/) - JavaScript runtime and package manager
* [Rust](https://www.rust-lang.org/tools/install) - Required for Tauri
* [Node.js](https://nodejs.org/) - JavaScript runtime

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/GabrielLacerda000/zendo.git
   ```
2. Install dependencies
   ```sh
   bun install
   ```
3. Run in development mode
   ```sh
   bun run tauri dev
   ```
4. Build for production
   ```sh
   bun run tauri build
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Zendo provides a clean interface for managing your tasks:

- **Create and organize todos** - Add tasks with titles, descriptions, and priority levels
- **Organize with lists** - Group related todos into custom lists
- **Drag and drop** - Reorder tasks and move them between lists
- **Checklists** - Break down tasks into smaller subtasks
- **System tray** - Quick access from your system tray for adding tasks on the fly

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [ ] Due dates and reminders
- [ ] Markdown description
- [ ] Data export/import
- [ ] Themes and customization

See the [open issues](https://github.com/GabrielLacerda000/zendo/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Project Link: [https://github.com/GabrielLacerda000/zendo](https://github.com/GabrielLacerda000/zendo)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/GabrielLacerda000/zendo.svg?style=for-the-badge
[contributors-url]: https://github.com/GabrielLacerda000/zendo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/GabrielLacerda000/zendo.svg?style=for-the-badge
[forks-url]: https://github.com/GabrielLacerda000/zendo/network/members
[stars-shield]: https://img.shields.io/github/stars/GabrielLacerda000/zendo.svg?style=for-the-badge
[stars-url]: https://github.com/GabrielLacerda000/zendo/stargazers
[issues-shield]: https://img.shields.io/github/issues/GabrielLacerda000/zendo.svg?style=for-the-badge
[issues-url]: https://github.com/GabrielLacerda000/zendo/issues
[license-shield]: https://img.shields.io/github/license/GabrielLacerda000/zendo.svg?style=for-the-badge
[license-url]: https://github.com/GabrielLacerda000/zendo/blob/main/LICENSE

<!-- Tech Stack Badges -->
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tauri]: https://img.shields.io/badge/Tauri-24C8D8?style=for-the-badge&logo=tauri&logoColor=white
[Tauri-url]: https://tauri.app/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Pinia]: https://img.shields.io/badge/Pinia-F7D336?style=for-the-badge&logo=vue.js&logoColor=white
[Pinia-url]: https://pinia.vuejs.org/
