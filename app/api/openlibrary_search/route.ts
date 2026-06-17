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

    // 2. Wir schneiden auf solide 50 Treffer zu (Ohne Sub-Requests verkraftet die API das locker!)
    const books = data.docs.slice(0, 50).map((book: any) => {
      let displayIsbn = 'Keine ISBN vorhanden';
      
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

      let genres = ['Kein Genre angegeben'];
      if (book.subject && book.subject.length > 0) {
        // .slice(0, 3) nimmt nur die ersten drei Einträge, damit die Liste nicht zu lang wird
        genres = book.subject.slice(0, 3);
      }

      return {
        title: book.title,
        author: book.author_name?.[0] || 'Unbekannter Autor',
        isbn: displayIsbn,
        publishDate: publishDate,
        coverKey: book.cover_edition_key || null,
        genres: genres.join(', ')
      };
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
  }
}