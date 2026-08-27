# CHRONOS - Luxury Digital Sports Watch Website

A modern, animated scroll-based website for a luxury digital sports watch brand.

## Features

- **Scroll-based Hero Animation**: Smooth frame transitions as you scroll through the hero section
- **Luxury Design**: Clean, modern aesthetic with gradient accents and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Backend API**: Full REST API for products and contact inquiries
- **Performance Optimized**: Lazy loading, reduced motion support, and efficient animations

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Inter and Space Grotesk from Google Fonts

## Project Structure

```
/workspace
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # All styles
│   ├── app.js          # Frontend JavaScript
│   └── images/         # Image assets
├── server/
│   └── index.js        # Express backend server
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/inquiry` - Submit a contact inquiry
- `GET /api/inquiries` - Get all inquiries (admin)
- `GET /api/health` - Health check endpoint

## Scroll Animation

The hero section features a unique scroll-based animation that transitions through 4 frames:
1. **Introduction** - Main hero with watch display
2. **GPS Tracking** - Showcases navigation features
3. **Heart Rate Monitoring** - Displays biometric tracking
4. **Water Resistance** - Highlights durability features

As you scroll, the watch rotates and different feature displays are shown.

## Performance Features

- Throttled scroll event handlers
- CSS hardware-accelerated animations
- Lazy image loading support
- Reduced motion preference detection
- Service worker ready for offline support

## License

ISC
