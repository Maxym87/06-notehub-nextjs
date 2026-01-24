"use client";

import { fetchNotes } from "@/lib/api";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

import styles from "./NotePage.module.css";

type NotesClientProps = {
  initialPage: number;
  initialQuery: string;
};

export default function NotesClient({
  initialPage,
  initialQuery,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isModal, setIsModal] = useState(false);
  const [debounsValue, setDebounseValue] = useState("");

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setDebounseValue(value);
    setCurrentPage(1);
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateSearchQuery(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, debounsValue),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={searchQuery} onSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
          />
        )}
        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <p className={styles.loading}>Loading notes...</p>}
      {isError && <p className={styles.error}>Server error!</p>}
      {data && !isLoading && <NoteList notes={data.notes} />}
      {isModal && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}
