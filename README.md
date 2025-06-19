# 🗺️ Chemnitz360

**Chemnitz360** is an interactive web application designed to help tourists and locals explore the cultural heritage of Chemnitz, Germany. The platform combines mapping, categorization, search, and user interaction to create a dynamic cultural directory.

---

## 🌟 Features

### 🎯 Main Functionality
- **Map and List Views**: Cultural sites are presented on a navigable map and as a categorized list.
- **Categorized Exploration**: Browse by categories such as Museums, Monuments, Architecture, etc.
- **Search & Filter**: Find cultural sites by keywords or specific categories.
- **Detailed Info Pages**: View comprehensive information depending on the type of cultural site.

### 👤 User Features
- **User Registration & Login**: Register and manage personal details, including your current location.
- **Favorites System**: Save and manage favorite cultural sites to a personal list.
- **Location-Based Personalization**: See relevant nearby cultural sites based on current user location (optional).

---

## 🧩 Data Sources

### 🏛️ Open Government Data (OGD)
- Previous year's dataset obtained from the [Chemnitz ARCGIS Portal](https://geoportal.chemnitz.de/arcgis).

### 🌍 Open Community Data
- In the current iteration, cultural site data is gathered from a **community-driven open data initiative**, ensuring openness and collaborative enrichment of the dataset.

*Note: All data used respects open data licensing and attribution requirements.*

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|-------------|---------------------------------|
| Frontend     | Vue.js, Leaflet.js (Map)        |
| Backend      | Node.js / Express (optional)    |
| Data Format  | GeoJSON, JSON                   |
| Auth         | Firebase / Auth0 / Custom JWT   |
| Map API      | OpenStreetMap / Overpass API    |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Vue CLI
- Git

### Installation
```bash
git clone https://github.com/<your-org-or-username>/chemnitz360.git
cd chemnitz360
npm install
npm run dev
