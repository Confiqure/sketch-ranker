import { useState } from 'react'
import PageMeta from '@/components/PageMeta'
import { ROUTES } from '@/site.config'
import { useSession, signIn } from 'next-auth/react'
import { trpc } from '../utils/trpc'

// Sketch + image management. Server-side every mutation is gated on the
// ADMIN_EMAILS allowlist (adminProcedure) — this page just renders the result.
const AdminPage = () => {
  const { data: session, status } = useSession()
  const utils = trpc.useUtils()
  const {
    data: sketches,
    isLoading,
    error,
  } = trpc.admin.listSketches.useQuery(undefined, {
    enabled: !!session,
    retry: false,
  })

  const invalidate = () => utils.admin.listSketches.invalidate()
  const createSketch = trpc.admin.createSketch.useMutation({ onSuccess: invalidate })
  const updateSketch = trpc.admin.updateSketch.useMutation({ onSuccess: invalidate })
  const deleteSketch = trpc.admin.deleteSketch.useMutation({ onSuccess: invalidate })
  const addImage = trpc.admin.addImage.useMutation({ onSuccess: invalidate })
  const deleteImage = trpc.admin.deleteImage.useMutation({ onSuccess: invalidate })

  const { data: voters } = trpc.admin.listVoters.useQuery(undefined, {
    enabled: !!session,
    retry: false,
  })
  const invalidateVoters = () => utils.admin.listVoters.invalidate()
  const addVoter = trpc.admin.addVoter.useMutation({ onSuccess: invalidateVoters })
  const removeVoter = trpc.admin.removeVoter.useMutation({ onSuccess: invalidateVoters })

  const [newSketch, setNewSketch] = useState({ title: '', collection: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState({ title: '', collection: '', description: '' })
  const [imageDrafts, setImageDrafts] = useState<Record<string, string>>({})
  const [newVoter, setNewVoter] = useState('')

  if (status === 'loading')
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-xl text-gray-700">
        Loading...
      </div>
    )

  if (!session)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin</h1>
        <button
          onClick={() => signIn('google', { callbackUrl: '/admin' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin</h1>
        <p className="text-lg text-gray-600">
          {error.data?.code === 'FORBIDDEN'
            ? 'This account is not on the admin list.'
            : error.message}
        </p>
      </div>
    )

  const startEdit = (s: {
    id: string
    title: string
    collection: string | null
    description: string | null
  }) => {
    setEditingId(s.id)
    setEdit({ title: s.title, collection: s.collection ?? '', description: s.description ?? '' })
  }

  const saveEdit = (id: string) => {
    updateSketch.mutate({ id, ...edit })
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageMeta title="Admin" path={ROUTES.admin} noIndex />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Sketch Admin</h1>

        {/* Voter allowlist — voting is sign-in + allowlist gated */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Allowed voters</h2>
          <p className="text-sm text-gray-500 mb-3">
            Admins can always vote. Everyone else needs their Google email added here.
          </p>
          <div className="flex gap-2 mb-3">
            <input
              className="border rounded-lg px-3 py-2 flex-1 text-gray-800"
              placeholder="friend@example.com"
              type="email"
              value={newVoter}
              onChange={(e) => setNewVoter(e.target.value)}
            />
            <button
              disabled={!newVoter.includes('@') || addVoter.isPending}
              onClick={() => {
                addVoter.mutate({ email: newVoter })
                setNewVoter('')
              }}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Add voter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {voters?.length === 0 && (
              <p className="text-sm text-gray-500">No voters yet — add the first email above.</p>
            )}
            {voters?.map((v) => (
              <span
                key={v.email}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
              >
                {v.email}
                <button
                  onClick={() => removeVoter.mutate({ email: v.email })}
                  className="text-red-500 hover:text-red-700 font-bold"
                  aria-label={`Remove ${v.email}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add a sketch */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Add sketch</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="border rounded-lg px-3 py-2 flex-1 text-gray-800"
              placeholder="Title"
              value={newSketch.title}
              onChange={(e) => setNewSketch({ ...newSketch, title: e.target.value })}
            />
            <input
              className="border rounded-lg px-3 py-2 flex-1 text-gray-800"
              placeholder="Collection (e.g. Season 1, Episode 1: …)"
              value={newSketch.collection}
              onChange={(e) => setNewSketch({ ...newSketch, collection: e.target.value })}
            />
            <input
              className="border rounded-lg px-3 py-2 flex-1 text-gray-800"
              placeholder="Description"
              value={newSketch.description}
              onChange={(e) => setNewSketch({ ...newSketch, description: e.target.value })}
            />
            <button
              disabled={!newSketch.title || createSketch.isPending}
              onClick={() => {
                createSketch.mutate(newSketch)
                setNewSketch({ title: '', collection: '', description: '' })
              }}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Sketch table */}
        {isLoading ? (
          <p className="text-gray-700">Loading sketches…</p>
        ) : (
          <div className="space-y-3">
            {sketches?.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-lg shadow-md">
                {editingId === s.id ? (
                  <div className="flex flex-col md:flex-row gap-2 mb-2">
                    <input
                      className="border rounded-lg px-3 py-2 flex-1 text-gray-800"
                      value={edit.title}
                      onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                    />
                    <input
                      className="border rounded-lg px-3 py-2 flex-1 text-gray-800"
                      value={edit.collection}
                      onChange={(e) => setEdit({ ...edit, collection: e.target.value })}
                    />
                    <input
                      className="border rounded-lg px-3 py-2 flex-1 text-gray-800"
                      value={edit.description}
                      onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                    />
                    <button
                      onClick={() => saveEdit(s.id)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{s.title}</p>
                      <p className="text-sm text-gray-500">{s.collection}</p>
                      <p className="text-sm text-gray-600">{s.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Elo {Math.round(s.rating)} · {s._count.votesWon}W / {s._count.votesLost}L ·{' '}
                        {s.images.length} image(s)
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(s)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${s.title}" and its votes/images?`))
                            deleteSketch.mutate({ id: s.id })
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Images */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {s.images.map((img) => (
                    <span
                      key={img.id}
                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                    >
                      {img.fileName}
                      <button
                        onClick={() => deleteImage.mutate({ id: img.id })}
                        className="text-red-500 hover:text-red-700 font-bold"
                        aria-label={`Remove ${img.fileName}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    className="border rounded px-2 py-1 text-sm text-gray-800"
                    placeholder="meme file name (S3)"
                    value={imageDrafts[s.id] ?? ''}
                    onChange={(e) => setImageDrafts({ ...imageDrafts, [s.id]: e.target.value })}
                  />
                  <button
                    disabled={!imageDrafts[s.id]}
                    onClick={() => {
                      addImage.mutate({ sketchId: s.id, fileName: imageDrafts[s.id] ?? '' })
                      setImageDrafts({ ...imageDrafts, [s.id]: '' })
                    }}
                    className="bg-gray-700 text-white text-sm px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    Add image
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
