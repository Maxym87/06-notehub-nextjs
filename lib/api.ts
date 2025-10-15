import axios from "axios";
import type { Note, NewNote } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const fetchNotes = async (
  page: number,
  query: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    perPage: 12,
    page,
  };

  if (query.trim() !== "") {
    params.search = query;
  }

  const response = await axios.get<FetchNotesResponse>(
    "https://notehub-public.goit.study/api/notes",
    {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }
  );

  return response.data;
};

export const addNote = async (noteData: NewNote): Promise<Note> => {
  const res = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    noteData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteNote = async (noteId: number): Promise<Note> => {
  const res = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${noteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
