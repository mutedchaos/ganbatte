import BusinessEntity from '../../models/BusinessEntity'
import { businessEntityRepository } from '../../repositories'

export default async function getBusinessEntityPossiblyCreatingOne(name: string) {
  const searchName = name.trim().toLowerCase()
  const entity = await businessEntityRepository.findOne({ nameLower: searchName })
  if (entity) return entity

  const newEntity = new BusinessEntity(name.trim())
  await businessEntityRepository.save(newEntity)

  return newEntity
}
