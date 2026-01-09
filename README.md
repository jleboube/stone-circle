# GeoHypothesis Explorer

## Discover the Hidden Power Beneath Your Feet

GeoHypothesis Explorer is an AI-powered web application that helps users identify optimal locations for testing the ancient stone circle hypothesis. By analyzing geological data, fault lines, and mineral deposits near any location, the app recommends sites that align with the combined theory that stone circles were electromagnetic harvesters, consciousness amplifiers, and lightning conduits.

### The Hypothesis

Ancient stone circles weren't just monuments—they may have been sophisticated energy machines tapping into Earth's natural forces:

- **Electromagnetic Harvesters**: Stone circles may have captured and concentrated Earth's natural electromagnetic fields, creating zones of amplified energy through piezoelectric properties of granite and quartz.

- **Consciousness Amplifiers**: These ancient structures could have served as geophysical amplifiers for altered states of consciousness, enhancing meditation, healing, and spiritual experiences.

- **Telluric Conduits**: Positioned at geological fault lines and mineral deposits, stone circles may have acted as conductors for Earth's telluric currents and lightning energy.

---

## Features

- **Interactive 3D Visualization**: Stunning Three.js-powered stone circle animation on the landing page
- **Google Maps Integration**: Address autocomplete and interactive map display with site markers
- **Multi-Provider AI Support**: Choose from OpenAI (GPT-4), Anthropic (Claude), Google Gemini, or xAI (Grok)
- **Geological Analysis**: AI-powered analysis of fault lines, mineral deposits, and geological features
- **Site Recommendations**: Get 3 optimal locations within 10-20 miles of your address
- **Stone Circle Specifications**: Custom recommendations for stone types, dimensions, and placement
- **Testing Guidance**: Measurement techniques and testing protocols for your experiments
- **PDF Export**: Download your complete analysis report

---

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Maps**: Google Maps API (Places Autocomplete, Geocoding, Maps JavaScript API)
- **Styling**: Tailwind CSS with custom teal/cyan theme
- **Animation**: Framer Motion
- **AI Integration**: OpenAI, Anthropic, Google Generative AI SDKs
- **Deployment**: Docker, Docker Compose

---

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Google Maps API key (for address autocomplete and maps)
- API key from at least one AI provider (OpenAI, Anthropic, Google, or xAI)

### Installation

**1. Clone the repository:**
```bash
git clone https://gitea.my-house.dev/joe/stone-circle.git
cd stone-circle
```

**2. Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` and add your Google Maps API key:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**3. Build and run with Docker:**
```bash
docker compose up -d
```

**4. Access the application:**

Open your browser and navigate to: **http://localhost:31415**

---

## Usage

1. **Explore the Hypothesis**: Read about the three pillars of the stone circle hypothesis on the landing page
2. **Enter Your Location**: Use the address input with Google Maps autocomplete to verify your location
3. **Select AI Provider**: Choose your preferred AI provider and enter your API key
4. **Analyze**: Click "Discover Power Spots Near You" to start the geological analysis
5. **Review Results**: Explore the recommended sites on the interactive map
6. **Export**: Download your complete analysis as a PDF report

---

## Local Development

### Without Docker

**1. Install dependencies:**
```bash
npm install
```

**2. Run development server:**
```bash
npm run dev
```

**3. Access at:** http://localhost:3000

### With Docker

```bash
docker compose up --build
```

Access at: http://localhost:31415

---

## Project Structure

```
stone-circle/
├── src/
│   ├── app/
│   │   ├── api/analyze/     # AI analysis endpoint
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main page
│   ├── components/
│   │   ├── Explorer.tsx     # Location input & AI config
│   │   ├── GoogleMapDisplay.tsx  # Google Maps component
│   │   ├── LandingPage.tsx  # Hero & hypothesis content
│   │   ├── ResultsDisplay.tsx    # Analysis results
│   │   └── StoneCircle3D.tsx     # 3D visualization
│   ├── lib/
│   │   ├── constants.ts     # API keys & config
│   │   └── utils.ts         # Utility functions
│   └── types/
│       └── index.ts         # TypeScript definitions
├── docker-compose.yml       # Docker configuration
├── Dockerfile              # Multi-stage build
├── tailwind.config.ts      # Tailwind theme (teal/cyan)
└── package.json            # Dependencies
```

---

## API Key Security

- Your AI provider API keys are **never stored** on our servers
- Keys are sent directly to the respective AI providers
- All API calls are made server-side for security
- Google Maps API key is used client-side for maps functionality

---

## Disclaimer

This is an exploratory tool based on speculative hypotheses. The theories presented are not scientifically proven. Users are responsible for their safety and legal compliance when visiting any suggested locations. Always obtain proper permissions before accessing private land.

---

## Contributing

Contributions are welcome! If you have ideas, suggestions, or bug reports:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

This project is licensed under the MIT License.

---

## Author

**Joe LeBoube**

- Website: [joeleboube.com](https://joeleboube.com)
- Email: joeleboube@gmail.com

---

2026 Copyright - Joe LeBoube
