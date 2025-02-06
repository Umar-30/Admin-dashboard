export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-04'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skUvafD00ALHFhQJg7gM6LdCRBZRl47SaejcgjB4YsyWGr3kO7kmFRk5pEWLNGl27uiZ9Y4f29HQCLNX0aVtKaAcsiIK7TR4qZnam0Q9XOhxdKjaIVpcQbeOhyyj7FujOcRZ1HBvfXaaSls2cd7ZBJ17dag4pvLVPfN9U30KzI6vG4EKaew4",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
