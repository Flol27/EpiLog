import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Suchbegriff fehlt' }, { status: 400 });
  }

  const trimmedQuery = query.trim();
  
  // REGEX-CHECK: ISBN erkennen
  const isIsbn = /^[0-9-]{10,17}$/.test(trimmedQuery.replace(/-/g, ''));

  let apiUrl = '';
  if (isIsbn) {
    apiUrl = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(trimmedQuery)}`;
  } else {
    apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmedQuery)}`;
  }

  try {
    // 1. NUR EIN EINZIGER FETCH AN DIE API
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // 1 Stunde cachen
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'OpenLibrary API Fehler' }, { status: response.status });
    }

    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      return NextResponse.json([]);
    }

    // 1. Array für die fertigen Bücher vorbereiten
const books = [];

// 2. Wir schneiden auf die Docs zu
const openLibraryDocs = data.docs.slice(0, 50); // Am besten auf max. 5 drosseln, damit es schnell bleibt!

// 3. Echte sequentielle Schleife, die das "await" erlaubt!
for (const book of openLibraryDocs) {
  let displayIsbn = 'Keine ISBN vorhanden';
  let genres = 'Keine Genres';
  
  // Suche im "ia"-Array nach "isbn_"
  if (book.ia && book.ia.length > 0) {
    const isbnEntry = book.ia.find((id: string) => id.startsWith('isbn_'));
    if (isbnEntry) {
      displayIsbn = isbnEntry.replace('isbn_', '');
    }
  } 
  
  // Fallback auf das normale "isbn"-Array
  if (displayIsbn === 'Keine ISBN vorhanden' && book.isbn && book.isbn.length > 0) {
    displayIsbn = book.isbn[0];
  }

  const publishDate = book.first_publish_year 
    ? String(book.first_publish_year) 
    : 'Unbekanntes Veröffentlichungsdatum';

  // HIER warten wir jetzt brav, bis Apple antwortet, BEVOR das Buch dem Array hinzugefügt wird
  if (displayIsbn !== 'Keine ISBN vorhanden') {
    try {
      const appleUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(book.title)}&media=ebook&country=DE`;
      const response = await fetch(appleUrl); // Wartet synchronisiert auf den Netzwerk-Request
      
      if (response.ok) {
        const appleData = await response.json();
        if (appleData.results && appleData.results.length > 0) {
          const appleBook = appleData.results[0];
          if (appleBook && appleBook.genres) {
            genres = appleBook.genres[0];
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden von Apple:", error);
    }
  }

  // Erst wenn alle Daten (inklusive Apple) bereitstehen, pushen wir das Buch in die Liste
  books.push({
    title: book.title,
    author: book.author_name?.[0] || 'Unbekannter Autor',
    isbn: displayIsbn,
    publishDate: publishDate,
    coverKey: book.cover_edition_key || null,
    genres: genres
  });
}

    return NextResponse.json(books);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
  }
}