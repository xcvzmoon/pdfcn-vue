export type MedicalIntakeFormProps = {
  clinicName: string;
  clinicLogo?: string | undefined;
  clinicAddress?: string | undefined;
  clinicPhone?: string | undefined;
  /** @default true */
  personalInfo?: boolean | undefined;
  /** @default true */
  emergencyContact?: boolean | undefined;
  /** @default true */
  insurance?: boolean | undefined;
  /** @default true */
  medicalHistory?: boolean | undefined;
  /** @default true */
  medications?: boolean | undefined;
  /** @default true */
  allergies?: boolean | undefined;
  /** @default true */
  reasonForVisit?: boolean | undefined;
  /** @default true */
  consent?: boolean | undefined;
  /**
   * Theme color token (e.g. `"primary"`) or raw CSS color (e.g. `"#0d9488"`)
   * applied to section rules, table accents, and the consent callout.
   */
  accentColor?: string | undefined;
};
