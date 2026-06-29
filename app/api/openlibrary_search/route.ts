import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Suchbegriff fehlt' }, { status: 400 });
  }

  const trimmedQuery = query.trim();
  
  const isIsbn = /^[0-9-]{10,17}$/.test(trimmedQuery.replace(/-/g, ''));

  let apiUrl = '';
  if (isIsbn) {
    apiUrl = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(trimmedQuery)}`;
  } else {
    apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmedQuery)}`;
  }

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'OpenLibrary API Fehler' }, { status: response.status });
    }

    const data = await response.json();

    if (!data.docs || data.docs.length === 0) {
      return NextResponse.json([]);
    }

    const books = [];
    const openLibraryDocs = data.docs.slice(0, 50);

    for (const book of openLibraryDocs) {
      let displayIsbn = 'Keine ISBN vorhanden';
      let genres = 'Keine Genres';
      
      if (book.ia && book.ia.length > 0) {
        const isbnEntry = book.ia.find((id: string) => id.startsWith('isbn_'));
        if (isbnEntry) {
          displayIsbn = isbnEntry.replace('isbn_', '');
        }
      } 
      
      if (displayIsbn === 'Keine ISBN vorhanden' && book.isbn && book.isbn.length > 0) {
        displayIsbn = book.isbn[0];
      }

      const publishDate = book.first_publish_year 
        ? String(book.first_publish_year) 
        : 'Unbekanntes Veröffentlichungsdatum';

      if (displayIsbn !== 'Keine ISBN vorhanden') {
        try {
          const appleUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(book.title)}&media=ebook&country=DE`;
          const response = await fetch(appleUrl);
          
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

      books.push({
        title: book.title,
        author: book.author_name?.[0] || 'Unbekannter Autor',
        isbn: displayIsbn,
        publishDate: publishDate,
        coverKey: book.cover_edition_key || null,
        genres: genres,
        // NEU: Seitenanzahl aus OpenLibrary als Fallback
        number_of_pages: book.number_of_pages_median || book.number_of_pages || 0,
      });
    }

    return NextResponse.json(books);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
  }
}