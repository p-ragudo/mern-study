import { useNavigate, useParams} from "react-router";
import { useState, useEffect } from "react";
import api from "../lib/axios";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

const DetailsPage = () => {
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch(error) {
        console.log("Error in fetchNote", error);
        toast.error("Failed to display note");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNote();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();

    if(!window.confirm("Are you sure you want to delete this note?")) return;

    setIsDeleting(true);

    try {
      await api.delete(`/notes/${id}`);
      navigate("/");
      toast.success("Successfully deleted note!");
    } catch(error) {
      console.log("Error in handleDelete() in DetailsPage.jsx", error)
      if(error.response.status === 429) {
        toast.error("Too many requests! Try again in a bit")
      } else {
        toast.error("Failed to delete note")
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault()

    if(!note.title.trim() || !note.content.trim()) {
      toast.error("Invalid changes.\nAll fields are required")
      return; 
    }

    setIsSaving(true);
    const title = note.title;
    const content = note.content;

    try {
      await api.put(`/notes/${id}`, {
        title,
        content
      })

      toast.success("Changes saved successfully!");
      navigate("/");
    } catch(error) {
      console.log("Error in handleSave() in DetailsPage.jsx", error);
      if(error.response.status === 429) {
        toast.error("Too many requests! Try again in a bit")
      } else {
        toast.error("Failed to save changes. Please try again")
      }
    } finally {
      setIsSaving(false);
    }

  };

  if(isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center"> 
        <LoaderIcon className="animate-spin size-10" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="size-5" /> Back to Notes
            </Link>
            <button onClick={(e) => handleDelete(e)} className="btn btn-error btn-outline" disabled={isDeleting}>
              <Trash2Icon className="size-5" /> {isDeleting ? "Deleting note..." : "Delete Note"}
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">

              <form onSubmit={handleSave}>
                <div className="form-control mb-4">

                  <label className="label mb-2">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Loading title..."
                    className="input input-bordered mb-6"
                    value={note.title}
                    onChange={(e) => setNote({ ...note, title: e.target.value })} 
                  />

                  <label className="label mb-2">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Loading content..."
                    className="textarea textarea-bordered h-32 mb-6"
                    value={note.content}
                    onChange = {(e) => setNote({...note, content: e.target.value})}
                  />

                  <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? "Loading..." : "Save"}
                    </button>
                  </div>
                </div>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailsPage
