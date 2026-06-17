import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Suchbegriff fehlt' }, { status: 400 });
  }

  const trimmedQuery = query.trim();
  
  // REGEX-CHECK: Besteht die Eingabe nur aus Zahlen und ist zwischen 10 und 13 Zeichen lang?
  // Wenn ja, ist es höchstwahrscheinlich eine ISBN.
  const isIsbn = /^[0-9-]{10,17}$/.test(trimmedQuery.replace(/-/g, ''));

  let apiUrl = '';
  if (isIsbn) {
    // Wenn es eine ISBN ist, filtern wir direkt nach dem ISBN-Parameter
    apiUrl = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(trimmedQuery)}`;
  } else {
    // Ansonsten normale Freitextsuche
    apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmedQuery)}`;
  }

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 0 } // 1 Stunde cachen
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'OpenLibrary API Fehler' }, { status: response.status });
    }

    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      return NextResponse.json([]);
    }

    // Wir limitieren auf die ersten 5 Treffer
    const books = await Promise.all(data.docs.slice(0, 5).map(async (book: any) => {
    let displayIsbn = 'Keine ISBN vorhanden';
    
    // 1. Dein funktionierender Code für das "ia"-Array
    if (book.ia && book.ia.length > 0) {
      const isbnEntry = book.ia.find((id: string) => id.startsWith('isbn_'));
      if (isbnEntry) {
        displayIsbn = isbnEntry.replace('isbn_', '');
      }
    } 
    
    // 2. Fallback auf das normale "isbn"-Array
    if (displayIsbn === 'Keine ISBN vorhanden' && book.isbn && book.isbn.length > 0) {
      displayIsbn = book.isbn[0];
    }

    // 3. DER NEUE RETTER: Fallback über den cover_edition_key
    // Wenn wir immer noch keine ISBN haben, aber ein konkretes Cover-Edition-Key existiert
    if (displayIsbn === 'Keine ISBN vorhanden' && book.cover_edition_key) {
      try {
        // Wir fragen die spezifische Edition-API ab
        const editionResponse = await fetch(`https://openlibrary.org/books/${book.cover_edition_key}.json`);
        if (editionResponse.ok) {
          const editionData = await editionResponse.json();
          
          // Edition-Objekte haben die ISBNs oft in "isbn_13" oder "isbn_10"
          if (editionData.isbn_13 && editionData.isbn_13.length > 0) {
            displayIsbn = editionData.isbn_13[0];
          } else if (editionData.isbn_10 && editionData.isbn_10.length > 0) {
            displayIsbn = editionData.isbn_10[0];
          }
        }
      } 
      catch (e) {
        console.error("Fehler beim Abrufen der Edition-ISBN", e);
      }
    }

    return {
      title: book.title,
      author: book.author_name?.[0] || 'Unbekannter Autor',
      isbn: displayIsbn,
    };
  }));

    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
  }
}