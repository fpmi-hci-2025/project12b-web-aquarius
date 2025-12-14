import { useState, ChangeEvent } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  createNewBook,
  resetCreateBook,
  CreateBookPayload,
} from "../../store/createBookSlice"
import style from "./CreateBook.module.scss"
import Input from "../../Components/Input/Input"

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, coverImage: e.target.files[0] })
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    const cleanedData: CreateBookPayload = {
      ...formData,
      authors: formData.authors.filter((a) => a.trim()),
      genres: formData.genres.filter((g) => g.trim()),
    }

    if (!cleanedData.title.trim()) return alert("Title is required")
    if (!cleanedData.publisher.trim()) return alert("Publisher is required")
    if (cleanedData.authors.length === 0) return alert("At least one author")
    if (cleanedData.price <= 0) return alert("Price must be > 0")
    if (cleanedData.quantity <= 0) return alert("Quantity must be > 0")
    if (
      cleanedData.publicationYear < 1900 ||
      cleanedData.publicationYear > new Date().getFullYear()
    ) {
      return alert(
        `Publication year must be between 1900 and ${new Date().getFullYear()}`
      )
    }

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
          {(error.includes("Session expired") || error.includes("sign in")) && (
            <button
              onClick={() => navigate("/sign-in")}
              className={style.signInBtn}
            >
              Sign In Again
            </button>
          )}
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
        <Input
          title="Title *"
          name="title"
          type="text"
          placeholder="Enter book title"
          value={formData.title}
          inputEvent={handleInputChange}
        />

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
        <Input
          title="Publisher *"
          name="publisher"
          type="text"
          placeholder="Enter publisher"
          value={formData.publisher}
          inputEvent={handleInputChange}
        />

        {/* Authors */}
        <div className={style.formGroup}>
          <label>Authors *</label>
          {formData.authors.map((author, index) => (
            <div key={index} className={style.arrayItem}>
              <Input
                title=""
                name={`author-${index}`}
                type="text"
                placeholder="Enter author"
                value={author}
                inputEvent={(e) =>
                  handleArrayChange(index, "authors", e.target.value)
                }
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
              <Input
                title=""
                name={`genre-${index}`}
                type="text"
                placeholder="Enter genre"
                value={genre}
                inputEvent={(e) =>
                  handleArrayChange(index, "genres", e.target.value)
                }
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
        <Input
          title="Publication Year"
          name="publicationYear"
          type="number"
          value={formData.publicationYear}
          inputEvent={handleInputChange}
        />

        {/* Page Count */}
        <Input
          title="Page Count"
          name="pageCount"
          type="number"
          value={formData.pageCount}
          inputEvent={handleInputChange}
        />

        {/* Weight */}
        <Input
          title="Weight (g)"
          name="weight"
          type="number"
          value={formData.weight}
          inputEvent={handleInputChange}
        />

        {/* Price */}
        <Input
          title="Price *"
          name="price"
          type="number"
          value={formData.price}
          inputEvent={handleInputChange}
        />

        {/* Quantity */}
        <Input
          title="Quantity in Stock *"
          name="quantity"
          type="number"
          value={formData.quantity}
          inputEvent={handleInputChange}
        />

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
