import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  createNewBook,
  resetCreateBook,
  CreateBookPayload,
} from "../../store/createBookSlice"
import style from "./CreateBook.module.scss"

const CreateBook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { auth, username } = useSelector((state: any) => state.signIn)
  const { loading, error, success } = useSelector(
    (state: any) => state.createBook
  )

  const [formData, setFormData] = useState({
    coverImage: null as File | null,
    title: "",
    description: "",
    publicationYear: new Date().getFullYear(),
    pageCount: 0,
    weight: 0,
    price: 0,
    quantity: 0,
    publisher: "",
    authors: [""],
    genres: [""],
  })

  // Check if user is admin
  const isAdmin = auth && username === "admin@mail.ru"

  if (!isAdmin) {
    return (
      <div className={style.notAuthorized}>
        <h1>Access Denied</h1>
        <p>Only admin users can access this page.</p>
        <button onClick={() => navigate("/")} className={style.backButton}>
          Go Back to Home
        </button>
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, coverImage: e.target.files[0] })
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]:
        name === "pageCount" ||
        name === "weight" ||
        name === "quantity" ||
        name === "publicationYear"
          ? parseInt(value) || 0
          : name === "price"
          ? parseFloat(value) || 0
          : value,
    })
  }

  const handleArrayChange = (
    index: number,
    field: "authors" | "genres",
    value: string
  ) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addArrayItem = (field: "authors" | "genres") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    })
  }

  const removeArrayItem = (index: number, field: "authors" | "genres") => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Filter out empty strings from authors and genres
    const cleanedData: CreateBookPayload = {
      ...formData,
      authors: formData.authors.filter((a) => a.trim()),
      genres: formData.genres.filter((g) => g.trim()),
    }

    if (!cleanedData.title.trim()) {
      alert("Title is required")
      return
    }

    if (!cleanedData.publisher.trim()) {
      alert("Publisher is required")
      return
    }

    if (cleanedData.authors.length === 0) {
      alert("At least one author is required")
      return
    }

    if (cleanedData.price <= 0) {
      alert("Price must be greater than 0")
      return
    }

    if (cleanedData.quantity <= 0) {
      alert("Quantity must be greater than 0")
      return
    }

    if (
      cleanedData.publicationYear < 1900 ||
      cleanedData.publicationYear > new Date().getFullYear()
    ) {
      alert(
        `Publication year must be between 1900 and ${new Date().getFullYear()}`
      )
      return
    }

    console.log("Submitting book data:", cleanedData)
    await dispatch(createNewBook(cleanedData) as any)
    setFormData({
      coverImage: null,
      title: "",
      description: "",
      publicationYear: new Date().getFullYear(),
      pageCount: 0,
      weight: 0,
      price: 0,
      quantity: 0,
      publisher: "",
      authors: [""],
      genres: [""],
    })
  }

  return (
    <div className={style.createBookContainer}>
      <div className={style.header}>
        <h1>Create New Book</h1>
        <p className={style.adminBadge}>Admin Panel</p>
      </div>

      {success && (
        <div className={style.successMessage}>
          Book created successfully! Redirecting...
          {setTimeout(() => {
            dispatch(resetCreateBook() as any)
            navigate("/")
          }, 2000)}
        </div>
      )}

      {error && (
        <div className={style.errorMessage}>
          <p>Error: {error}</p>
          {error.includes("Session expired") || error.includes("sign in") ? (
            <button
              onClick={() => navigate("/sign-in")}
              className={style.signInBtn}
            >
              Sign In Again
            </button>
          ) : null}
        </div>
      )}

      <form onSubmit={handleSubmit} className={style.form}>
        {/* Cover Image */}
        <div className={style.formGroup}>
          <label>Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {formData.coverImage && (
            <p className={style.fileName}>
              Selected: {formData.coverImage.name}
            </p>
          )}
        </div>

        {/* Title */}
        <div className={style.formGroup}>
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter book title"
          />
        </div>

        {/* Description */}
        <div className={style.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter book description"
            rows={4}
          />
        </div>

        {/* Publisher */}
        <div className={style.formGroup}>
          <label>Publisher *</label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleInputChange}
            placeholder="Enter publisher name"
            required
          />
        </div>

        {/* Authors */}
        <div className={style.formGroup}>
          <label>Authors *</label>
          {formData.authors.map((author, index) => (
            <div key={index} className={style.arrayItem}>
              <input
                type="text"
                value={author}
                onChange={(e) =>
                  handleArrayChange(index, "authors", e.target.value)
                }
                placeholder="Enter author name"
              />
              {formData.authors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "authors")}
                  className={style.removeBtn}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("authors")}
            className={style.addBtn}
          >
            + Add Author
          </button>
        </div>

        {/* Genres */}
        <div className={style.formGroup}>
          <label>Genres</label>
          {formData.genres.map((genre, index) => (
            <div key={index} className={style.arrayItem}>
              <input
                type="text"
                value={genre}
                onChange={(e) =>
                  handleArrayChange(index, "genres", e.target.value)
                }
                placeholder="Enter genre"
              />
              {formData.genres.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "genres")}
                  className={style.removeBtn}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("genres")}
            className={style.addBtn}
          >
            + Add Genre
          </button>
        </div>

        {/* Publication Year */}
        <div className={style.formGroup}>
          <label>Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleInputChange}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        {/* Page Count */}
        <div className={style.formGroup}>
          <label>Page Count</label>
          <input
            type="number"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        {/* Weight */}
        <div className={style.formGroup}>
          <label>Weight (g)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            min="0"
            step="0.1"
          />
        </div>

        {/* Price */}
        <div className={style.formGroup}>
          <label>Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {/* Quantity */}
        <div className={style.formGroup}>
          <label>Quantity in Stock *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        {/* Buttons */}
        <div className={style.buttonGroup}>
          <button type="submit" disabled={loading} className={style.submitBtn}>
            {loading ? "Creating..." : "Create Book"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className={style.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBook
