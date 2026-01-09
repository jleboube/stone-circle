# Product Requirements Document (PRD): GeoHypothesis Explorer Website

## 1. Document Overview
### 1.1 Purpose
This PRD outlines the requirements for developing a web application called "GeoHypothesis Explorer." The platform enables users to input their address (or location) and receive AI-generated recommendations for testing a combined hypothesis about ancient stone circles. The hypothesis posits that these structures functioned as electromagnetic energy harvesters, geophysical amplifiers for consciousness alteration and healing, and conduits for lightning/telluric currents, leveraging Earth's natural powers like mineral deposits and electromagnetic fields.

The site will:
- Analyze location-specific geological, geophysical, and environmental data to suggest optimal test sites.
- Provide specifications for mimicking ancient stone circles, including rock size, type, circle diameter, and setup requirements.
- Offer guidance on testing and measuring the hypothesis using accessible tools.
- Integrate with Generative AI (GenAI) providers, allowing users to input their own API keys for personalized, on-demand intelligence.

This document serves as a blueprint for developers, designers, and stakeholders to build, test, and launch the MVP (Minimum Viable Product).

### 1.2 Version History
- Version 1.0: Initial draft (January 8, 2026)
- Author: Joe LeBoube

### 1.3 Scope
- In Scope: User input for location, AI-driven site recommendations, stone circle specs, testing methods, GenAI integration.
- Out of Scope: Physical construction assistance, legal permitting for land use, real-time hardware integration (e.g., sensors), mobile app version.

### 1.4 Assumptions
- Users have basic technical literacy to input API keys and interpret AI outputs.
- GenAI providers (e.g., OpenAI, Anthropic, Grok/xAI, Google Gemini) support API access for text generation.
- Data analysis relies on publicly available geological sources; no proprietary data collection.
- Ethical considerations: The site will include disclaimers about safety, legality, and pseudoscientific nature of the hypothesis.

### 1.5 Risks and Mitigations
- Risk: Inaccurate AI recommendations due to GenAI hallucinations. Mitigation: Use structured prompts and validate against reliable data sources.
- Risk: API key security. Mitigation: Client-side handling only; no server storage of keys.
- Risk: High API costs for users. Mitigation: Provide usage estimates and low-cost prompt optimization.
- Risk: Legal issues (e.g., trespassing on suggested sites). Mitigation: Mandatory disclaimers and user acknowledgments.

## 2. Business Goals and Objectives
### 2.1 Goals
- Empower users to explore alternative theories on ancient stone circles through interactive, location-based AI analysis.
- Democratize access to geophysical hypothesis testing by integrating user-provided GenAI keys.
- Foster community interest in Earth's "lost powers" by providing educational, speculative content.

### 2.2 Success Metrics
- User engagement: 1,000+ unique users in first 3 months.
- Completion rate: 70% of users generate a full report.
- Feedback: NPS score > 7/10 via post-report surveys.
- Technical: <5% error rate in AI integrations.

## 3. Target Audience
- Primary: Enthusiasts of ancient mysteries, pseudoscience, geology hobbyists, and alternative history researchers (e.g., ages 25-55, tech-savvy).
- Secondary: Educators, students, or citizen scientists interested in DIY experiments.
- User Personas:
  - "Curious Explorer": Lives in rural areas, wants local test sites for personal experiments.
  - "Tech-Savvy Researcher": Provides API keys for advanced customizations.

## 4. Functional Requirements
### 4.1 User Registration and Authentication
- Optional sign-up via email/Google for saving reports; guest mode for one-time use.
- API Key Input: Secure form to enter keys for GenAI providers (e.g., dropdown for provider selection: OpenAI, xAI/Grok, etc.). Keys are used client-side or via secure proxy to avoid storage.

