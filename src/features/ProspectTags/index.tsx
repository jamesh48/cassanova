import { useMemo } from 'react'
import MultiComboBox from '@/components/MultiCombobox'
import {
  useAppendTagToProspectMutation,
  useCreateUserTagMutation,
  useDeleteTagFromProspectMutation,
  useGetUserTagsQuery,
} from '@/redux/services'
import type { Tag } from '@/types'

interface ProspectTagsProps {
  prospectId: number
  existingTagValue: Tag[]
}

const ProspectTags = ({ prospectId, existingTagValue }: ProspectTagsProps) => {
  const { data: userTags } = useGetUserTagsQuery()

  const filteredTagOptions = useMemo(() => {
    return (
      userTags?.reduce<string[]>((acc, userTag) => {
        if (
          !existingTagValue.find(
            (existingTag) => existingTag.name === userTag.name,
          )
        ) {
          return acc.concat(userTag.name)
        }
        return acc
      }, []) || []
    )
  }, [userTags, existingTagValue])

  const [triggerCreateUserTag] = useCreateUserTagMutation()
  const [triggerDeleteTagFromProspect] = useDeleteTagFromProspectMutation()
  const [triggerAppendTagToProspect] = useAppendTagToProspectMutation()

  const handleSubmit = async (tagName: string) => {
    const existingTag = userTags?.find((tag) => tag.name === tagName)

    const tagId = existingTag
      ? existingTag.id
      : (await triggerCreateUserTag({ name: tagName }).unwrap()).id

    await triggerAppendTagToProspect({ tagId, prospectId }).unwrap()
  }

  const onDelete = async (tagName: string) => {
    const tagId = existingTagValue.find(
      (existingTag) => existingTag.name === tagName,
    )?.id

    if (tagId) {
      await triggerDeleteTagFromProspect({ tagId, prospectId }).unwrap()
    }
  }

  return (
    <MultiComboBox
      onSubmit={handleSubmit}
      options={filteredTagOptions}
      value={existingTagValue.map((tag) => tag.name)}
      label='Prospect Tags'
      mode='form'
      handleDelete={onDelete}
    />
  )
}

export default ProspectTags
