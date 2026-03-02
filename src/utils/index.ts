/**
 * Formats a phone number string to (xxx)-xxx-xxxx format
 * @param phoneNumber - The phone number string to format (can contain digits, spaces, dashes, etc.)
 * @returns Formatted phone number in (xxx)-xxx-xxxx format, or original value if invalid
 */
export const formatPhoneNumber = (phoneNumber: string | null | undefined): string => {
  if (!phoneNumber) return ''

  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '')

  // Check if we have exactly 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  // Return original value if not 10 digits
  return phoneNumber
}

/**
 * Formats a phone number as the user types, progressively adding formatting
 * @param value - The current input value
 * @returns Formatted phone number with progressive formatting: (xxx)-xxx-xxxx
 */
export const formatPhoneNumberAsTyped = (value: string): string => {
  if (!value) return ''

  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')

  // Limit to 10 digits
  const limitedDigits = digits.slice(0, 10)

  // Apply progressive formatting
  if (limitedDigits.length <= 3) {
    return limitedDigits.length > 0 ? `(${limitedDigits}` : limitedDigits
  } else if (limitedDigits.length <= 6) {
    return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3)}`
  } else {
    return `(${limitedDigits.slice(0, 3)})-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`
  }
}

/**
 * Strips phone number formatting to return raw digits only
 * @param phoneNumber - The formatted phone number string
 * @returns Raw digits only
 */
export const stripPhoneNumberFormatting = (phoneNumber: string | null | undefined): string => {
  if (!phoneNumber) return ''
  return phoneNumber.replace(/\D/g, '')
}
