import { IBookCard } from "../types/types"

export const mapBackendBookToDetails = (book: any): IBookCard => ({
  // Keep the pre-computed isbn13 from fetchBooks (or fall back to id)
  isbn13: book.isbn13 || book.id || "",
  id: book.id,
  title: book.title || "No title",
  subtitle: book.subtitle || "",
  // Normalize price to a display string consistent with SelectedBook
  price:
    book.price !== undefined && book.price !== null
      ? `$${book.price}`
      : "$0.00",
  image: book.base64CoverImage
    ? `data:image/jpeg;base64,${book.base64CoverImage}`
    : "/placeholder.png",
  url: book.url || (book.id ? `/books/${book.id}` : "/"),
  authors: Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.authors || "",
  publisher: book.publisher || "",
  pages: book.pageCount ? book.pageCount.toString() : book.pages || "",
  desc: book.description || "",
})
