import { useState } from 'react'
import { ScreenHeader } from '../../components/ScreenHeader'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import { getPendingApprovalsCount } from '../../state/selectors'
import { ApprovalsTab } from './ApprovalsTab'
import { AssignmentsTab } from './AssignmentsTab'
import { ChoresTab } from './ChoresTab'
import { PinGate } from './PinGate'
import { PlayersTab } from './PlayersTab'
import { PrizesTab } from './PrizesTab'
import { SettingsTab } from './SettingsTab'
import styles from './admin.module.css'

const TABS = ['Approvals', 'Players', 'Chores', 'Prizes', 'Assignments', 'Settings'] as const
type Tab = (typeof TABS)[number]

export function AdminScreen() {
  const { data, ui } = useAppState()
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState<Tab>('Approvals')

  if (!ui.adminUnlocked) return <PinGate />

  const pending = getPendingApprovalsCount(data)

  return (
    <div className={styles.screen}>
      <ScreenHeader
        title="⚙ Parent Zone"
        onBack={() => dispatch({ type: 'NAVIGATE', screen: 'title' })}
        backLabel="Exit"
      />

      <nav className={styles.tabBar} aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            {t === 'Approvals' && pending > 0 ? (
              <span className={styles.tabBadge}>{pending}</span>
            ) : null}
          </button>
        ))}
      </nav>

      {tab === 'Approvals' ? <ApprovalsTab /> : null}
      {tab === 'Players' ? <PlayersTab /> : null}
      {tab === 'Chores' ? <ChoresTab /> : null}
      {tab === 'Prizes' ? <PrizesTab /> : null}
      {tab === 'Assignments' ? <AssignmentsTab /> : null}
      {tab === 'Settings' ? <SettingsTab /> : null}
    </div>
  )
}
