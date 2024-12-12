// app/admin/criteria/_actions.ts
import axios from 'axios'

export interface Criterion {
  id: string
  name: string
  description?: string
  weight: number
  isVotable: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateCriterionInput = {
  name: string
  description?: string
  weight: number
  isVotable: boolean
}

export type UpdateCriterionInput = Partial<CreateCriterionInput>

// Fetch all criteria
export async function fetchCriteria(): Promise<Criterion[]> {
  try {
    const response = await axios.get('/api/criteria')
    return response.data
  } catch (error) {
    console.error('Error fetching criteria:', error)
    throw new Error('Failed to fetch criteria')
  }
}

// Fetch a single criterion by ID
export async function fetchCriterionById(id: string): Promise<Criterion> {
  try {
    const response = await axios.get(`/api/criteria/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching criterion ${id}:`, error)
    throw new Error('Failed to fetch criterion')
  }
}

// Create a new criterion
export async function createCriterion(data: CreateCriterionInput): Promise<Criterion> {
  try {
    const response = await axios.post('/api/criteria', data)
    return response.data
  } catch (error) {
    console.error('Error creating criterion:', error)
    throw new Error('Failed to create criterion')
  }
}

// Update an existing criterion
export async function updateCriterion(
  id: string,
  data: UpdateCriterionInput
): Promise<Criterion> {
  try {
    const response = await axios.put(`/api/criteria/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating criterion ${id}:`, error)
    throw new Error('Failed to update criterion')
  }
}

// Delete a criterion
export async function deleteCriterion(id: string): Promise<void> {
  try {
    await axios.delete(`/api/criteria/${id}`)
  } catch (error) {
    console.error(`Error deleting criterion ${id}:`, error)
    throw new Error('Failed to delete criterion')
  }
}

// Utility function to calculate total weights
export function calculateTotalWeight(criteria: Criterion[]): number {
  return criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
}

// Validate criterion weights (ensure they sum to 100)
export function validateCriterionWeights(criteria: Criterion[]): boolean {
  const totalWeight = calculateTotalWeight(criteria)
  return Math.abs(totalWeight - 100) < 0.001 // Using small epsilon for float comparison
}

// Sort criteria by various fields
export function sortCriteria(
  criteria: Criterion[],
  direction: 'asc' | 'desc',
  field: keyof Criterion
): Criterion[] {
  return [...criteria].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (aValue === undefined && bValue === undefined) {
      return 0;
    } else if (aValue === undefined) {
      return direction === 'asc' ? -1 : 1;
    } else if (bValue === undefined) {
      return direction === 'asc' ? 1 : -1;
    } else {
      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
      }
    }
  });
}

// Filter criteria by votable status
export function filterCriteriaByVotable(
  criteria: Criterion[],
  votable: boolean
): Criterion[] {
  return criteria.filter(criterion => criterion.isVotable === votable)
}

// Search criteria by name or description
export function searchCriteria(
  criteria: Criterion[],
  searchTerm: string
): Criterion[] {
  const lowercaseSearchTerm = searchTerm.toLowerCase()
  return criteria.filter(criterion => 
    criterion.name.toLowerCase().includes(lowercaseSearchTerm) ||
    criterion.description?.toLowerCase().includes(lowercaseSearchTerm)
  )
}

// Group criteria by weight ranges
export function groupCriteriaByWeightRange(
  criteria: Criterion[],
  ranges: [number, number][]
): Record<string, Criterion[]> {
  return ranges.reduce((acc, [min, max]) => {
    const key = `${min}-${max}`
    acc[key] = criteria.filter(
      criterion => criterion.weight >= min && criterion.weight <= max
    )
    return acc
  }, {} as Record<string, Criterion[]>)
}