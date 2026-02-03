import { Notebook } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 pt-10 mx-auto text-center">
      <div className="bg-primary/10 rounded-full p-8">
        <Notebook className="size-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold">No notes yet</h3>
      <p className="text-base-content/70">
        Create your first note by clicking the button below
      </p>
      <Link to="/create" className="btn btn-primary">
        Create your first note
      </Link>
    </div>
  )
}

export default NotesNotFound;
