# JSON Database System for GitHub Pages

This project implements a client-side JSON database system for your GitHub Pages site. It allows users to submit questions and names that are stored in a JSON file-like structure.

## Files Included

- `data/questions.json` - The main database file (sample structure)
- `ask.html` - Page for submitting questions
- `questions.html` - Page for viewing all questions
- `js/json-db.js` - JavaScript utility for database operations

## How It Works

### For GitHub Pages (Static Hosting)

Since GitHub Pages is a static hosting service, it cannot write files directly. The system uses:

1. `localStorage` to persist data in the browser
2. A JSONDatabase utility class that simulates file operations
3. JSON structure similar to what would be used with actual file operations

### For Dynamic Environments

If you deploy this to a server that supports file operations, you can modify the `JSONDatabase` class to actually write to files by uncommenting the file operations and removing the localStorage fallbacks.

## Setting Up on GitHub Pages

1. The system is already configured to work on GitHub Pages using localStorage
2. When a user submits a question, it gets stored in their browser's localStorage
3. The data persists for that user across visits but is not shared between users

## Extending the System

### Adding More Data Types

To add more types of data, simply modify the structure in the JavaScript to include additional collections:

```javascript
const db = new JSONDatabase('my-data.json');
// Add different types of records
await db.addRecord('comments', { /* comment data */ });
await db.addRecord('reviews', { /* review data */ });
```

### Server-Side Integration

For true persistence across users, you would need to set up a backend API:

1. Replace the file operations in `JSONDatabase` with API calls
2. Create server endpoints to handle reading/writing the JSON file
3. Deploy the backend to a service that supports file operations

## Features

- Form for submitting questions with name
- Display of all questions with timestamps
- Search functionality
- Status tracking (open/answered)
- Responsive design
- Local storage fallback for static hosting

## Customizing

1. Modify the `questions.json` file structure to suit your needs
2. Update the UI in `ask.html` and `questions.html` to match your site's styling
3. Enhance the `JSONDatabase` class with additional methods as needed