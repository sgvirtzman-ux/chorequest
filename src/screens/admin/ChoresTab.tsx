import { choreIcons } from '../../assets'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import { CatalogTab } from './CatalogTab'

export function ChoresTab() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <CatalogTab
      kindLabel="quest"
      valueLabel="Points"
      valueStep={5}
      icons={choreIcons}
      defaultIconId="trash-cans"
      items={data.chores
        .filter((c) => !c.archived)
        .map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          iconId: c.iconId,
          value: c.points,
        }))}
      onAdd={(item) =>
        dispatch({
          type: 'ADD_CHORE',
          chore: {
            name: item.name,
            description: item.description,
            iconId: item.iconId,
            points: item.value,
          },
        })
      }
      onUpdate={(id, item) =>
        dispatch({
          type: 'UPDATE_CHORE',
          id,
          patch: {
            name: item.name,
            description: item.description,
            iconId: item.iconId,
            points: item.value,
          },
        })
      }
      onDelete={(id) => dispatch({ type: 'DELETE_CHORE', id })}
      deleteWarning="It will disappear from every player's weekly assignments. Past completions keep their points."
    />
  )
}
