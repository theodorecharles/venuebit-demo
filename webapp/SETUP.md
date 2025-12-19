# VenueBit WebApp - Quick Setup Guide

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Backend API running on port 4001 (optional for full functionality)
- Optimizely SDK key (required for A/B testing)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd /home/ted/demo-events-app/webapp
npm install
```

This will install all required packages:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Optimizely React SDK
- Axios

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and add your Optimizely SDK key:

```env
VITE_OPTIMIZELY_SDK_KEY=your_actual_sdk_key_here
VITE_API_BASE_URL=http://localhost:4001/api
```

**Get your Optimizely SDK key**:
1. Log in to Optimizely
2. Navigate to Settings → Environments
3. Copy the SDK key for your environment
4. Paste it in the `.env` file

### 3. Start Development Server

```bash
npm run dev
```

The app will start on http://localhost:4000

### 4. Verify Setup

Open http://localhost:4000 in your browser. You should see:

✅ Debug banner at the top
✅ User ID displayed
✅ Variation badge (Control or Enhanced)
✅ Event details for "event-001"
✅ Seat selection interface

## Optimizely Setup

### Required Configuration

Your Optimizely project must have:

**Feature Flag**:
- Name: `ticket_experience`
- Type: Feature Test
- Status: Running

**Variations**:
1. `control` - Standard experience (50% traffic)
2. `enhanced` - Premium experience (50% traffic)

**Events** (for tracking):
- `page_view`
- `add_to_cart`
- `checkout`
- `purchase` (with revenue tracking)

### Testing Variations

1. Click "New User ID" in the debug banner
2. Page will reload with a new user ID
3. Check the variation badge:
   - Blue badge = Control
   - Green badge = Enhanced
4. Keep generating new IDs until you see both variations

## Running Without Backend API

The app can run without the backend, but you'll see errors when:
- Loading event details
- Creating a cart
- Processing checkout

To test the UI only:
1. Comment out API calls in the components
2. Use mock data instead
3. Or implement a mock API handler with MSW

## Building for Production

```bash
npm run build
```

Outputs to `dist/` directory. Serve with:

```bash
npm run preview
```

## Docker Setup

Build the Docker image:

```bash
docker build -t venuebit-webapp .
```

Run the container:

```bash
docker run -p 4000:4000 \
  -e VITE_OPTIMIZELY_SDK_KEY=your_key \
  -e VITE_API_BASE_URL=http://localhost:4001/api \
  venuebit-webapp
```

## Common Issues

### "Module not found" errors
**Solution**: Run `npm install` again

### Optimizely not loading
**Solution**:
- Check SDK key in `.env`
- Verify experiment is running in Optimizely dashboard
- Check browser console for errors

### API connection errors
**Solution**:
- Ensure backend is running on port 4001
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS settings on backend

### Port 4000 already in use
**Solution**: Change port in `vite.config.ts`:
```typescript
server: {
  port: 4001, // or any available port
  host: '0.0.0.0'
}
```

### TypeScript errors
**Solution**:
```bash
npm install @types/node --save-dev
```

### Tailwind styles not applying
**Solution**:
1. Check `tailwind.config.js` content paths
2. Verify `postcss.config.js` exists
3. Restart dev server

## Development Workflow

### Recommended Flow

1. Start backend API (if available)
2. Start webapp: `npm run dev`
3. Open browser to http://localhost:4000
4. Test both variations
5. Monitor Optimizely dashboard for events

### File Watching

Vite provides Hot Module Replacement (HMR):
- Component changes reload instantly
- No page refresh needed
- State is preserved during updates

### Debugging

1. **React DevTools**: Install browser extension
2. **Optimizely**: Check window.optimizely in console
3. **Network**: Monitor API calls in DevTools
4. **Console**: Check for errors/warnings

## Project Structure Quick Reference

```
webapp/
├── src/
│   ├── pages/           # Route components
│   ├── components/      # UI components
│   ├── hooks/           # Custom hooks
│   ├── api/             # API clients
│   ├── store/           # State management
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── .env                 # Your environment variables
```

## Next Steps

After setup:

1. ✅ Verify both variations work
2. ✅ Test complete purchase flow
3. ✅ Check Optimizely event tracking
4. ✅ Review console for errors
5. ✅ Test responsive design
6. ✅ Verify native bridge (if in iOS)

## Additional Resources

- **README.md** - Full project documentation
- **PROJECT_SUMMARY.md** - Architecture overview
- **VARIATION_GUIDE.md** - A/B test details
- **Vite Docs**: https://vitejs.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Optimizely SDK**: https://docs.developers.optimizely.com/

## Support

Check console for errors and refer to:
1. Browser DevTools console
2. Network tab for API calls
3. Optimizely dashboard for experiment status
4. Backend API logs

## Success Criteria

You've completed setup when:

✅ App loads without errors
✅ Debug banner shows user ID and variation
✅ Can click through all pages
✅ Both variations are testable
✅ Optimizely events appear in dashboard
✅ No console errors

## Quick Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit

# Format code (if prettier configured)
npx prettier --write src/
```

Happy coding! 🚀
