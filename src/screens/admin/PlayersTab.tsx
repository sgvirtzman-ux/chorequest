import { useState } from 'react'
import type { Player } from '../../types'
import { avatars } from '../../assets'
import { AvatarBadge } from '../../components/AvatarBadge'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { IconPicker } from '../../components/IconPicker'
import { Modal } from '../../components/Modal'
import { NumberStepper } from '../../components/NumberStepper'
import { PixelButton } from '../../components/PixelButton'
import { PointsBadge } from '../../components/PointsBadge'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import styles from './admin.module.css'

interface FormState {
  id: string | null // null = new player
  name: string
  age: number
  gender: string
  avatarId: string
}

export function PlayersTab() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()
  const [form, setForm] = useState<FormState | null>(null)
  const [deleting, setDeleting] = useState<Player | null>(null)
  const [error, setError] = useState('')

  const openNew = () =>
    setForm({ id: null, name: '', age: 8, gender: '', avatarId: 'unicorn' })
  const openEdit = (p: Player) =>
    setForm({ id: p.id, name: p.name, age: p.age, gender: p.gender, avatarId: p.avatarId })

  const save = () => {
    if (!form) return
    if (form.name.trim() === '') {
      setError('Every hero needs a name!')
      return
    }
    const patch = {
      name: form.name.trim(),
      age: form.age,
      gender: form.gender.trim(),
      avatarId: form.avatarId,
    }
    if (form.id === null) dispatch({ type: 'ADD_PLAYER', player: patch })
    else dispatch({ type: 'UPDATE_PLAYER', id: form.id, patch })
    setForm(null)
    setError('')
  }

  return (
    <>
      <div className={styles.toolbar}>
        <PixelButton size="small" onClick={openNew}>
          + New hero
        </PixelButton>
      </div>

      {data.players.length === 0 ? (
        <p className={styles.empty}>No players yet — add your first hero!</p>
      ) : (
        <div className={styles.list}>
          {data.players.map((p) => (
            <div key={p.id} className={styles.row}>
              <AvatarBadge avatarId={p.avatarId} size="small" />
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{p.name}</span>
                <span className={styles.rowSub}>
                  age {p.age}
                  {p.gender ? ` · ${p.gender}` : ''} · {p.lifetimePoints} lifetime pts
                </span>
              </div>
              <PointsBadge points={p.pointsBank} size="small" />
              <div className={styles.rowActions}>
                <PixelButton variant="teal" size="small" onClick={() => openEdit(p)}>
                  Edit
                </PixelButton>
                <PixelButton variant="danger" size="small" onClick={() => setDeleting(p)}>
                  Delete
                </PixelButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {form ? (
        <Modal
          title={form.id === null ? 'New hero' : 'Edit hero'}
          onClose={() => {
            setForm(null)
            setError('')
          }}
          wide
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="player-name">
              Name
            </label>
            <input
              id="player-name"
              value={form.name}
              maxLength={20}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Age</span>
            <NumberStepper
              label="age"
              value={form.age}
              min={1}
              max={99}
              onChange={(age) => setForm({ ...form, age })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="player-gender">
              Gender
            </label>
            <input
              id="player-gender"
              value={form.gender}
              maxLength={20}
              placeholder="girl, boy, …"
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Avatar</span>
            <IconPicker
              icons={avatars}
              value={form.avatarId}
              onChange={(avatarId) => setForm({ ...form, avatarId })}
              label="avatar"
            />
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.formButtons}>
            <PixelButton variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </PixelButton>
            <PixelButton onClick={save}>Save hero</PixelButton>
          </div>
        </Modal>
      ) : null}

      {deleting ? (
        <ConfirmDialog
          title="Delete player?"
          variant="danger"
          message={
            <>
              Remove <strong>{deleting.name}</strong> and all their chore history,
              points and prize redemptions? This cannot be undone.
            </>
          }
          confirmLabel="Delete"
          onConfirm={() => {
            dispatch({ type: 'DELETE_PLAYER', id: deleting.id })
            setDeleting(null)
          }}
          onCancel={() => setDeleting(null)}
        />
      ) : null}
    </>
  )
}
