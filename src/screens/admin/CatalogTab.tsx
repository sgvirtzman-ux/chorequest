import { useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { IconPicker } from '../../components/IconPicker'
import { Modal } from '../../components/Modal'
import { NumberStepper } from '../../components/NumberStepper'
import { PixelButton } from '../../components/PixelButton'
import { PointsBadge } from '../../components/PointsBadge'
import styles from './admin.module.css'

/** Chores and prizes are the same shape to the UI: name/description/icon/value. */
export interface CatalogItem {
  id: string
  name: string
  description: string
  iconId: string
  value: number
}

interface Props {
  kindLabel: string // "quest" | "prize"
  valueLabel: string // "Points" | "Cost"
  valueStep: number
  icons: Record<string, string>
  items: CatalogItem[]
  defaultIconId: string
  onAdd: (item: Omit<CatalogItem, 'id'>) => void
  onUpdate: (id: string, patch: Omit<CatalogItem, 'id'>) => void
  onDelete: (id: string) => void
  deleteWarning: string
}

interface FormState extends Omit<CatalogItem, 'id'> {
  id: string | null
}

export function CatalogTab({
  kindLabel,
  valueLabel,
  valueStep,
  icons,
  items,
  defaultIconId,
  onAdd,
  onUpdate,
  onDelete,
  deleteWarning,
}: Props) {
  const [form, setForm] = useState<FormState | null>(null)
  const [deleting, setDeleting] = useState<CatalogItem | null>(null)
  const [error, setError] = useState('')

  const save = () => {
    if (!form) return
    if (form.name.trim() === '') {
      setError(`Every ${kindLabel} needs a name!`)
      return
    }
    const patch = {
      name: form.name.trim(),
      description: form.description.trim(),
      iconId: form.iconId,
      value: form.value,
    }
    if (form.id === null) onAdd(patch)
    else onUpdate(form.id, patch)
    setForm(null)
    setError('')
  }

  return (
    <>
      <div className={styles.toolbar}>
        <PixelButton
          size="small"
          onClick={() =>
            setForm({
              id: null,
              name: '',
              description: '',
              iconId: defaultIconId,
              value: valueStep,
            })
          }
        >
          + New {kindLabel}
        </PixelButton>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>Nothing here yet — create your first {kindLabel}!</p>
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.id} className={styles.row}>
              <img className={styles.rowIcon} src={icons[item.iconId]} alt="" />
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{item.name}</span>
                {item.description ? (
                  <span className={styles.rowSub}>{item.description}</span>
                ) : null}
              </div>
              <PointsBadge points={item.value} size="small" label={valueLabel} />
              <div className={styles.rowActions}>
                <PixelButton
                  variant="teal"
                  size="small"
                  onClick={() =>
                    setForm({
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      iconId: item.iconId,
                      value: item.value,
                    })
                  }
                >
                  Edit
                </PixelButton>
                <PixelButton variant="danger" size="small" onClick={() => setDeleting(item)}>
                  Delete
                </PixelButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {form ? (
        <Modal
          title={form.id === null ? `New ${kindLabel}` : `Edit ${kindLabel}`}
          onClose={() => {
            setForm(null)
            setError('')
          }}
          wide
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="catalog-name">
              Name
            </label>
            <input
              id="catalog-name"
              value={form.name}
              maxLength={40}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="catalog-desc">
              Description
            </label>
            <textarea
              id="catalog-desc"
              value={form.description}
              maxLength={120}
              rows={2}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>{valueLabel}</span>
            <NumberStepper
              label={valueLabel}
              value={form.value}
              min={valueStep}
              max={9999}
              step={valueStep}
              onChange={(value) => setForm({ ...form, value })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Icon</span>
            <IconPicker
              icons={icons}
              value={form.iconId}
              onChange={(iconId) => setForm({ ...form, iconId })}
              label="icon"
            />
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.formButtons}>
            <PixelButton variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </PixelButton>
            <PixelButton onClick={save}>Save</PixelButton>
          </div>
        </Modal>
      ) : null}

      {deleting ? (
        <ConfirmDialog
          title={`Delete ${kindLabel}?`}
          variant="danger"
          message={
            <>
              Delete <strong>{deleting.name}</strong>? {deleteWarning}
            </>
          }
          confirmLabel="Delete"
          onConfirm={() => {
            onDelete(deleting.id)
            setDeleting(null)
          }}
          onCancel={() => setDeleting(null)}
        />
      ) : null}
    </>
  )
}
