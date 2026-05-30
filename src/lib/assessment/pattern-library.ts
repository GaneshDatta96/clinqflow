export type PatternDefinition = {
  key: string;
  label: string;
  requiredSymptoms: string[];
  supportingSymptoms: string[];
  contextSignals: string[];
  redFlags: string[];
  assessmentHints: string[];
  dataGapPrompts: string[];
};

export const patternLibrary: PatternDefinition[] = [
  {
    key: "digestive_pattern",
    label: "Digestive-related intake theme",
    requiredSymptoms: ["bloating"],
    supportingSymptoms: ["gas", "constipation", "diarrhea", "brain_fog"],
    contextSignals: ["processed_diet", "high_stress", "recent_antibiotics"],
    redFlags: ["blood_in_stool", "unintentional_weight_loss"],
    assessmentHints: [
      "Intake responses note digestive-related symptoms — practitioner to interpret.",
      "Submitted intake includes GI-related context requiring clinical correlation.",
    ],
    dataGapPrompts: ["bowel movement frequency", "food triggers", "prior GI workup"],
  },
  {
    key: "fatigue_pattern",
    label: "Fatigue and recovery intake theme",
    requiredSymptoms: ["fatigue"],
    supportingSymptoms: ["brain_fog", "poor_sleep", "headaches"],
    contextSignals: ["poor_sleep", "high_stress", "sedentary"],
    redFlags: [],
    assessmentHints: [
      "Intake responses note fatigue and recovery-related items — practitioner to interpret.",
      "Submitted intake includes recovery-related context for clinical review.",
    ],
    dataGapPrompts: ["energy fluctuations", "caffeine use", "recent lab work"],
  },
  {
    key: "stress_sleep_pattern",
    label: "Stress and sleep intake theme",
    requiredSymptoms: ["poor_sleep"],
    supportingSymptoms: ["high_stress", "fatigue", "headaches", "brain_fog"],
    contextSignals: ["high_stress", "poor_sleep"],
    redFlags: [],
    assessmentHints: [
      "Intake responses note stress and sleep-related items — practitioner to interpret.",
      "Submitted intake includes sleep-stress context for clinical review.",
    ],
    dataGapPrompts: ["sleep onset latency", "night waking pattern", "stress coping strategies"],
  },
  {
    key: "mechanical_pain_pattern",
    label: "Mechanical pain intake theme",
    requiredSymptoms: ["low_back_pain"],
    supportingSymptoms: ["neck_pain", "joint_pain", "headaches", "numbness_weakness"],
    contextSignals: ["sedentary", "mechanical_trigger"],
    redFlags: ["numbness_weakness"],
    assessmentHints: [
      "Intake responses note musculoskeletal pain items — practitioner to interpret.",
      "Submitted intake includes mechanical pain context; red flag screening remains with clinician.",
    ],
    dataGapPrompts: ["injury mechanism", "radiation pattern", "movement limitations"],
  },
  {
    key: "inflammatory_pattern",
    label: "Inflammatory intake theme",
    requiredSymptoms: ["joint_pain"],
    supportingSymptoms: ["fatigue", "poor_sleep", "headaches"],
    contextSignals: ["inflammatory_history", "high_stress"],
    redFlags: ["unintentional_weight_loss"],
    assessmentHints: [
      "Intake responses note inflammatory-related items — practitioner to interpret.",
      "Submitted intake includes broader symptom context for clinical review.",
    ],
    dataGapPrompts: ["morning stiffness", "known autoimmune history", "prior inflammatory markers"],
  },
  {
    key: "metabolic_pattern",
    label: "Metabolic intake theme",
    requiredSymptoms: ["weight_gain"],
    supportingSymptoms: ["fatigue", "sugar_cravings", "poor_sleep"],
    contextSignals: ["sugar_heavy_diet", "sedentary", "family_metabolic_history"],
    redFlags: [],
    assessmentHints: [
      "Intake responses note metabolic-related items — practitioner to interpret.",
      "Submitted intake includes lifestyle context for clinical review.",
    ],
    dataGapPrompts: ["meal timing", "fasting labs", "weight trend"],
  },
];
