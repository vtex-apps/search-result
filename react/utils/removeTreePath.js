export const removeTreePath = props => {
  if (!props) {
    return {}
  }

  const { treePath, ...rest } = props
  return rest
}