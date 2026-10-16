import React from 'react'

const Notes = ({ notes = [] }) => (
  <section className="rounded-xl border border-[#232A46] bg-[#111832] p-6">
    <h2 className="text-lg font-semibold text-white">Notes</h2>
    {notes.length ? (
      <div className="mt-4 space-y-4">
        {notes.map((note, index) => (
          <article key={`${note.date}-${index}`} className="border-l-2 border-[#0059F7] pl-4">
            <div className="flex flex-wrap justify-between gap-2 text-sm text-[#4F5A84]"><span>{note.author}</span><time>{note.date}</time></div>
            <p className="mt-1 text-base leading-relaxed text-white">{note.text}</p>
          </article>
        ))}
      </div>
    ) : <p className="mt-4 text-base text-[#4F5A84]">No notes have been added yet.</p>}
  </section>
)

export default Notes
