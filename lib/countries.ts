export interface Country {
  code: string
  name: string
  dialCode: string
}

const countries: Country[] = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'KR', name: 'South Korea', dialCode: '+82' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
  // Add more countries as needed
]

export default countries 