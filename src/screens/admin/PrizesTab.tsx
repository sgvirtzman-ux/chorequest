import { prizeIcons } from '../../assets'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import { CatalogTab } from './CatalogTab'

export function PrizesTab() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <CatalogTab
      kindLabel="prize"
      valueLabel="Cost"
      valueStep={5}
      icons={prizeIcons}
      defaultIconId="coins-few"
      items={data.prizes
        .filter((p) => !p.archived)
        .map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          iconId: p.iconId,
          value: p.cost,
        }))}
      onAdd={(item) =>
        dispatch({
          type: 'ADD_PRIZE',
          prize: {
            name: item.name,
            description: item.description,
            iconId: item.iconId,
            cost: item.value,
          },
        })
      }
      onUpdate={(id, item) =>
        dispatch({
          type: 'UPDATE_PRIZE',
          id,
          patch: {
            name: item.name,
            description: item.description,
            iconId: item.iconId,
            cost: item.value,
          },
        })
      }
      onDelete={(id) => dispatch({ type: 'DELETE_PRIZE', id })}
      deleteWarning="It will disappear from the shop. Past redemptions are kept."
    />
  )
}