### 4.2 Core Features
#### 4.2.1 Location Input and Site Analysis
- User inputs: Address (e.g., street, city, state, ZIP) or coordinates (lat/long).
- Backend Process:
  - Geocode input using free APIs (e.g., Google Maps API or OpenStreetMap).
  - Generate a prompt for the selected GenAI (using user's key) to analyze data.
  - Prompt Structure: Similar to the provided AI prompt in previous interactions, querying for 3 prioritized sites within 10-20 miles, focusing on faults, minerals, magnetic anomalies, lightning frequency, etc.
  - Output: 3 site suggestions with descriptions, coordinates, geological alignments to hypotheses, and risks (e.g., seismic activity).

#### 4.2.2 Stone Circle Specifications
- AI-Generated Recommendations:
  - Rock Type: Prioritize piezoelectric/conductive rocks mimicking ancients (e.g., granite, quartz-rich sarsen, bluestone with high metal content). Suggest local sourcing (e.g., query USGS for nearby quarries).
  - Rock Size: Based on scale (e.g., small test: 1-2 ft height/50-100 lbs; mimic Stonehenge: 10-20 ft/several tons, but scaled down for feasibility).
  - Circle Diameter: 10-30 meters for full mimicry (e.g., Stonehenge ~30m), adjustable for space (e.g., 5-10m for backyard tests).
  - Other Requirements: Number of stones (e.g., 12-30 for symmetry), orientation (e.g., align to magnetic north or solstice), depth of embedding (1-2 ft for stability), and tools needed (e.g., compass, level).
  - Prompt Integration: GenAI uses historical data (e.g., from web-sourced knowledge on sites like Stonehenge, Avebury) to customize per location.

#### 4.2.3 Testing and Measurement Guidance
- AI-Generated Methods:
  - Electromagnetic Harvesting: Use multimeters or EMF meters to measure voltage/currents before/after setup; test during vibrations (e.g., sound rituals).
  - Geophysical Amplification: Subjective (meditation logs) or objective (wearable EEG devices like Muse to track brainwaves; apps for heart rate variability).
  - Lightning/Telluric Conduits: Lightning detectors or soil testers for ionization; weather apps for storm tracking; measure ground resistance with ohmmeters.
  - Success Criteria: Detectable changes (e.g., >10% EM field increase); user logs for perceptual effects.
  - Safety: Include warnings (e.g., avoid storms, consult experts).

#### 4.2.4 Report Generation
- Compile into a downloadable PDF/HTML report: Sites, specs, testing steps, visuals (e.g., maps via Leaflet.js).
- Customization: Allow users to tweak prompts (e.g., radius, focus on one hypothesis).

### 4.3 User Flow
1. Homepage: Welcome, hypothesis overview, input form for location and API key.
2. Submit: Validate inputs; trigger GenAI query (e.g., via JavaScript fetch to provider API).
3. Processing: Loading spinner with estimated time (based on API response).
4. Results: Interactive page with maps, lists, and expandable sections for specs/testing.
5. Export/Share: Buttons for PDF download, email, or social share.

## 5. Non-Functional Requirements
### 5.1 Performance
- Response Time: <10 seconds for AI queries (optimize prompts to <1,000 tokens).
- Scalability: Handle 100 concurrent users (cloud hosting e.g., AWS/Heroku).

### 5.2 Security
- API Keys: Handled client-side (e.g., in-browser calls) or via encrypted proxy.
- Data Privacy: No storage of personal data; comply with GDPR/CCPA.
- Input Validation: Sanitize addresses to prevent injection attacks.

### 5.3 Usability
- UI/UX: Responsive design (mobile/desktop) using frameworks like React.js.
- Accessibility: WCAG 2.1 compliance (alt text, keyboard nav).
- Languages: English only for MVP.

### 5.4 Reliability
- Error Handling: Graceful failures (e.g., invalid API key → prompt re-entry).
- Uptime: 99% via monitoring tools.

## 6. Technical Architecture
### 6.1 Frontend
- Framework: React.js or Vue.js for interactive forms/maps.
- Libraries: Leaflet/OpenLayers for site mapping; Chart.js for visual data (e.g., EM field graphs).

### 6.2 Backend
- Language: Node.js/Python (Flask/Django) for API orchestration.
- Database: Minimal (e.g., SQLite for session data; no user storage needed).

### 6.3 Integrations
- GenAI: SDKs for providers (e.g., OpenAI API, xAI API). User keys passed in headers.
- Data Sources: Embed prompts to query public APIs/USGS data via GenAI (e.g., "Search USGS for minerals near [location]").
- Geocoding: Free tier of Nominatim or Google Geocoding API.

### 6.4 Deployment
- Hosting: Vercel/Netlify for frontend; AWS Lambda for backend.
- CI/CD: GitHub Actions for automated builds.

## 7. Testing and Quality Assurance
- Unit Tests: For form validation, API calls.
- Integration Tests: End-to-end flows with mock AI responses.
- User Testing: Beta with 10-20 users for feedback.
- Security Audit: Third-party scan for vulnerabilities.

## 8. Timeline and Resources
- Phase 1: Design/Prototyping (2 weeks).
- Phase 2: Development (4-6 weeks).
- Phase 3: Testing/Launch (2 weeks).
- Resources: 1-2 developers, 1 designer, AI specialist for prompt engineering.

## 9. Appendices
### 9.1 Sample AI Prompt for Site Analysis
(As per previous interactions; embed in code for GenAI calls.)

### 9.2 Disclaimers
All outputs are speculative; users assume responsibility for safety and legality.

