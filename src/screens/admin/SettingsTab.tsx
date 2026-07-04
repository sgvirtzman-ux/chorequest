import { useRef, useState } from 'react'
import type { Weekday } from '../../types'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { PixelButton } from '../../components/PixelButton'
import { PixelPanel } from '../../components/PixelPanel'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import { exportStateFile, importStateFile } from '../../storage/exportImport'
import styles from './admin.module.css'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function SettingsTab() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [importError, setImportError] = useState('')
  const [confirmingImport, setConfirmingImport] = useState<File | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const savePin = () => {
    if (!/^\d{4}$/.test(pin1)) {
      setPinMsg({ ok: false, text: 'PIN must be exactly 4 digits.' })
      return
    }
    if (pin1 !== pin2) {
      setPinMsg({ ok: false, text: 'PINs do not match — try again.' })
      return
    }
    dispatch({ type: 'UPDATE_SETTINGS', patch: { parentPin: pin1 } })
    setPin1('')
    setPin2('')
    setPinMsg({ ok: true, text: 'PIN updated!' })
  }

  const doImport = async (file: File) => {
    try {
      const imported = await importStateFile(file)
      dispatch({ type: 'IMPORT_STATE', data: imported })
      setImportError('')
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'That file could not be read.')
    }
  }

  return (
    <>
      <PixelPanel title="Game settings">
        <div className={styles.field}>
          <label className={styles.label} htmlFor="week-start">
            Week starts on
          </label>
          <select
            id="week-start"
            value={data.settings.weekStartDay}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_SETTINGS',
                patch: { weekStartDay: Number(e.target.value) as Weekday },
              })
            }
          >
            {WEEKDAYS.map((day, i) => (
              <option key={day} value={i}>
                {day}
              </option>
            ))}
          </select>
          <p className={styles.note}>
            Changing this re-sorts past quests into the new week windows.
          </p>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Sound effects</span>
          <PixelButton
            variant={data.settings.soundMuted ? 'ghost' : 'teal'}
            size="small"
            onClick={() =>
              dispatch({
                type: 'UPDATE_SETTINGS',
                patch: { soundMuted: !data.settings.soundMuted },
              })
            }
          >
            {data.settings.soundMuted ? '🔇 Muted — tap to unmute' : '🔊 On — tap to mute'}
          </PixelButton>
        </div>
      </PixelPanel>

      <PixelPanel title="Parent PIN" color="pink">
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pin-new">
            New 4-digit PIN
          </label>
          <input
            id="pin-new"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin1}
            onChange={(e) => setPin1(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pin-confirm">
            Repeat PIN
          </label>
          <input
            id="pin-confirm"
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin2}
            onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        {pinMsg ? (
          <p className={pinMsg.ok ? styles.note : styles.error}>{pinMsg.text}</p>
        ) : null}
        <div className={styles.formButtons}>
          <PixelButton size="small" onClick={savePin}>
            Save PIN
          </PixelButton>
        </div>
      </PixelPanel>

      <PixelPanel title="Backup & data" color="gold">
        <p className={styles.note}>
          Game data lives in this browser. Export a backup file to keep it safe or
          move it to another device.
        </p>
        <div className={styles.formButtons}>
          <PixelButton variant="teal" size="small" onClick={() => exportStateFile(data)}>
            ⇩ Export backup
          </PixelButton>
          <PixelButton
            variant="teal"
            size="small"
            onClick={() => fileInput.current?.click()}
          >
            ⇧ Import backup
          </PixelButton>
          <PixelButton variant="danger" size="small" onClick={() => setConfirmingReset(true)}>
            Reset to sample data
          </PixelButton>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Import backup file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setConfirmingImport(file)
            e.target.value = ''
          }}
        />
        {importError ? <p className={styles.error}>{importError}</p> : null}
      </PixelPanel>

      {confirmingImport ? (
        <ConfirmDialog
          title="Import backup?"
          variant="danger"
          message="Importing replaces ALL current players, chores, prizes and history with the backup file's contents."
          confirmLabel="Replace everything"
          onConfirm={() => {
            void doImport(confirmingImport)
            setConfirmingImport(null)
          }}
          onCancel={() => setConfirmingImport(null)}
        />
      ) : null}

      {confirmingReset ? (
        <ConfirmDialog
          title="Reset everything?"
          variant="danger"
          message="This wipes all players, chores, prizes, points and history, and restores the built-in sample family. Export a backup first if unsure!"
          confirmLabel="Wipe & reset"
          onConfirm={() => {
            dispatch({ type: 'RESET_TO_SEED' })
            setConfirmingReset(false)
          }}
          onCancel={() => setConfirmingReset(false)}
        />
      ) : null}
    </>
  )
}
