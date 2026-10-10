# Devanshi & Utsav Wedding Invitation

A Next.js wedding invitation site with a dedicated animated invitation for Devanshi Sutaria.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/devanshi` to view Devanshi's invitation.

## Features

- Responsive wedding landing page with animated typography and couple photograph.
- Scratch-to-reveal golden invitation panel with a confetti burst when revealed.
- Background music using `public/background-sound.mp3`, with a user-controlled play/pause button and a soft 14% volume setting. Browsers require a user gesture before audio playback.
- Ceremony cards and a Google Maps directions link.
- No RSVP or attendance form.

## Invitation details

**Date:** Monday, 15 February 2027  
**Venue:** Surat Leva Patel Vadi, Bardoli, Gujarat  
**Haldi:** 8:00 AM, *Turmeric Tales*  
**Ganesh Sthapana:** 9:00 AM  
**Lagan:** 5:00 PM, *A Timeless Union*  
**Directions:** https://maps.app.goo.gl/M7wDB5sBMcZT3XeZ8


### Scratch card update
The scratch foil is initialized after the card has been laid out. The hidden content now shows only the date (15 February 2027); ceremony details remain in the page below. Scratching over 40% of the gold layer triggers the reveal and confetti.


Latest update: scratch reveal threshold is set to approximately 2% on both invitations. The wax-seal image has been removed from the curtain overlay.
